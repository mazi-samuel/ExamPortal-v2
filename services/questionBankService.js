// =============================================
// Question Bank Service
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class QuestionBankService {
  constructor() {
    this.db = getSupabaseAdmin();
  }

  // ---- CRUD ----

  async addQuestion(data) {
    const { data: question, error } = await this.db
      .from('question_bank')
      .insert(data)
      .select()
      .single();
    if (error) throw error;

    // Save initial version
    await this.db.from('question_bank_history').insert({
      question_id: question.id,
      version: 1,
      question_text: question.question_text,
      options: question.options,
      correct_answer: question.correct_answer,
      changed_by: data.created_by
    });

    return question;
  }

  async updateQuestion(id, updates, changedBy) {
    // Get current version
    const { data: current } = await this.db.from('question_bank').select('version').eq('id', id).single();
    const newVersion = (current?.version || 0) + 1;

    updates.version = newVersion;
    updates.updated_at = new Date().toISOString();

    const { data: question, error } = await this.db
      .from('question_bank')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    // Save version history
    await this.db.from('question_bank_history').insert({
      question_id: id,
      version: newVersion,
      question_text: question.question_text,
      options: question.options,
      correct_answer: question.correct_answer,
      changed_by: changedBy
    });

    return question;
  }

  async deactivateQuestion(id) {
    const { error } = await this.db
      .from('question_bank')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  async getQuestion(id) {
    const { data, error } = await this.db
      .from('question_bank')
      .select('*, question_bank_history(version, changed_at, changed_by)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  // ---- Search & Filter ----

  async searchQuestions(schoolId, filters = {}) {
    let query = this.db
      .from('question_bank')
      .select('*, subjects(name)')
      .eq('school_id', schoolId)
      .eq('is_active', true);

    if (filters.subject_id) query = query.eq('subject_id', filters.subject_id);
    if (filters.class) query = query.eq('class', filters.class);
    if (filters.topic) query = query.ilike('topic', `%${filters.topic}%`);
    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);
    if (filters.question_type) query = query.eq('question_type', filters.question_type);
    if (filters.tags && filters.tags.length > 0) query = query.overlaps('tags', filters.tags);
    if (filters.search) query = query.ilike('question_text', `%${filters.search}%`);

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw error;
    return { questions: data || [], total: count };
  }

  // ---- Randomized Paper Generation ----

  async generatePaper(schoolId, options) {
    const {
      subject_id, class: className,
      mcq_count = 20, fill_count = 5, theory_count = 5,
      difficulty_mix = null, // e.g. { easy: 30, medium: 50, hard: 20 } percentages
      topic_filter = null    // array of topics to include
    } = options;

    const fetchByType = async (type, count) => {
      let query = this.db
        .from('question_bank')
        .select('*')
        .eq('school_id', schoolId)
        .eq('is_active', true)
        .eq('question_type', type);

      if (subject_id) query = query.eq('subject_id', subject_id);
      if (className) query = query.eq('class', className);
      if (topic_filter) query = query.in('topic', topic_filter);

      const { data } = await query;
      const pool = data || [];

      // Shuffle and pick
      const shuffled = pool.sort(() => Math.random() - 0.5);

      if (difficulty_mix) {
        return this._pickByDifficulty(shuffled, count, difficulty_mix);
      }

      return shuffled.slice(0, count);
    };

    const mcqs = await fetchByType('mcq', mcq_count);
    const fills = await fetchByType('fill_blank', fill_count);
    const theories = await fetchByType('theory', theory_count);

    // Increment usage counts
    const allIds = [...mcqs, ...fills, ...theories].map(q => q.id);
    if (allIds.length > 0) {
      for (const id of allIds) {
        await this.db.rpc('increment_usage', { qid: id }).catch(() => {
          // RPC may not exist yet — silently skip
        });
      }
    }

    return {
      sections: {
        objectives: { questions: mcqs, count: mcqs.length },
        fillBlanks: { questions: fills, count: fills.length },
        theory: { questions: theories, count: theories.length }
      },
      totalQuestions: mcqs.length + fills.length + theories.length
    };
  }

  _pickByDifficulty(pool, count, mix) {
    const result = [];
    const byDifficulty = { easy: [], medium: [], hard: [] };
    pool.forEach(q => {
      if (byDifficulty[q.difficulty]) byDifficulty[q.difficulty].push(q);
    });

    for (const [diff, pct] of Object.entries(mix)) {
      const need = Math.round((pct / 100) * count);
      result.push(...(byDifficulty[diff] || []).slice(0, need));
    }

    // Fill remaining from any difficulty
    const remaining = count - result.length;
    if (remaining > 0) {
      const usedIds = new Set(result.map(q => q.id));
      const extras = pool.filter(q => !usedIds.has(q.id)).slice(0, remaining);
      result.push(...extras);
    }

    return result;
  }

  // ---- Bulk Import (CSV) ----

  async bulkImport(schoolId, questions, createdBy) {
    const records = questions.map(q => ({
      school_id: schoolId,
      subject_id: q.subject_id || null,
      class: q.class || null,
      topic: q.topic || null,
      subtopic: q.subtopic || null,
      question_text: q.question_text,
      question_type: q.question_type || 'mcq',
      options: q.options || null,
      correct_answer: q.correct_answer || null,
      explanation: q.explanation || null,
      difficulty: q.difficulty || 'medium',
      marks: q.marks || 1,
      tags: q.tags || [],
      created_by: createdBy
    }));

    const { data, error } = await this.db
      .from('question_bank')
      .insert(records)
      .select();
    if (error) throw error;
    return { imported: (data || []).length };
  }

  // ---- Topic Tags Management ----

  async getTopicTags(schoolId, subjectId) {
    let query = this.db.from('topic_tags').select('*').eq('school_id', schoolId);
    if (subjectId) query = query.eq('subject_id', subjectId);
    const { data } = await query.order('name');
    return data || [];
  }

  async createTopicTag(data) {
    const { data: tag, error } = await this.db
      .from('topic_tags')
      .upsert(data, { onConflict: 'school_id,subject_id,name,class' })
      .select()
      .single();
    if (error) throw error;
    return tag;
  }
}

module.exports = new QuestionBankService();
