// =============================================
// Gamification Routes  (Points, Badges, Leaderboard)
// =============================================
const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole, schoolScope } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const gamificationService = require('../services/gamificationService');

router.use(authMiddleware, schoolScope);

// GET /api/v2/gamification/points — current student's points
router.get('/points', asyncHandler(async (req, res) => {
  const data = await gamificationService.getStudentPoints(req.user.id);
  res.json(data);
}));

// GET /api/v2/gamification/points/:studentId
router.get('/points/:studentId', asyncHandler(async (req, res) => {
  const data = await gamificationService.getStudentPoints(req.params.studentId);
  res.json(data);
}));

// POST /api/v2/gamification/award — teacher awards points
router.post('/award',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const { student_id, points, reason, category } = req.body;
    if (!student_id || !points) return res.status(400).json({ error: 'student_id, points required' });
    const result = await gamificationService.awardPoints(
      student_id, points, reason || 'Teacher award', category || 'bonus', req.schoolId
    );
    res.json(result);
  })
);

// GET /api/v2/gamification/badges — available badges
router.get('/badges', asyncHandler(async (req, res) => {
  const data = await gamificationService.getAvailableBadges(req.schoolId);
  res.json(data);
}));

// GET /api/v2/gamification/badges/:studentId — student's earned badges
router.get('/badges/:studentId', asyncHandler(async (req, res) => {
  const data = await gamificationService.getStudentBadges(req.params.studentId);
  res.json(data);
}));

// POST /api/v2/gamification/check-badges — evaluate badge criteria for a student
router.post('/check-badges',
  asyncHandler(async (req, res) => {
    const { student_id } = req.body;
    const target = student_id || req.user.id;
    const newBadges = await gamificationService.evaluateBadges(target, req.schoolId);
    res.json({ awarded: newBadges });
  })
);

// GET /api/v2/gamification/leaderboard
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const { class: cls, period, limit } = req.query;
  const data = await gamificationService.getLeaderboard(
    req.schoolId, cls, period || 'term', parseInt(limit) || 20
  );
  res.json(data);
}));

module.exports = router;
