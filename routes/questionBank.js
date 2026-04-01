// =============================================
// Question Bank Routes
// =============================================
const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole, schoolScope } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateBody } = require('../middleware/validate');
const { auditMiddleware } = require('../middleware/audit');
const questionBankService = require('../services/questionBankService');

router.use(authMiddleware, schoolScope);

// GET /api/v2/question-bank
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    subject_id: req.query.subject_id,
    class: req.query.class,
    difficulty: req.query.difficulty,
    topic: req.query.topic,
    question_type: req.query.type,
    search: req.query.q,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20
  };
  const data = await questionBankService.searchQuestions(req.schoolId, filters);
  res.json(data);
}));

// GET /api/v2/question-bank/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const q = await questionBankService.getQuestionById(req.params.id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json(q);
}));

// POST /api/v2/question-bank
router.post('/',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('question_bank'),
  validateBody({
    question_text: { required: true, type: 'string', maxLen: 5000 },
    question_type: { required: true, type: 'string', enum: ['mcq', 'true_false', 'short_answer', 'essay', 'fill_blank'] },
    subject_id: { required: true, type: 'uuid' },
    class: { required: true, type: 'string' },
    difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'], default: 'medium' },
    options: { type: 'object' },
    correct_answer: { type: 'string' },
    explanation: { type: 'string', maxLen: 2000 },
    marks: { type: 'number', min: 1, max: 100, default: 1 },
    tags: { type: 'object' }
  }),
  asyncHandler(async (req, res) => {
    const data = {
      ...req.validated,
      school_id: req.schoolId,
      created_by: req.user.id
    };
    const question = await questionBankService.createQuestion(data);
    res.status(201).json(question);
  })
);

// PUT /api/v2/question-bank/:id
router.put('/:id',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('question_bank'),
  asyncHandler(async (req, res) => {
    const question = await questionBankService.updateQuestion(req.params.id, req.body, req.user.id);
    res.json(question);
  })
);

// DELETE /api/v2/question-bank/:id
router.delete('/:id',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('question_bank'),
  asyncHandler(async (req, res) => {
    await questionBankService.deleteQuestion(req.params.id);
    res.json({ ok: true });
  })
);

// GET /api/v2/question-bank/:id/history
router.get('/:id/history',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const history = await questionBankService.getQuestionHistory(req.params.id);
    res.json(history);
  })
);

// POST /api/v2/question-bank/generate-paper
router.post('/generate-paper',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const { subject_id, class: cls, count, difficulty_mix } = req.body;
    if (!subject_id || !cls) return res.status(400).json({ error: 'subject_id, class required' });
    const paper = await questionBankService.generateRandomPaper(
      req.schoolId, subject_id, cls, count || 20, difficulty_mix
    );
    res.json(paper);
  })
);

// POST /api/v2/question-bank/import-csv
router.post('/import-csv',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('question_bank'),
  asyncHandler(async (req, res) => {
    const { csv_text, subject_id, class: cls } = req.body;
    if (!csv_text || !subject_id || !cls) {
      return res.status(400).json({ error: 'csv_text, subject_id, class required' });
    }
    const result = await questionBankService.bulkImportCSV(csv_text, subject_id, cls, req.schoolId, req.user.id);
    res.json(result);
  })
);

// GET /api/v2/question-bank/tags
router.get('/meta/tags', asyncHandler(async (req, res) => {
  const tags = await questionBankService.getTopicTags(req.query.subject_id);
  res.json(tags);
}));

// POST /api/v2/question-bank/tags
router.post('/meta/tags',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const { name, subject_id, class: cls } = req.body;
    if (!name || !subject_id) return res.status(400).json({ error: 'name, subject_id required' });
    const tag = await questionBankService.createTopicTag(name, subject_id, cls);
    res.status(201).json(tag);
  })
);

module.exports = router;
