// =============================================
// Validation Helpers
// =============================================

function isUUID(val) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

function requireFields(body, fields) {
  const missing = fields.filter(f => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length > 0) {
    return { valid: false, message: `Missing required fields: ${missing.join(', ')}` };
  }
  return { valid: true };
}

function sanitizeString(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

function isValidRole(role) {
  return ['super_admin', 'school_admin', 'teacher', 'student', 'parent'].includes(role);
}

function isValidTerm(term) {
  return ['first', 'second', 'third'].includes(term);
}

function isValidGrade(grade) {
  return /^grade[1-9]$/.test(grade);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = clamp(parseInt(query.limit, 10) || 25, 1, 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

module.exports = {
  isUUID,
  requireFields,
  sanitizeString,
  isValidRole,
  isValidTerm,
  isValidGrade,
  clamp,
  parsePagination
};
