// =============================================
// Assessment Service — Continuous Assessment
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');
const { getGradeLetter } = require('../utils/grading');

class AssessmentService {
  constructor() {
    this.db = getSupabaseAdmin();
  }

  // ---- Assessments CRUD ----

  async createAssessment(data) {
    const { data: assessment, error } = await this.db
      .from('assessments')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return assessment;
  }

  async getAssessments(schoolId, filters = {}) {
    let query = this.db
      .from('assessments')
      .select('*, subjects(name, icon)')
      .eq('school_id', schoolId);

    if (filters.class) query = query.eq('class', filters.class);
    if (filters.subject_id) query = query.eq('subject_id', filters.subject_id);
    if (filters.term_id) query = query.eq('term_id', filters.term_id);
    if (filters.assessment_type) query = query.eq('assessment_type', filters.assessment_type);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getAssessmentById(id) {
    const { data, error } = await this.db
      .from('assessments')
      .select('*, subjects(name, icon)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async updateAssessment(id, updates) {
    const { data, error } = await this.db
      .from('assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteAssessment(id) {
    const { error } = await this.db.from('assessments').delete().eq('id', id);
    if (error) throw error;
  }

  // ---- Scores ----

  async saveScores(assessmentId, scores, gradedBy) {
    // scores = [{ student_id, score, remarks }]
    const records = scores.map(s => ({
      assessment_id: assessmentId,
      student_id: s.student_id,
      score: s.score,
      remarks: s.remarks || null,
      graded_by: gradedBy
    }));

    const { data, error } = await this.db
      .from('assessment_scores')
      .upsert(records, { onConflict: 'assessment_id,student_id' })
      .select();
    if (error) throw error;
    return data;
  }

  async getScoresForAssessment(assessmentId) {
    const { data, error } = await this.db
      .from('assessment_scores')
      .select('*, profiles:student_id(full_name, class, class_section)')
      .eq('assessment_id', assessmentId)
      .order('profiles(full_name)');
    if (error) throw error;
    return data || [];
  }

  async getStudentScores(studentId, termId) {
    let query = this.db
      .from('assessment_scores')
      .select('*, assessments(title, assessment_type, max_score, subject_id, subjects(name))')
      .eq('student_id', studentId);

    if (termId) {
      query = query.eq('assessments.term_id', termId);
    }

    const { data, error } = await query.order('graded_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
}

module.exports = new AssessmentService();
