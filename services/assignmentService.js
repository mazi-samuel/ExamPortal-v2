// =============================================
// Assignment Service
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class AssignmentService {
  constructor() {
    this.db = getSupabaseAdmin();
  }

  // ---- Assignments CRUD ----

  async createAssignment(data) {
    const { data: assignment, error } = await this.db
      .from('assignments')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return assignment;
  }

  async getAssignments(schoolId, filters = {}) {
    let query = this.db
      .from('assignments')
      .select('*, subjects(name, icon), profiles:created_by(full_name)')
      .eq('school_id', schoolId)
      .is('deleted_at', null);

    if (filters.class) query = query.eq('class', filters.class);
    if (filters.subject_id) query = query.eq('subject_id', filters.subject_id);
    if (filters.is_published !== undefined) query = query.eq('is_published', filters.is_published);

    const { data, error } = await query.order('due_date', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getAssignmentById(id) {
    const { data, error } = await this.db
      .from('assignments')
      .select('*, subjects(name, icon), assignment_rubrics(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async updateAssignment(id, updates) {
    updates.updated_at = new Date().toISOString();
    const { data, error } = await this.db
      .from('assignments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteAssignment(id) {
    // Soft delete
    const { error } = await this.db
      .from('assignments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  // ---- Rubrics ----

  async setRubrics(assignmentId, rubrics) {
    // Delete existing, then insert new
    await this.db.from('assignment_rubrics').delete().eq('assignment_id', assignmentId);
    if (rubrics.length === 0) return [];

    const records = rubrics.map((r, i) => ({
      assignment_id: assignmentId,
      criterion: r.criterion,
      max_points: r.max_points,
      description: r.description || null,
      sort_order: i
    }));

    const { data, error } = await this.db
      .from('assignment_rubrics')
      .insert(records)
      .select();
    if (error) throw error;
    return data;
  }

  // ---- Submissions ----

  async submitAssignment(assignmentId, studentId, payload) {
    // Check deadline
    const assignment = await this.getAssignmentById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    const isLate = now > dueDate;

    if (isLate && !assignment.allow_late) {
      throw new Error('Submission deadline has passed');
    }

    const submission = {
      assignment_id: assignmentId,
      student_id: studentId,
      file_urls: payload.file_urls || [],
      text_response: payload.text_response || null,
      is_late: isLate,
      status: 'submitted',
      submitted_at: now.toISOString()
    };

    const { data, error } = await this.db
      .from('assignment_submissions')
      .upsert(submission, { onConflict: 'assignment_id,student_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getSubmissions(assignmentId) {
    const { data, error } = await this.db
      .from('assignment_submissions')
      .select('*, profiles:student_id(full_name, class, class_section)')
      .eq('assignment_id', assignmentId)
      .order('submitted_at');
    if (error) throw error;
    return data || [];
  }

  async getStudentSubmissions(studentId, schoolId) {
    const { data, error } = await this.db
      .from('assignment_submissions')
      .select('*, assignments(title, due_date, max_score, subjects(name))')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async gradeSubmission(submissionId, grading) {
    const { total_score, percentage, grade_letter, feedback, rubric_scores, graded_by } = grading;

    // Update submission
    const { data: sub, error } = await this.db
      .from('assignment_submissions')
      .update({
        total_score,
        percentage,
        grade_letter,
        feedback,
        graded_by,
        graded_at: new Date().toISOString(),
        status: 'graded'
      })
      .eq('id', submissionId)
      .select()
      .single();
    if (error) throw error;

    // Save rubric scores if provided
    if (rubric_scores && rubric_scores.length > 0) {
      const records = rubric_scores.map(rs => ({
        submission_id: submissionId,
        rubric_id: rs.rubric_id,
        score: rs.score,
        comment: rs.comment || null
      }));

      await this.db
        .from('rubric_scores')
        .upsert(records, { onConflict: 'submission_id,rubric_id' });
    }

    return sub;
  }

  // Get available assignments for a student class
  async getAvailableAssignments(schoolId, className) {
    const { data, error } = await this.db
      .from('assignments')
      .select('*, subjects(name, icon)')
      .eq('school_id', schoolId)
      .eq('class', className)
      .eq('is_published', true)
      .is('deleted_at', null)
      .order('due_date', { ascending: false });
    if (error) throw error;
    return data || [];
  }
}

module.exports = new AssignmentService();
