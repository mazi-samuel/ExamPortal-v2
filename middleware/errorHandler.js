// =============================================
// Error Handling Middleware
// =============================================
const logger = require('../utils/logger');

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.expose ? err.message : 'Internal server error';

  logger.error(`[${req.method} ${req.originalUrl}] ${err.message}`, {
    stack: err.stack,
    statusCode
  });

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

// 404 handler
function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Async route wrapper to catch promise rejections
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Custom API error
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.expose = true;
  }
}

module.exports = { errorHandler, notFoundHandler, asyncHandler, ApiError };
