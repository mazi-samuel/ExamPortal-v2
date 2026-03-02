// =============================================
// Term Results Routes
// =============================================
const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole, schoolScope } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { auditMiddleware } = require('../middleware/audit');
const termResultService = require('../services/termResultService');

router.use(authMiddleware, schoolScope);

// POST /api/v2/term-results/calculate
router.post('/calculate',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('term_result'),
  asyncHandler(async (req, res) => {
    const { student_id, subject_id, term_id, session_id } = req.body;
    if (!student_id || !subject_id || !term_id) {
      return res.status(400).json({ error: 'student_id, subject_id, term_id required' });
    }
    const result = await termResultService.calculateTermResult(
      student_id, subject_id, term_id, session_id, req.schoolId
    );
    res.json(result);
  })
);

// POST /api/v2/term-results/calculate-batch — for a whole class
router.post('/calculate-batch',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('term_result'),
  asyncHandler(async (req, res) => {
    const { student_ids, subject_id, term_id, session_id } = req.body;
    if (!Array.isArray(student_ids) || !subject_id || !term_id) {
      return res.status(400).json({ error: 'student_ids[], subject_id, term_id required' });
    }
    const results = [];
    for (const sid of student_ids) {
      const r = await termResultService.calculateTermResult(sid, subject_id, term_id, session_id, req.schoolId);
      results.push(r);
    }
    res.json(results);
  })
);

// GET /api/v2/term-results/report/:studentId
router.get('/report/:studentId', asyncHandler(async (req, res) => {
  const { term_id, session_id } = req.query;
  if (!term_id) return res.status(400).json({ error: 'term_id query param required' });
  const report = await termResultService.generateReportData(
    req.params.studentId, term_id, session_id, req.schoolId
  );
  res.json(report);
}));

// GET /api/v2/term-results/class-positions
router.get('/class-positions', asyncHandler(async (req, res) => {
  const { class: cls, term_id, session_id } = req.query;
  if (!cls || !term_id) return res.status(400).json({ error: 'class, term_id required' });
  const positions = await termResultService.computeClassPositions(cls, term_id, session_id, req.schoolId);
  res.json(positions);
}));

module.exports = router;
