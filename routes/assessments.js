// =============================================
// Assessment Routes — CA Scores
// =============================================
const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole, schoolScope } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateBody } = require('../middleware/validate');
const { auditMiddleware } = require('../middleware/audit');
const assessmentService = require('../services/assessmentService');

// All assessment routes require auth + school context
router.use(authMiddleware, schoolScope);

// GET /api/v2/assessments
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    class: req.query.class,
    subject_id: req.query.subject_id,
    term_id: req.query.term_id,
    assessment_type: req.query.type
  };
  const data = await assessmentService.getAssessments(req.schoolId, filters);
  res.json(data);
}));

// GET /api/v2/assessments/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const data = await assessmentService.getAssessmentById(req.params.id);
  if (!data) return res.status(404).json({ error: 'Assessment not found' });
  res.json(data);
}));

// POST /api/v2/assessments
router.post('/',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('assessment'),
  validateBody({
    subject_id: { required: true, type: 'uuid' },
    class: { required: true, type: 'string' },
    assessment_type: { required: true, type: 'string', enum: ['test', 'assignment', 'project', 'classwork', 'homework'] },
    title: { required: true, type: 'string', maxLen: 200 },
    description: { type: 'string', maxLen: 1000 },
    max_score: { type: 'number', min: 1, max: 1000, default: 100 },
    term_id: { type: 'uuid' },
    due_date: { type: 'string' }
  }),
  asyncHandler(async (req, res) => {
    const data = {
      ...req.validated,
      school_id: req.schoolId,
      created_by: req.user.id
    };
    const assessment = await assessmentService.createAssessment(data);
    res.status(201).json(assessment);
  })
);

// PUT /api/v2/assessments/:id
router.put('/:id',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('assessment'),
  asyncHandler(async (req, res) => {
    const assessment = await assessmentService.updateAssessment(req.params.id, req.body);
    res.json(assessment);
  })
);

// DELETE /api/v2/assessments/:id
router.delete('/:id',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('assessment'),
  asyncHandler(async (req, res) => {
    await assessmentService.deleteAssessment(req.params.id);
    res.json({ ok: true });
  })
);

// POST /api/v2/assessments/:id/scores — batch save scores
router.post('/:id/scores',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('assessment_score'),
  asyncHandler(async (req, res) => {
    const { scores } = req.body;
    if (!Array.isArray(scores)) return res.status(400).json({ error: 'scores must be an array' });
    const data = await assessmentService.saveScores(req.params.id, scores, req.user.id);
    res.json(data);
  })
);

// GET /api/v2/assessments/:id/scores
router.get('/:id/scores', asyncHandler(async (req, res) => {
  const data = await assessmentService.getScoresForAssessment(req.params.id);
  res.json(data);
}));

// GET /api/v2/assessments/student/:studentId
router.get('/student/:studentId', asyncHandler(async (req, res) => {
  const data = await assessmentService.getStudentScores(req.params.studentId, req.query.term_id);
  res.json(data);
}));

module.exports = router;
