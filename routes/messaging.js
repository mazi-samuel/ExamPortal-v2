// =============================================
// Messaging Routes  (Parent-Teacher messaging)
// =============================================
const express = require('express');
const router = express.Router();
const { authMiddleware, schoolScope } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const messagingService = require('../services/messagingService');

router.use(authMiddleware, schoolScope);

// GET /api/v2/messages/conversations
router.get('/conversations', asyncHandler(async (req, res) => {
  const data = await messagingService.getConversations(req.user.id);
  res.json(data);
}));

// POST /api/v2/messages/conversations
router.post('/conversations', asyncHandler(async (req, res) => {
  const { participant_ids, subject } = req.body;
  if (!Array.isArray(participant_ids) || participant_ids.length === 0) {
    return res.status(400).json({ error: 'participant_ids[] required' });
  }
  const allParticipants = [req.user.id, ...participant_ids.filter(id => id !== req.user.id)];
  const conversation = await messagingService.createConversation(
    allParticipants, subject, req.schoolId
  );
  res.status(201).json(conversation);
}));

// GET /api/v2/messages/conversations/:conversationId
router.get('/conversations/:conversationId', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const data = await messagingService.getMessages(req.params.conversationId, page, limit);
  res.json(data);
}));

// POST /api/v2/messages/conversations/:conversationId
router.post('/conversations/:conversationId', asyncHandler(async (req, res) => {
  const { body, attachments } = req.body;
  if (!body || !body.trim()) return res.status(400).json({ error: 'message body required' });
  const message = await messagingService.sendMessage(
    req.params.conversationId, req.user.id, body.trim(), attachments
  );
  res.status(201).json(message);
}));

// POST /api/v2/messages/:messageId/read
router.post('/:messageId/read', asyncHandler(async (req, res) => {
  await messagingService.markAsRead(req.params.messageId, req.user.id);
  res.json({ ok: true });
}));

// GET /api/v2/messages/unread-count
router.get('/unread-count', asyncHandler(async (req, res) => {
  const count = await messagingService.getUnreadCount(req.user.id);
  res.json({ count });
}));

module.exports = router;
