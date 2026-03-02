// =============================================
// Term Result Service — Aggregation & Report Cards
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');
const { getGradeLetter, computeGPA, computeClassPositions, getOrdinalSuffix } = require('../utils/grading');

class TermResultService {
  constructor() {
    this.db = getSupabaseAdmin();
  }

  // Get CA config for a school (weights)
  async getCAConfig(schoolId, sessionId) {
    let query = this.db.from('ca_config').select('*').eq('school_id', schoolId);
    if (sessionId) query = query.eq('session_id', sessionId);
    const { data } = await query.limit(1).single();
    return data || { test_weight: 20, assignment_weight: 10, project_weight: 10, exam_weight: 60 };
  }

  // Get grading scale for a school
  async getGradingScale(schoolId) {
    const { data } = await this.db
      .from('grading_scales')
      .select('*')
      .eq('school_id', schoolId)
      .eq('is_default', true)
      .single();
    return data?.scale || null;
  }

  // Calculate term result for one student in one subject
  async calculateTermResult(studentId, subjectId, termId, schoolId) {
    const caConfig = await this.getCAConfig(schoolId);
    const gradingScale = await this.getGradingScale(schoolId);

    // Fetch all assessment scores for this student/subject/term
    const { data: scores } = await this.db
      .from('assessment_scores')
      .select('score, assessments(assessment_type, max_score, weight)')
      .eq('student_id', studentId)
      .in('assessments.subject_id', [subjectId])
      .in('assessments.term_id', [termId]);

    const grouped = { test: [], assignment: [], project: [], classwork: [], homework: [] };
    (scores || []).forEach(s => {
      if (s.assessments) {
        const type = s.assessments.assessment_type;
        const pct = s.assessments.max_score > 0 ? (s.score / s.assessments.max_score) * 100 : 0;
        if (grouped[type]) grouped[type].push(pct);
      }
    });

    const avg = arr => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const testAvg = avg(grouped.test);
    const assignmentAvg = avg([...grouped.assignment, ...grouped.homework]);
    const projectAvg = avg([...grouped.project, ...grouped.classwork]);

    // Scale CA components to their weights
    const caTest = (testAvg / 100) * caConfig.test_weight;
    const caAssignment = (assignmentAvg / 100) * caConfig.assignment_weight;
    const caProject = (projectAvg / 100) * caConfig.project_weight;
    const caTotal = Math.round((caTest + caAssignment + caProject) * 10) / 10;

    // Get exam score (from exam_submissions for this subject/term)
    const { data: examSub } = await this.db
      .from('exam_submissions')
      .select('percentage')
      .eq('student_id', studentId)
      .in('exams.subject_id', [subjectId])
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single();

    const examPct = examSub?.percentage || 0;
    const examScore = (examPct / 100) * caConfig.exam_weight;

    const totalScore = Math.round((caTotal + examScore) * 10) / 10;
    const percentage = Math.round(totalScore);
    const grade = getGradeLetter(percentage, gradingScale);

    // Get student class info
    const { data: student } = await this.db
      .from('profiles')
      .select('class')
      .eq('id', studentId)
      .single();

    const result = {
      school_id: schoolId,
      student_id: studentId,
      subject_id: subjectId,
      term_id: termId,
      class: student?.class || '',
      ca_test_score: Math.round(caTest * 10) / 10,
      ca_assignment_score: Math.round(caAssignment * 10) / 10,
      ca_project_score: Math.round(caProject * 10) / 10,
      ca_total: caTotal,
      exam_score: Math.round(examScore * 10) / 10,
      total_score: totalScore,
      percentage,
      grade_letter: grade.letter,
      grade_remark: grade.remark,
      gpa: grade.gpa,
      updated_at: new Date().toISOString()
    };

    // Upsert
    const { data: saved, error } = await this.db
      .from('term_results')
      .upsert(result, { onConflict: 'student_id,subject_id,term_id' })
      .select()
      .single();
    if (error) throw error;
    return saved;
  }

  // Generate full report card data for a student
  async generateReportData(studentId, termId) {
    const { data: student } = await this.db
      .from('profiles')
      .select('*, schools(name, logo_url, motto, address, phone)')
      .eq('id', studentId)
      .single();

    const { data: term } = await this.db
      .from('term_config')
      .select('*, academic_sessions(name)')
      .eq('id', termId)
      .single();

    const { data: results } = await this.db
      .from('term_results')
      .select('*, subjects(name, icon)')
      .eq('student_id', studentId)
      .eq('term_id', termId)
      .order('subjects(name)');

    const { data: reportCard } = await this.db
      .from('report_cards')
      .select('*')
      .eq('student_id', studentId)
      .eq('term_id', termId)
      .single();

    // Compute overall stats
    const subjectResults = results || [];
    const totalSubjects = subjectResults.length;
    const totalScore = subjectResults.reduce((sum, r) => sum + r.total_score, 0);
    const avgPct = totalSubjects > 0 ? Math.round(totalScore / totalSubjects) : 0;
    const overallGPA = computeGPA(subjectResults);

    return {
      student,
      term,
      session: term?.academic_sessions,
      subjects: subjectResults,
      reportCard: reportCard || {},
      summary: {
        totalSubjects,
        totalScore: Math.round(totalScore * 10) / 10,
        averagePercentage: avgPct,
        overallGPA,
        gradeLetter: getGradeLetter(avgPct).letter,
        position: reportCard?.class_position,
        classSize: reportCard?.class_size
      }
    };
  }

  // Compute class positions for all students in a class/term
  async computeClassPositions(schoolId, className, termId) {
    const { data: results } = await this.db
      .from('term_results')
      .select('student_id, percentage')
      .eq('school_id', schoolId)
      .eq('class', className)
      .eq('term_id', termId);

    if (!results || results.length === 0) return [];

    // Group by student, compute average percentage across subjects
    const studentMap = {};
    results.forEach(r => {
      if (!studentMap[r.student_id]) studentMap[r.student_id] = { student_id: r.student_id, scores: [] };
      studentMap[r.student_id].scores.push(r.percentage);
    });

    const studentAverages = Object.values(studentMap).map(s => ({
      student_id: s.student_id,
      total_percentage: Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length)
    }));

    const ranked = computeClassPositions(studentAverages);

    // Update report_cards with positions
    for (const entry of ranked) {
      await this.db
        .from('report_cards')
        .upsert({
          school_id: schoolId,
          student_id: entry.student_id,
          term_id: termId,
          class: className,
          average_percentage: entry.total_percentage,
          class_position: entry.position,
          class_size: ranked.length,
          overall_gpa: 0, // will be updated separately
          updated_at: new Date().toISOString()
        }, { onConflict: 'student_id,term_id' });
    }

    return ranked;
  }

  // Get term results for display
  async getTermResults(schoolId, className, termId) {
    const { data, error } = await this.db
      .from('term_results')
      .select('*, profiles:student_id(full_name, class_section), subjects(name)')
      .eq('school_id', schoolId)
      .eq('class', className)
      .eq('term_id', termId)
      .order('profiles(full_name)');
    if (error) throw error;
    return data || [];
  }
}

module.exports = new TermResultService();
