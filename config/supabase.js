// =============================================
// Supabase Server-Side Client (Service Role)
// =============================================
const { createClient } = require('@supabase/supabase-js');
const config = require('./index');

let supabaseAdmin = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    if (!config.supabase.serviceKey) {
      console.warn('[Config] SUPABASE_SERVICE_KEY not set — admin client will use anon key (limited permissions)');
    }
    supabaseAdmin = createClient(
      config.supabase.url,
      config.supabase.serviceKey || config.supabase.anonKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return supabaseAdmin;
}

module.exports = { getSupabaseAdmin };
