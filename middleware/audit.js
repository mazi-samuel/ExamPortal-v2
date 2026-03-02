// =============================================
// Audit Logging Middleware
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

async function logAuditEvent(userId, action, entityType, entityId, details, schoolId) {
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || {},
      school_id: schoolId,
      ip_address: null // set by caller if needed
    });
  } catch (err) {
    logger.warn('Failed to write audit log', err.message);
  }
}

// Express middleware that auto-logs write operations
function auditMiddleware(entityType) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && res.statusCode < 400) {
        const action = req.method === 'POST' ? 'create'
          : req.method === 'DELETE' ? 'delete'
          : 'update';
        logAuditEvent(
          req.user?.id,
          action,
          entityType,
          body?.id || req.params?.id,
          { path: req.originalUrl, method: req.method },
          req.user?.school_id
        );
      }
      return originalJson(body);
    };
    next();
  };
}

module.exports = { logAuditEvent, auditMiddleware };
