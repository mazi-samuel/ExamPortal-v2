// =============================================
// Attendance Routes
// =============================================
const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole, schoolScope } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateBody } = require('../middleware/validate');
const { auditMiddleware } = require('../middleware/audit');
const attendanceService = require('../services/attendanceService');

router.use(authMiddleware, schoolScope);

// POST /api/v2/attendance/sessions
router.post('/sessions',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('attendance_session'),
  validateBody({
    class: { required: true, type: 'string' },
    session_date: { required: true, type: 'string' },
    session_type: { type: 'string', enum: ['morning', 'afternoon', 'full_day'], default: 'full_day' }
  }),
  asyncHandler(async (req, res) => {
    const data = {
      ...req.validated,
      school_id: req.schoolId,
      teacher_id: req.user.id
    };
    const session = await attendanceService.createSession(data);
    res.status(201).json(session);
  })
);

// GET /api/v2/attendance/sessions
router.get('/sessions', asyncHandler(async (req, res) => {
  const { class: cls, date_from, date_to } = req.query;
  const data = await attendanceService.getSessions(req.schoolId, cls, date_from, date_to);
  res.json(data);
}));

// POST /api/v2/attendance/sessions/:sessionId/mark
router.post('/sessions/:sessionId/mark',
  requireRole('teacher', 'admin', 'school_admin'),
  auditMiddleware('attendance_record'),
  asyncHandler(async (req, res) => {
    const { records } = req.body;
    if (!Array.isArray(records)) return res.status(400).json({ error: 'records must be an array' });
    const data = await attendanceService.markAttendance(
      req.params.sessionId, records, req.user.id
    );
    res.json(data);
  })
);

// GET /api/v2/attendance/stats/student/:studentId
router.get('/stats/student/:studentId', asyncHandler(async (req, res) => {
  const { date_from, date_to } = req.query;
  const stats = await attendanceService.getStudentStats(
    req.params.studentId, date_from, date_to
  );
  res.json(stats);
}));

// GET /api/v2/attendance/stats/class
router.get('/stats/class', asyncHandler(async (req, res) => {
  const { class: cls, date_from, date_to } = req.query;
  if (!cls) return res.status(400).json({ error: 'class query param required' });
  const stats = await attendanceService.getClassStats(
    req.schoolId, cls, date_from, date_to
  );
  res.json(stats);
}));

// GET /api/v2/attendance/export
router.get('/export',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const { class: cls, date_from, date_to } = req.query;
    if (!cls) return res.status(400).json({ error: 'class query param required' });
    const csv = await attendanceService.exportCSV(req.schoolId, cls, date_from, date_to);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendance_${cls}.csv"`);
    res.send(csv);
  })
);

// POST /api/v2/attendance/qr — generate QR for session
router.post('/qr',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const { session_id } = req.body;
    if (!session_id) return res.status(400).json({ error: 'session_id required' });
    const qr = await attendanceService.generateQR(session_id);
    res.json(qr);
  })
);

module.exports = router;
