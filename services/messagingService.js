// =============================================
// Messaging Service — Parent-Teacher Communication
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class MessagingService {
  constructor() {
    this.db = getSupabaseAdmin();
  }

  // Get or create a conversation between two users
  async getOrCreateConversation(user1Id, user2Id, schoolId, subject) {
    // Normalize participant order
    const [p1, p2] = [user1Id, user2Id].sort();

    const { data: existing } = await this.db
      .from('conversations')
      .select('*')
      .or(`and(participant_1.eq.${p1},participant_2.eq.${p2}),and(participant_1.eq.${p2},participant_2.eq.${p1})`)
      .single();

    if (existing) return existing;

    const { data: conv, error } = await this.db
      .from('conversations')
      .insert({
        school_id: schoolId,
        participant_1: p1,
        participant_2: p2,
        subject: subject || null
      })
      .select()
      .single();
    if (error) throw error;
    return conv;
  }

  // Get conversations for a user
  async getUserConversations(userId) {
    const { data, error } = await this.db
      .from('conversations')
      .select(`
        *,
        p1:participant_1(full_name, role, avatar_url),
        p2:participant_2(full_name, role, avatar_url)
      `)
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    if (error) throw error;

    // Add unread count for each conversation
    const conversations = data || [];
    for (const conv of conversations) {
      const { count } = await this.db
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .neq('sender_id', userId)
        .not('id', 'in',
          this.db.from('message_reads').select('message_id').eq('user_id', userId)
        );
      conv.unread_count = count || 0;
    }

    return conversations;
  }

  // Send a message
  async sendMessage(conversationId, senderId, content, attachmentUrl) {
    const { data: message, error } = await this.db
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        attachment_url: attachmentUrl || null
      })
      .select()
      .single();
    if (error) throw error;

    // Update conversation last_message_at
    await this.db
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return message;
  }

  // Get messages in a conversation
  async getMessages(conversationId, userId, limit = 50, before) {
    let query = this.db
      .from('messages')
      .select('*, profiles:sender_id(full_name, avatar_url, role)')
      .eq('conversation_id', conversationId);

    if (before) query = query.lt('created_at', before);

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;

    // Mark messages as read
    const unread = (data || []).filter(m => m.sender_id !== userId);
    if (unread.length > 0) {
      const reads = unread.map(m => ({
        message_id: m.id,
        user_id: userId
      }));
      await this.db.from('message_reads').upsert(reads, { onConflict: 'message_id,user_id' });
    }

    return (data || []).reverse();
  }

  // Get total unread message count for a user
  async getTotalUnread(userId) {
    // Get all conversations the user is part of
    const { data: convs } = await this.db
      .from('conversations')
      .select('id')
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`);

    if (!convs || convs.length === 0) return 0;

    const convIds = convs.map(c => c.id);

    const { count } = await this.db
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', convIds)
      .neq('sender_id', userId)
      .not('id', 'in',
        this.db.from('message_reads').select('message_id').eq('user_id', userId)
      );

    return count || 0;
  }
}

module.exports = new MessagingService();
