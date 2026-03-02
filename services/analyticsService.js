// =============================================
// Analytics Service — Performance Insights
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class AnalyticsService {
  constructor() {
    this.db = getSupabaseAdmin();
  }

  // ---- Student Analytics ----

  async getStudentOverview(studentId, schoolId) {
    const [examStats, attendanceStats, assignmentStats, points] = await Promise.all([
      this._getStudentExamStats(studentId),
      this._getStudentAttendanceStats(studentId),
      this._getStudentAssignmentStats(studentId),
      this._getStudentPoints(studentId, schoolId)
    ]);

    return { exams: examStats, attendance: attendanceStats, assignments: assignmentStats, points };
  }

  async _getStudentExamStats(studentId) {
    const { data } = await this.db
      .from('exam_submissions')
      .select('percentage, grade_letter, submitted_at, exams(title, subjects(name))')
      .eq('student_id', studentId)
      .not('submitted_at', 'is', null)
      .order('submitted_at', { ascending: false });

    const submissions = data || [];
    if (submissions.length === 0) return { count: 0, average: 0, highest: 0, lowest: 0, trend: [] };

    const percentages = submissions.map(s => s.percentage || 0);
    return {
      count: submissions.length,
      average: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length),
      highest: Math.max(...percentages),
      lowest: Math.min(...percentages),
      trend: submissions.slice(0, 10).map(s => ({
        date: s.submitted_at,
        percentage: s.percentage,
        subject: s.exams?.subjects?.name || ''
      }))
    };
  }

  async _getStudentAttendanceStats(studentId) {
    const { data } = await this.db.rpc('get_attendance_stats', {
      p_student_id: studentId,
      p_start_date: null,
      p_end_date: null
    });
    return data?.[0] || { total_days: 0, present_days: 0, absent_days: 0, attendance_rate: 0 };
  }

  async _getStudentAssignmentStats(studentId) {
    const { data } = await this.db
      .from('assignment_submissions')
      .select('total_score, percentage, is_late, status')
      .eq('student_id', studentId);

    const subs = data || [];
    const graded = subs.filter(s => s.status === 'graded');
    return {
      total: subs.length,
      graded: graded.length,
      lateCount: subs.filter(s => s.is_late).length,
      averageScore: graded.length > 0
        ? Math.round(graded.reduce((a, s) => a + (s.percentage || 0), 0) / graded.length)
        : 0
    };
  }

  async _getStudentPoints(studentId, schoolId) {
    const { data } = await this.db
      .from('student_points')
      .select('points, reason, source_type, created_at')
      .eq('student_id', studentId)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(20);

    const total = (data || []).reduce((sum, p) => sum + p.points, 0);
    return { total, recent: data || [] };
  }

  // ---- Class Analytics ----

  async getClassOverview(schoolId, className, termId) {
    const [performance, attendance, topStudents] = await Promise.all([
      this._getClassPerformance(schoolId, className, termId),
      this._getClassAttendance(schoolId, className),
      this._getTopStudents(schoolId, className, termId)
    ]);

    return { performance, attendance, topStudents };
  }

  async _getClassPerformance(schoolId, className, termId) {
    if (!termId) return [];
    const { data } = await this.db.rpc('get_class_performance', {
      p_school_id: schoolId,
      p_class: className,
      p_term_id: termId
    });
    return data || [];
  }

  async _getClassAttendance(schoolId, className) {
    // Last 30 days attendance summary
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: sessions } = await this.db
      .from('attendance_sessions')
      .select('date, attendance_records(status)')
      .eq('school_id', schoolId)
      .eq('class', className)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('date');

    return (sessions || []).map(s => {
      const records = s.attendance_records || [];
      return {
        date: s.date,
        total: records.length,
        present: records.filter(r => r.status === 'present').length,
        absent: records.filter(r => r.status === 'absent').length,
        late: records.filter(r => r.status === 'late').length
      };
    });
  }

  async _getTopStudents(schoolId, className, termId) {
    if (!termId) return [];
    const { data } = await this.db
      .from('report_cards')
      .select('student_id, average_percentage, class_position, profiles:student_id(full_name)')
      .eq('school_id', schoolId)
      .eq('class', className)
      .eq('term_id', termId)
      .order('class_position')
      .limit(10);
    return data || [];
  }

  // ---- Subject/Topic Heatmap ----

  async getWeakTopics(schoolId, className, subjectId) {
    // Analyze exam question performance to identify weak topics
    const { data: questions } = await this.db
      .from('question_bank')
      .select('id, topic, question_type, usage_count, difficulty')
      .eq('school_id', schoolId)
      .eq('subject_id', subjectId)
      .eq('is_active', true);

    // This would require cross-referencing with submission answers
    // For now, return topic distribution
    const topicMap = {};
    (questions || []).forEach(q => {
      const topic = q.topic || 'General';
      if (!topicMap[topic]) topicMap[topic] = { topic, total: 0, byDifficulty: { easy: 0, medium: 0, hard: 0 } };
      topicMap[topic].total++;
      topicMap[topic].byDifficulty[q.difficulty]++;
    });

    return Object.values(topicMap).sort((a, b) => b.total - a.total);
  }

  // ---- Teacher Performance Summary ----

  async getTeacherSummary(teacherId, schoolId) {
    const [subjects, exams, assignments] = await Promise.all([
      this.db.from('subjects').select('id, name, class').eq('teacher_id', teacherId).then(r => r.data || []),
      this.db.from('exams').select('id, title, is_published, created_at').eq('created_by', teacherId).then(r => r.data || []),
      this.db.from('assignments').select('id, title, is_published').eq('created_by', teacherId).is('deleted_at', null).then(r => r.data || [])
    ]);

    return {
      subjectCount: subjects.length,
      subjects,
      examCount: exams.length,
      publishedExams: exams.filter(e => e.is_published).length,
      assignmentCount: assignments.length,
      publishedAssignments: assignments.filter(a => a.is_published).length
    };
  }

  // ---- School-wide Analytics ----

  async getSchoolDashboard(schoolId) {
    const [
      studentCount, teacherCount, parentCount,
      examCount, assignmentCount
    ] = await Promise.all([
      this.db.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', schoolId).eq('role', 'student').is('deleted_at', null).then(r => r.count || 0),
      this.db.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', schoolId).eq('role', 'teacher').is('deleted_at', null).then(r => r.count || 0),
      this.db.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', schoolId).eq('role', 'parent').is('deleted_at', null).then(r => r.count || 0),
      this.db.from('exams').select('id', { count: 'exact', head: true }).eq('school_id', schoolId).then(r => r.count || 0),
      this.db.from('assignments').select('id', { count: 'exact', head: true }).eq('school_id', schoolId).is('deleted_at', null).then(r => r.count || 0)
    ]);

    return { studentCount, teacherCount, parentCount, examCount, assignmentCount };
  }
}

module.exports = new AnalyticsService();
