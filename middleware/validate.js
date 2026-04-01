// =============================================
// Input Validation Middleware
// =============================================
const { sanitizeString } = require('../utils/validators');

// Generic body validator — takes a schema object
// schema: { fieldName: { required, type, maxLen, pattern, validate } }
function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    const cleaned = {};

    for (const [field, rules] of Object.entries(schema)) {
      let value = req.body[field];

      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value === undefined || value === null) {
        if (rules.default !== undefined) cleaned[field] = rules.default;
        continue;
      }

      // Type check
      if (rules.type === 'string') {
        value = sanitizeString(String(value), rules.maxLen || 500);
      } else if (rules.type === 'number') {
        value = Number(value);
        if (isNaN(value)) { errors.push(`${field} must be a number`); continue; }
        if (rules.min !== undefined && value < rules.min) { errors.push(`${field} must be >= ${rules.min}`); continue; }
        if (rules.max !== undefined && value > rules.max) { errors.push(`${field} must be <= ${rules.max}`); continue; }
      } else if (rules.type === 'boolean') {
        value = Boolean(value);
      } else if (rules.type === 'array') {
        if (!Array.isArray(value)) { errors.push(`${field} must be an array`); continue; }
      } else if (rules.type === 'uuid') {
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
          errors.push(`${field} must be a valid UUID`); continue;
        }
      }

      // Pattern check
      if (rules.pattern && !rules.pattern.test(String(value))) {
        errors.push(`${field} format is invalid`);
        continue;
      }

      // Enum check
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        continue;
      }

      // Custom validator
      if (rules.validate && !rules.validate(value)) {
        errors.push(`${field} is invalid`);
        continue;
      }

      cleaned[field] = value;
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    req.validated = cleaned;
    next();
  };
}

module.exports = { validateBody };
