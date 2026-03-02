// =============================================
// Auth Middleware — verifies Supabase JWT
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch profile for role info
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('id, full_name, role, school_id, teacher_status, assigned_class, class, class_section')
      .eq('id', user.id)
      .single();

    if (profileErr || !profile) {
      return res.status(401).json({ error: 'User profile not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      ...profile
    };

    next();
  } catch (err) {
    logger.error('Auth middleware error', err.message);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

// Role-checking middleware factory
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// School-scoping middleware — ensures queries only access user's school
function schoolScope(req, res, next) {
  if (!req.user || !req.user.school_id) {
    return res.status(403).json({ error: 'No school context' });
  }
  req.schoolId = req.user.school_id;
  next();
}

module.exports = { authMiddleware, requireRole, schoolScope };
