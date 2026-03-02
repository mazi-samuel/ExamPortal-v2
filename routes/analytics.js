// =============================================
// Analytics Routes
// =============================================
const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole, schoolScope } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const analyticsService = require('../services/analyticsService');

router.use(authMiddleware, schoolScope);

// GET /api/v2/analytics/student/:studentId
router.get('/student/:studentId', asyncHandler(async (req, res) => {
  const { term_id, session_id } = req.query;
  const data = await analyticsService.getStudentOverview(
    req.params.studentId, term_id, session_id
  );
  res.json(data);
}));

// GET /api/v2/analytics/class
router.get('/class',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const { class: cls, term_id, session_id } = req.query;
    if (!cls) return res.status(400).json({ error: 'class query param required' });
    const data = await analyticsService.getClassOverview(
      req.schoolId, cls, term_id, session_id
    );
    res.json(data);
  })
);

// GET /api/v2/analytics/weak-topics
router.get('/weak-topics',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const { class: cls, subject_id, term_id } = req.query;
    if (!cls || !subject_id) return res.status(400).json({ error: 'class, subject_id required' });
    const topics = await analyticsService.getWeakTopics(
      req.schoolId, cls, subject_id, term_id
    );
    res.json(topics);
  })
);

// GET /api/v2/analytics/teacher-summary
router.get('/teacher-summary',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const { term_id } = req.query;
    const data = await analyticsService.getTeacherSummary(req.user.id, term_id);
    res.json(data);
  })
);

// GET /api/v2/analytics/school-dashboard
router.get('/school-dashboard',
  requireRole('admin', 'school_admin', 'super_admin'),
  asyncHandler(async (req, res) => {
    const { session_id } = req.query;
    const data = await analyticsService.getSchoolDashboard(req.schoolId, session_id);
    res.json(data);
  })
);

module.exports = router;
