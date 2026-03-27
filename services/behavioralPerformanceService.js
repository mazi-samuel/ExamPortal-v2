// =============================================
// Behavioral Performance Service
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class BehavioralPerformanceService {
  constructor() {
    this.db = getSupabaseAdmin();
  }

  // ====== PERFORMANCE LOGGING ======

  /**
   * Record daily student performance
   * @param {Object} data - { student_id, teacher_id, school_id, class, class_section, date, metric_scores, teacher_comment }
   */
  async recordPerformance(data) {
    try {
      const {
        student_id,
        teacher_id,
        school_id,
        class: classLevel,
        class_section,
        date,
        metric_scores, // { metric_id: score, ... }
        teacher_comment
      } = data;

      // Calculate overall and average scores
      const scores = Object.values(metric_scores);
      const overall_score = scores.reduce((a, b) => a + b, 0);
      const average_score = overall_score / scores.length;

      const { data: performance, error } = await this.db
        .from('student_performance')
        .insert({
          student_id,
          teacher_id,
          school_id,
          class: classLevel,
          class_section,
          date,
          metric_scores,
          overall_score,
          average_score,
          teacher_comment
        })
        .select()
        .single();

      if (error) throw error;

      // Generate insights and alerts
      await this.generateInsights(student_id, school_id, date);
      await this.checkAndCreateAlerts(student_id, school_id, metric_scores);

      return performance;
    } catch (error) {
      logger.error('Record performance error:', error);
      throw error;
    }
  }

  /**
   * Get performance records for a student
   */
  async getStudentPerformance(studentId, filters = {}) {
    try {
      let query = this.db
        .from('student_performance')
        .select('*, profiles!student_id(full_name, avatar_url)')
        .eq('student_id', studentId);

      // Apply filters
      if (filters.dateFrom && filters.dateTo) {
        query = query
          .gte('date', filters.dateFrom)
          .lte('date', filters.dateTo);
      }

      if (filters.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }

      const { data, error } = await query.order('date', { ascending: false });
      if (error) throw error;

      return data || [];
    } catch (error) {
      logger.error('Get student performance error:', error);
      throw error;
    }
  }

  /**
   * Get performance for a class
   */
  async getClassPerformance(schoolId, classLevel, date) {
    try {
      const { data, error } = await this.db
        .from('student_performance')
        .select(`
          *,
          profiles!student_id(full_name, avatar_url)
        `)
        .eq('school_id', schoolId)
        .eq('class', classLevel)
        .eq('date', date)
        .order('average_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Get class performance error:', error);
      throw error;
    }
  }

  /**
   * Update performance record
   */
  async updatePerformance(performanceId, updates) {
    try {
      // Recalculate scores if metric_scores changed
      if (updates.metric_scores) {
        const scores = Object.values(updates.metric_scores);
        updates.overall_score = scores.reduce((a, b) => a + b, 0);
        updates.average_score = updates.overall_score / scores.length;
      }

      updates.updated_at = new Date();

      const { data, error } = await this.db
        .from('student_performance')
        .update(updates)
        .eq('id', performanceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Update performance error:', error);
      throw error;
    }
  }

  // ====== INSIGHTS & ANALYSIS ======

  /**
   * Generate insights for a student's daily performance
   */
  async generateInsights(studentId, schoolId, date) {
    try {
      const { data: performance, error: perfError } = await this.db
        .from('student_performance')
        .select('*, performance_metrics(*)')
        .eq('student_id', studentId)
        .eq('school_id', schoolId)
        .eq('date', date)
        .single();

      if (perfError || !performance) return;

      const metric_scores = performance.metric_scores;
      const metrics = await this.getMetrics();

      // Identify strengths (score >= 4) and improvements (score <= 2)
      const strengths = [];
      const improvements = [];

      metrics.forEach(metric => {
        const score = metric_scores[metric.id];
        if (score >= 4) strengths.push(metric.name);
        if (score <= 2) improvements.push(metric.name);
      });

      // Generate narrative insight
      let trend_analysis = '';
      const avg = performance.average_score;
      if (avg >= 4.5) trend_analysis = 'Excellent overall performance. Keep up the good work!';
      else if (avg >= 3.5) trend_analysis = 'Good performance with areas for improvement.';
      else if (avg >= 2.5) trend_analysis = 'Mixed performance. Focus on improving weak areas.';
      else trend_analysis = 'Performance needs significant improvement.';

      let overall_insight = `Student shows strength in ${strengths.join(', ') || 'some areas'}. `;
      if (improvements.length > 0) {
        overall_insight += `Should focus on improving ${improvements.join(', ')}.`;
      }

      const { error: insertError } = await this.db
        .from('performance_insights')
        .upsert({
          student_id: studentId,
          school_id: schoolId,
          date,
          strengths,
          improvements,
          trend_analysis,
          overall_insight
        }, { onConflict: 'student_id,date,school_id' });

      if (insertError) throw insertError;
    } catch (error) {
      logger.error('Generate insights error:', error);
    }
  }

  /**
   * Check performance and create alerts
   */
  async checkAndCreateAlerts(studentId, schoolId, metric_scores) {
    try {
      const metrics = await this.getMetrics();
      const alerts = [];

      metrics.forEach(metric => {
        const score = metric_scores[metric.id];

        if (score <= 1) {
          alerts.push({
            student_id: studentId,
            school_id: schoolId,
            alert_type: 'critical',
            metric_name: metric.name,
            message: `Critical: ${metric.name} score is critically low (${score}/5)`
          });
        } else if (score === 2) {
          alerts.push({
            student_id: studentId,
            school_id: schoolId,
            alert_type: 'warning',
            metric_name: metric.name,
            message: `Warning: ${metric.name} needs improvement (${score}/5)`
          });
        }
      });

      if (alerts.length > 0) {
        const { error } = await this.db
          .from('performance_alerts')
          .insert(alerts);
        if (error) throw error;
      }
    } catch (error) {
      logger.error('Check and create alerts error:', error);
    }
  }

  /**
   * Get all metrics grouped by category
   */
  async getMetrics() {
    try {
      const { data, error } = await this.db
        .from('performance_metrics')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Get metrics error:', error);
      throw error;
    }
  }

  /**
   * Get metrics grouped by category
   */
  async getMetricsByCategory() {
    try {
      const metrics = await this.getMetrics();
      const grouped = {
        academic_engagement: [],
        social_skills: [],
        learning_behavior: [],
        classroom_conduct: [],
        personal_development: []
      };

      metrics.forEach(metric => {
        grouped[metric.category].push(metric);
      });

      return grouped;
    } catch (error) {
      logger.error('Get metrics by category error:', error);
      throw error;
    }
  }

  // ====== NOTIFICATIONS ======

  /**
   * Send daily summary to parents
   */
  async sendDailySummaryToParents(studentId, performanceDate) {
    try {
      // Get student and parent info
      const { data: student, error: studentError } = await this.db
        .from('profiles')
        .select('id, full_name, parent_name, parent_phone')
        .eq('id', studentId)
        .single();

      if (studentError || !student) throw new Error('Student not found');

      // Get performance data
      const { data: performance, error: perfError } = await this.db
        .from('student_performance')
        .select('*')
        .eq('student_id', studentId)
        .eq('date', performanceDate)
        .single();

      if (perfError || !performance) return;

      // Get insights
      const { data: insights } = await this.db
        .from('performance_insights')
        .select('*')
        .eq('student_id', studentId)
        .eq('date', performanceDate)
        .single();

      // Create notification
      const notification = {
        parent_id: studentId, // Link to parent profile (ideally should have parent_id in student profile)
        student_id: studentId,
        school_id: performance.school_id,
        notification_type: 'daily_summary',
        title: `Daily Performance Update for ${student.full_name}`,
        message: insights?.overall_insight || 'Performance recorded for today.',
        summary: {
          date: performanceDate,
          average_score: performance.average_score,
          overall_score: performance.overall_score,
          comment: performance.teacher_comment,
          strengths: insights?.strengths || [],
          improvements: insights?.improvements || []
        }
      };

      const { data: notif, error: notifError } = await this.db
        .from('parent_notifications')
        .insert(notification)
        .select()
        .single();

      if (notifError) throw notifError;

      // Here you would send SMS/Email to parent_phone
      await this.sendNotificationToParent(student.parent_phone, notification);

      return notif;
    } catch (error) {
      logger.error('Send daily summary error:', error);
    }
  }

  /**
   * Get parent notifications
   */
  async getParentNotifications(parentId, unreadOnly = false) {
    try {
      let query = this.db
        .from('parent_notifications')
        .select('*, profiles!student_id(full_name, avatar_url)')
        .eq('parent_id', parentId)
        .order('sent_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      logger.error('Get parent notifications error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await this.db
        .from('parent_notifications')
        .update({
          is_read: true,
          read_at: new Date()
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Mark notification as read error:', error);
      throw error;
    }
  }

  /**
   * Send actual SMS notification to parent (integrate with your SMS provider)
   * Currently a placeholder — integrate with Twilio, AWS SNS, or local SMS gateway
   */
  async sendNotificationToParent(phoneNumber, notification) {
    try {
      // Placeholder for SMS integration
      logger.info(`SMS to ${phoneNumber}: ${notification.message}`);
      // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
      // Example: await twilioClient.messages.create({ ... })
    } catch (error) {
      logger.error('Send notification to parent error:', error);
    }
  }

  // ====== REPORTS ======

  /**
   * Generate weekly performance report
   */
  async generateWeeklyReport(studentId, schoolId, weekStartDate) {
    try {
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      const { data: performances, error } = await this.db
        .from('student_performance')
        .select('*')
        .eq('student_id', studentId)
        .eq('school_id', schoolId)
        .gte('date', weekStartDate)
        .lte('date', weekEndDate);

      if (error || !performances || performances.length === 0) return null;

      // Calculate averages
      const metric_averages = {};
      const metrics = await this.getMetrics();

      metrics.forEach(metric => {
        const scores = performances
          .map(p => p.metric_scores[metric.id])
          .filter(s => s !== undefined);
        metric_averages[metric.id] = scores.length > 0
          ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
          : 0;
      });

      const overall_average = (
        performances.reduce((sum, p) => sum + p.average_score, 0) / performances.length
      ).toFixed(2);

      const report = {
        student_id: studentId,
        school_id: schoolId,
        report_type: 'weekly',
        date_from: weekStartDate,
        date_to: weekEndDate.toISOString().split('T')[0],
        metric_averages,
        overall_average
      };

      const { data, error: insertError } = await this.db
        .from('performance_reports')
        .insert(report)
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    } catch (error) {
      logger.error('Generate weekly report error:', error);
      throw error;
    }
  }

  /**
   * Get performance trends for a student
   */
  async getPerformanceTrends(studentId, schoolId, days = 30) {
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const { data, error } = await this.db
        .from('student_performance')
        .select('date, average_score, metric_scores')
        .eq('student_id', studentId)
        .eq('school_id', schoolId)
        .gte('date', fromDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      logger.error('Get performance trends error:', error);
      throw error;
    }
  }

  /**
   * Get class performance summary
   */
  async getClassPerformanceSummary(schoolId, classLevel, date) {
    try {
      const performances = await this.getClassPerformance(schoolId, classLevel, date);

      if (performances.length === 0) {
        return {
          class: classLevel,
          date,
          totalStudents: 0,
          averageScore: 0,
          topPerformers: [],
          needsImprovement: []
        };
      }

      const sortedByScore = [...performances].sort(
        (a, b) => b.average_score - a.average_score
      );

      const averageScore = (
        performances.reduce((sum, p) => sum + p.average_score, 0) / performances.length
      ).toFixed(2);

      return {
        class: classLevel,
        date,
        totalStudents: performances.length,
        averageScore,
        topPerformers: sortedByScore.slice(0, 5),
        needsImprovement: sortedByScore.slice(-5).reverse()
      };
    } catch (error) {
      logger.error('Get class performance summary error:', error);
      throw error;
    }
  }
}

module.exports = new BehavioralPerformanceService();
