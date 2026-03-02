// =============================================
// Notification Routes
// =============================================
const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole, schoolScope } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const notificationService = require('../services/notificationService');

router.use(authMiddleware, schoolScope);

// GET /api/v2/notifications — current user's notifications
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const data = await notificationService.getUserNotifications(req.user.id, page, limit);
  res.json(data);
}));

// POST /api/v2/notifications/read/:id
router.post('/read/:id', asyncHandler(async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.id);
  res.json({ ok: true });
}));

// POST /api/v2/notifications/read-all
router.post('/read-all', asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  res.json({ ok: true });
}));

// POST /api/v2/notifications/send
router.post('/send',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const n = await notificationService.send(req.body);
    res.status(201).json(n);
  })
);

// POST /api/v2/notifications/send-bulk
router.post('/send-bulk',
  requireRole('teacher', 'admin', 'school_admin'),
  asyncHandler(async (req, res) => {
    const { user_ids, title, body, type, data: payload } = req.body;
    if (!Array.isArray(user_ids)) return res.status(400).json({ error: 'user_ids must be an array' });
    const results = await notificationService.sendBulk(user_ids, title, body, type, req.schoolId, payload);
    res.json(results);
  })
);

// GET /api/v2/notifications/preferences
router.get('/preferences', asyncHandler(async (req, res) => {
  const prefs = await notificationService.getPreferences(req.user.id);
  res.json(prefs);
}));

// PUT /api/v2/notifications/preferences
router.put('/preferences', asyncHandler(async (req, res) => {
  const prefs = await notificationService.updatePreferences(req.user.id, req.body);
  res.json(prefs);
}));

// POST /api/v2/notifications/push-subscribe
router.post('/push-subscribe', asyncHandler(async (req, res) => {
  const { subscription } = req.body;
  if (!subscription) return res.status(400).json({ error: 'subscription object required' });
  await notificationService.savePushSubscription(req.user.id, subscription);
  res.json({ ok: true });
}));

module.exports = router;
