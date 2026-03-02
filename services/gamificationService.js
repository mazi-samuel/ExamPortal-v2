// =============================================
// Gamification Service — Badges, Points, Leaderboards
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class GamificationService {
  constructor() {
    this.db = getSupabaseAdmin();
  }

  // ---- Points ----

  async awardPoints(studentId, schoolId, points, reason, sourceType, sourceId) {
    const { data, error } = await this.db
      .from('student_points')
      .insert({
        student_id: studentId,
        school_id: schoolId,
        points,
        reason,
        source_type: sourceType || null,
        source_id: sourceId || null
      })
      .select()
      .single();
    if (error) throw error;

    // Check for badge eligibility after awarding points
    await this.checkBadgeEligibility(studentId, schoolId);

    return data;
  }

  async getStudentTotalPoints(studentId, schoolId) {
    const { data } = await this.db.rpc('get_student_total_points', {
      p_student_id: studentId,
      p_school_id: schoolId
    });
    return data || 0;
  }

  async getPointsHistory(studentId, schoolId, limit = 20) {
    const { data } = await this.db
      .from('student_points')
      .select('*')
      .eq('student_id', studentId)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  // ---- Badges ----

  async getBadges(schoolId) {
    const { data } = await this.db
      .from('badges')
      .select('*')
      .or(`school_id.eq.${schoolId},school_id.is.null`)
      .order('name');
    return data || [];
  }

  async getStudentBadges(studentId) {
    const { data } = await this.db
      .from('student_badges')
      .select('*, badges(*)')
      .eq('student_id', studentId)
      .order('earned_at', { ascending: false });
    return data || [];
  }

  async awardBadge(studentId, badgeId) {
    const { data, error } = await this.db
      .from('student_badges')
      .upsert({ student_id: studentId, badge_id: badgeId }, { onConflict: 'student_id,badge_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async checkBadgeEligibility(studentId, schoolId) {
    const badges = await this.getBadges(schoolId);
    const existingBadges = await this.getStudentBadges(studentId);
    const earnedBadgeIds = new Set(existingBadges.map(b => b.badge_id));

    for (const badge of badges) {
      if (earnedBadgeIds.has(badge.id)) continue;

      const criteria = badge.criteria;
      const eligible = await this._evaluateCriteria(studentId, schoolId, criteria);
      if (eligible) {
        await this.awardBadge(studentId, badge.id);
        logger.info(`Badge "${badge.name}" awarded to student ${studentId}`);
      }
    }
  }

  async _evaluateCriteria(studentId, schoolId, criteria) {
    if (!criteria || !criteria.type) return false;

    switch (criteria.type) {
      case 'exam_score': {
        const { data } = await this.db
          .from('exam_submissions')
          .select('percentage')
          .eq('student_id', studentId)
          .gte('percentage', criteria.threshold || 90)
          .not('submitted_at', 'is', null)
          .limit(1);
        return data && data.length > 0;
      }
      case 'total_points': {
        const total = await this.getStudentTotalPoints(studentId, schoolId);
        return total >= (criteria.threshold || 100);
      }
      case 'assignment_streak': {
        const { count } = await this.db
          .from('assignment_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('student_id', studentId)
          .eq('is_late', false)
          .eq('status', 'graded');
        return (count || 0) >= (criteria.threshold || 5);
      }
      case 'attendance_rate': {
        const { data } = await this.db.rpc('get_attendance_stats', {
          p_student_id: studentId,
          p_start_date: null,
          p_end_date: null
        });
        const stats = data?.[0];
        return stats && stats.attendance_rate >= (criteria.threshold || 95);
      }
      case 'forum_posts': {
        const { count } = await this.db
          .from('discussion_posts')
          .select('id', { count: 'exact', head: true })
          .eq('author_id', studentId);
        return (count || 0) >= (criteria.threshold || 10);
      }
      default:
        return false;
    }
  }

  // ---- Leaderboards ----

  async updateLeaderboard(schoolId, className, period) {
    // Get all students in this school/class
    let query = this.db
      .from('student_points')
      .select('student_id, points')
      .eq('school_id', schoolId);

    // Filter by period
    if (period === 'daily') {
      query = query.gte('created_at', new Date(Date.now() - 86400000).toISOString());
    } else if (period === 'weekly') {
      query = query.gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());
    } else if (period === 'monthly') {
      query = query.gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString());
    }

    const { data: points } = await query;

    // Aggregate by student
    const studentMap = {};
    (points || []).forEach(p => {
      if (!studentMap[p.student_id]) studentMap[p.student_id] = 0;
      studentMap[p.student_id] += p.points;
    });

    // Sort and rank
    const entries = Object.entries(studentMap)
      .map(([student_id, total_points]) => ({ student_id, total_points }))
      .sort((a, b) => b.total_points - a.total_points);

    // Upsert leaderboard entries
    const records = entries.map((e, idx) => ({
      school_id: schoolId,
      class: className || null,
      period,
      student_id: e.student_id,
      total_points: e.total_points,
      rank: idx + 1,
      updated_at: new Date().toISOString()
    }));

    if (records.length > 0) {
      await this.db
        .from('leaderboards')
        .upsert(records, { onConflict: 'school_id,class,period,student_id' });
    }

    return records;
  }

  async getLeaderboard(schoolId, className, period, limit = 20) {
    let query = this.db
      .from('leaderboards')
      .select('*, profiles:student_id(full_name, avatar_url, class)')
      .eq('school_id', schoolId)
      .eq('period', period || 'all_time');

    if (className) query = query.eq('class', className);

    const { data } = await query.order('rank').limit(limit);
    return data || [];
  }
}

module.exports = new GamificationService();
