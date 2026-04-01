// =============================================
// Centralized Logger
// =============================================
const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'info'] ?? LOG_LEVELS.info;

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  error(msg, meta) {
    if (currentLevel >= LOG_LEVELS.error) {
      console.error(`[${timestamp()}] ERROR: ${msg}`, meta !== undefined ? meta : '');
    }
  },
  warn(msg, meta) {
    if (currentLevel >= LOG_LEVELS.warn) {
      console.warn(`[${timestamp()}] WARN: ${msg}`, meta !== undefined ? meta : '');
    }
  },
  info(msg, meta) {
    if (currentLevel >= LOG_LEVELS.info) {
      console.log(`[${timestamp()}] INFO: ${msg}`, meta !== undefined ? meta : '');
    }
  },
  debug(msg, meta) {
    if (currentLevel >= LOG_LEVELS.debug) {
      console.log(`[${timestamp()}] DEBUG: ${msg}`, meta !== undefined ? meta : '');
    }
  }
};

module.exports = logger;
