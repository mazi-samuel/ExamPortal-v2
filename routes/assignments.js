// =============================================
// Assignment Routes
// =============================================
const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole, schoolScope } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateBody } = require('../middleware/validate');
const { auditMiddleware } = require('../middleware/audit');
const assignmentService = require('../services/assignmentService');

router.use(authMiddleware, schoolScope);

// GET /api/v2/assignments
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    class: req.query.class,
    subject_id: req.query.subject_id,
    status: req.query.status,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20
  };
  const data = await assignmentService.getAssignments(req.schoolId, filters);
  res.json(data);
}));

// GET /api/v2/assignments/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const data = await assignmentService.getAssignmentById(req.params.id);
  if (!data) return res.status(404).json({ error: 'Assignment not found' });
  res.json(data);
}));

// POST /api/v2/assignments
router.post('/',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('assignment'),
  validateBody({
    title: { required: true, type: 'string', maxLen: 300 },
    description: { type: 'string', maxLen: 5000 },
    subject_id: { required: true, type: 'uuid' },
    class: { required: true, type: 'string' },
    due_date: { required: true, type: 'string' },
    max_score: { type: 'number', min: 1, max: 1000, default: 100 },
    allow_late: { type: 'boolean', default: false },
    late_penalty_percent: { type: 'number', min: 0, max: 100, default: 10 }
  }),
  asyncHandler(async (req, res) => {
    const data = {
      ...req.validated,
      school_id: req.schoolId,
      teacher_id: req.user.id
    };
    const assignment = await assignmentService.createAssignment(data);
    res.status(201).json(assignment);
  })
);

// PUT /api/v2/assignments/:id
router.put('/:id',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('assignment'),
  asyncHandler(async (req, res) => {
    const assignment = await assignmentService.updateAssignment(req.params.id, req.body);
    res.json(assignment);
  })
);

// DELETE /api/v2/assignments/:id (soft delete)
router.delete('/:id',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('assignment'),
  asyncHandler(async (req, res) => {
    await assignmentService.deleteAssignment(req.params.id);
    res.json({ ok: true });
  })
);

// POST /api/v2/assignments/:id/rubrics
router.post('/:id/rubrics',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const { rubrics } = req.body;
    if (!Array.isArray(rubrics)) return res.status(400).json({ error: 'rubrics must be an array' });
    const data = await assignmentService.saveRubrics(req.params.id, rubrics);
    res.status(201).json(data);
  })
);

// POST /api/v2/assignments/:id/submit
router.post('/:id/submit',
  requireRole('student'),
  asyncHandler(async (req, res) => {
    const submission = await assignmentService.submitAssignment(
      req.params.id, req.user.id, req.body
    );
    res.status(201).json(submission);
  })
);

// GET /api/v2/assignments/:id/submissions
router.get('/:id/submissions',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const data = await assignmentService.getSubmissions(req.params.id);
    res.json(data);
  })
);

// POST /api/v2/assignments/submissions/:submissionId/grade
router.post('/submissions/:submissionId/grade',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('assignment_submission'),
  asyncHandler(async (req, res) => {
    const { score, feedback, rubric_scores } = req.body;
    const data = await assignmentService.gradeSubmission(
      req.params.submissionId, score, feedback, rubric_scores, req.user.id
    );
    res.json(data);
  })
);

module.exports = router;
