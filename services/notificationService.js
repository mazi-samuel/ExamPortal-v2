// =============================================
// Notification Service — Multi-channel
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const config = require('../config');
const logger = require('../utils/logger');

class NotificationService {
  constructor() {
    this.db = getSupabaseAdmin();
  }

  // Send an in-app notification
  async send(notification) {
    const { recipient_id, sender_id, type, title, message, link, school_id, metadata } = notification;

    const { data, error } = await this.db
      .from('notifications')
      .insert({
        school_id,
        recipient_id,
        sender_id: sender_id || null,
        type,
        title,
        message,
        link: link || null,
        channel: 'in_app',
        metadata: metadata || {}
      })
      .select()
      .single();
    if (error) {
      logger.error('Failed to send notification', error.message);
      throw error;
    }

    // Check user preferences and send via other channels
    await this._sendExternalChannels(notification);

    return data;
  }

  // Send to multiple recipients
  async sendBulk(recipients, notificationData) {
    const records = recipients.map(recipientId => ({
      school_id: notificationData.school_id,
      recipient_id: recipientId,
      sender_id: notificationData.sender_id || null,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      link: notificationData.link || null,
      channel: 'in_app',
      metadata: notificationData.metadata || {}
    }));

    const { data, error } = await this.db
      .from('notifications')
      .insert(records)
      .select();
    if (error) throw error;
    return data;
  }

  // Get notifications for a user
  async getUserNotifications(userId, options = {}) {
    let query = this.db
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId);

    if (options.unreadOnly) query = query.eq('is_read', false);
    if (options.type) query = query.eq('type', options.type);

    const limit = options.limit || 50;
    query = query.order('created_at', { ascending: false }).limit(limit);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Get unread count
  async getUnreadCount(userId) {
    const { count, error } = await this.db
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);
    if (error) throw error;
    return count || 0;
  }

  // Mark as read
  async markAsRead(notificationId, userId) {
    const { error } = await this.db
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('recipient_id', userId);
    if (error) throw error;
  }

  // Mark all as read
  async markAllAsRead(userId) {
    const { error } = await this.db
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('recipient_id', userId)
      .eq('is_read', false);
    if (error) throw error;
  }

  // Get/set user notification preferences
  async getPreferences(userId) {
    const { data } = await this.db
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data || {
      email_enabled: true,
      sms_enabled: false,
      push_enabled: true,
      in_app_enabled: true,
      disabled_types: []
    };
  }

  async updatePreferences(userId, prefs) {
    const { data, error } = await this.db
      .from('notification_preferences')
      .upsert({ user_id: userId, ...prefs, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // ---- Specific notification triggers ----

  async notifyExamReminder(examData, studentIds, schoolId) {
    return this.sendBulk(studentIds, {
      school_id: schoolId,
      type: 'exam_reminder',
      title: `Exam Reminder: ${examData.title}`,
      message: `Your exam "${examData.title}" is scheduled for ${examData.exam_date}. Duration: ${examData.duration_minutes} minutes.`,
      link: `/take-exam.html?id=${examData.id}`
    });
  }

  async notifyAssignmentDeadline(assignment, studentIds, schoolId) {
    return this.sendBulk(studentIds, {
      school_id: schoolId,
      type: 'assignment_deadline',
      title: `Assignment Due: ${assignment.title}`,
      message: `Your assignment "${assignment.title}" is due on ${new Date(assignment.due_date).toLocaleDateString()}.`,
      link: `/assignments.html?id=${assignment.id}`
    });
  }

  async notifyAbsence(studentId, parentIds, date, schoolId) {
    return this.sendBulk(parentIds, {
      school_id: schoolId,
      type: 'absence_alert',
      title: 'Absence Alert',
      message: `Your child was marked absent on ${date}.`,
      link: '/parent-dashboard.html#attendance'
    });
  }

  async notifyResultPublished(studentId, termName, schoolId) {
    return this.send({
      school_id: schoolId,
      recipient_id: studentId,
      type: 'result_published',
      title: 'Results Published',
      message: `Your ${termName} term results have been published. View your report card now.`,
      link: '/student-dashboard.html#results'
    });
  }

  // ---- External channel dispatch (email, SMS, push) ----

  async _sendExternalChannels(notification) {
    const prefs = await this.getPreferences(notification.recipient_id);

    if (prefs.disabled_types && prefs.disabled_types.includes(notification.type)) {
      return; // User has disabled this notification type
    }

    // Push notification
    if (prefs.push_enabled && config.notifications.push.enabled) {
      await this._sendPush(notification);
    }

    // Email (abstracted — implement with your provider)
    if (prefs.email_enabled && config.notifications.email.enabled) {
      logger.info(`[Email] Would send to ${notification.recipient_id}: ${notification.title}`);
      // TODO: Implement email provider integration
    }

    // SMS
    if (prefs.sms_enabled && config.notifications.sms.enabled) {
      logger.info(`[SMS] Would send to ${notification.recipient_id}: ${notification.title}`);
      // TODO: Implement SMS provider integration
    }
  }

  async _sendPush(notification) {
    try {
      const { data: subs } = await this.db
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', notification.recipient_id);

      if (!subs || subs.length === 0) return;

      // TODO: Use web-push library to send
      logger.info(`[Push] Would send ${subs.length} push(es) to ${notification.recipient_id}`);
    } catch (err) {
      logger.warn('Push notification failed', err.message);
    }
  }
}

module.exports = new NotificationService();
