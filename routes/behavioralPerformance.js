// =============================================
// Behavioral Performance Routes
// =============================================
const express = require('express');
const router = express.Router();
const behavioralService = require('../services/behavioralPerformanceService');
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

// ===== MIDDLEWARE (Optional - uncomment to enforce auth) =====
// router.use(authMiddleware);

// ===== PERFORMANCE LOGGING =====

/**
 * POST /api/v2/behavioral/record
 * Record daily performance for a student
 * Required: student_id, teacher_id, school_id, class, date, metric_scores
 */
router.post('/record', async (req, res) => {
  try {
    const { student_id, teacher_id, school_id, class: classLevel, date, metric_scores, teacher_comment } = req.body;

    if (!student_id || !teacher_id || !school_id || !classLevel || !date || !metric_scores) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const performance = await behavioralService.recordPerformance({
      student_id,
      teacher_id,
      school_id,
      class: classLevel,
      date,
      metric_scores,
      teacher_comment
    });

    res.status(201).json({
      success: true,
      message: 'Performance recorded successfully',
      data: performance
    });
  } catch (error) {
    logger.error('Record performance error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v2/behavioral/student/:studentId
 * Get performance records for a student
 */
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { dateFrom, dateTo, schoolId } = req.query;

    const performances = await behavioralService.getStudentPerformance(studentId, {
      dateFrom,
      dateTo,
      schoolId
    });

    res.json({
      success: true,
      data: performances
    });
  } catch (error) {
    logger.error('Get student performance error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v2/behavioral/class/:schoolId/:classLevel/:date
 * Get class performance for a specific date
 */
router.get('/class/:schoolId/:classLevel/:date', async (req, res) => {
  try {
    const { schoolId, classLevel, date } = req.params;

    const performances = await behavioralService.getClassPerformance(schoolId, classLevel, date);

    res.json({
      success: true,
      data: performances
    });
  } catch (error) {
    logger.error('Get class performance error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/v2/behavioral/:performanceId
 * Update a performance record
 */
router.put('/:performanceId', async (req, res) => {
  try {
    const { performanceId } = req.params;
    const updates = req.body;

    const performance = await behavioralService.updatePerformance(performanceId, updates);

    res.json({
      success: true,
      message: 'Performance updated successfully',
      data: performance
    });
  } catch (error) {
    logger.error('Update performance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== METRICS =====

/**
 * GET /api/v2/behavioral/metrics
 * Get all performance metrics
 */
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await behavioralService.getMetrics();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    logger.error('Get metrics error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v2/behavioral/metrics/grouped
 * Get metrics grouped by category
 */
router.get('/metrics/grouped', async (req, res) => {
  try {
    const grouped = await behavioralService.getMetricsByCategory();
    res.json({
      success: true,
      data: grouped
    });
  } catch (error) {
    logger.error('Get metrics grouped error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== INSIGHTS =====

/**
 * GET /api/v2/behavioral/insights/:studentId/:date
 * Get performance insights for a student on a specific date
 */
router.get('/insights/:studentId/:date', async (req, res) => {
  try {
    const { studentId, date } = req.params;
    const { db } = req;

    // This would typically fetch from performance_insights table
    // Implementation depends on your database setup
    res.json({
      success: true,
      message: 'Insights endpoint ready for implementation'
    });
  } catch (error) {
    logger.error('Get insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== NOTIFICATIONS =====

/**
 * GET /api/v2/behavioral/notifications/parent/:parentId
 * Get notifications for a parent
 */
router.get('/notifications/parent/:parentId', async (req, res) => {
  try {
    const { parentId } = req.params;
    const { unreadOnly } = req.query;

    const notifications = await behavioralService.getParentNotifications(
      parentId,
      unreadOnly === 'true'
    );

    res.json({
      success: true,
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    logger.error('Get parent notifications error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/v2/behavioral/notifications/:notificationId/read
 * Mark a notification as read
 */
router.put('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await behavioralService.markNotificationAsRead(notificationId);

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/v2/behavioral/notifications/daily-summary/:studentId/:date
 * Manually trigger daily summary notification for parent
 */
router.post('/notifications/daily-summary/:studentId/:date', async (req, res) => {
  try {
    const { studentId, date } = req.params;

    const notification = await behavioralService.sendDailySummaryToParents(studentId, date);

    res.json({
      success: true,
      message: 'Daily summary sent to parent',
      data: notification
    });
  } catch (error) {
    logger.error('Send daily summary error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== REPORTS & ANALYTICS =====

/**
 * GET /api/v2/behavioral/trends/:studentId/:schoolId
 * Get performance trends for a student
 */
router.get('/trends/:studentId/:schoolId', async (req, res) => {
  try {
    const { studentId, schoolId } = req.params;
    const { days } = req.query;

    const trends = await behavioralService.getPerformanceTrends(
      studentId,
      schoolId,
      parseInt(days) || 30
    );

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    logger.error('Get trends error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v2/behavioral/class-summary/:schoolId/:classLevel/:date
 * Get class performance summary
 */
router.get('/class-summary/:schoolId/:classLevel/:date', async (req, res) => {
  try {
    const { schoolId, classLevel, date } = req.params;

    const summary = await behavioralService.getClassPerformanceSummary(
      schoolId,
      classLevel,
      date
    );

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    logger.error('Get class summary error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/v2/behavioral/report/weekly/:studentId/:schoolId/:weekStartDate
 * Generate weekly report
 */
router.post('/report/weekly/:studentId/:schoolId/:weekStartDate', async (req, res) => {
  try {
    const { studentId, schoolId, weekStartDate } = req.params;

    const report = await behavioralService.generateWeeklyReport(
      studentId,
      schoolId,
      weekStartDate
    );

    res.json({
      success: true,
      message: 'Weekly report generated',
      data: report
    });
  } catch (error) {
    logger.error('Generate weekly report error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== ALERTS =====

/**
 * GET /api/v2/behavioral/alerts/:teacherId
 * Get performance alerts for a teacher
 */
router.get('/alerts/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { acknowledged } = req.query;

    // Fetch from performance_alerts table
    // This is a placeholder - implement in your service
    res.json({
      success: true,
      message: 'Alerts endpoint ready for implementation'
    });
  } catch (error) {
    logger.error('Get alerts error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
