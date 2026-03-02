/* =============================================
   Online Exam Portal - Supabase Configuration
   ============================================= */

const SUPABASE_URL = 'https://znqavwjsrdblhfswktxw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucWF2d2pzcmRibGhmc3drdHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NjEyOTYsImV4cCI6MjA4NjUzNzI5Nn0.jWj6FotryDM0CJqK2WK6bGPBPbAndyJbiCH7NH5Pxx8';

// Initialize Supabase client  (the CDN exposes window.supabase)
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Ephraim School UUID (seeded in schema.sql)
const EPHRAIM_SCHOOL_ID = '00000000-0000-0000-0000-000000000001';

// Grade / class helpers
const CLASS_OPTIONS = [
  { value: 'grade1', label: 'Grade 1 (Basic 1)' },
  { value: 'grade2', label: 'Grade 2 (Basic 2)' },
  { value: 'grade3', label: 'Grade 3 (Basic 3)' },
  { value: 'grade4', label: 'Grade 4 (Basic 4)' },
  { value: 'grade5', label: 'Grade 5 (Basic 5)' },
  { value: 'grade6', label: 'Grade 6 (Basic 6)' }
];

function getClassLabel(key) {
  const found = CLASS_OPTIONS.find(c => c.value === key);
  return found ? found.label : key;
}

function getGradeLetter(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}

function getGradeClass(letter) {
  if (!letter) return 'grade-f';
  if (letter.startsWith('A')) return 'grade-a';
  if (letter === 'B') return 'grade-b';
  if (letter === 'C') return 'grade-c';
  if (letter === 'D') return 'grade-d';
  return 'grade-f';
}

/* ---------- Auth helpers ---------- */

async function getSession() {
  const { data: { session } } = await db.auth.getSession();
  return session;
}

async function getCurrentProfile() {
  const session = await getSession();
  if (!session) return null;
  const { data } = await db
    .from('profiles')
    .select('*, schools(name, logo_url)')
    .eq('id', session.user.id)
    .single();
  return data;
}

// Helper: get display label for class + optional section
function getClassWithSection(cls, section) {
  var label = getClassLabel(cls);
  if (section) label += ' ' + section;
  return label;
}

// Helper: extract base grade from a class value (e.g. 'grade1' → 'grade1')
function getBaseGrade(cls) {
  return cls ? cls.replace(/[A-Za-z]$/, '') : cls;
}

// Redirect if not authenticated (or wrong role)
async function requireAuth(allowedRoles) {
  const session = await getSession();
  if (!session) { window.location.href = '/login.html'; return null; }
  const profile = await getCurrentProfile();
  if (!profile) { window.location.href = '/login.html'; return null; }
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    if (profile.role === 'teacher') window.location.href = '/teacher-dashboard.html';
    else if (profile.role === 'parent') window.location.href = '/parent-dashboard.html';
    else window.location.href = '/student-dashboard.html';
    return null;
  }
  return profile;
}

async function logout() {
  await db.auth.signOut();
  window.location.href = '/login.html';
}

// Convert username → pseudo-email for Supabase Auth
function usernameToEmail(username) {
  return username.trim().toLowerCase().replace(/\s+/g, '.') + '@examportal.local';
}

/* ---------- Toast notifications ---------- */

function showToast(msg, type) {
  type = type || 'info';
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function() { el.classList.add('toast-show'); }, 10);
  setTimeout(function() {
    el.classList.remove('toast-show');
    setTimeout(function() { el.remove(); }, 300);
  }, 3500);
}

/* ---------- Render nav bar ---------- */

function renderNav(profile) {
  var nav = document.getElementById('portal-nav');
  if (!nav) return;

  var schoolName = (profile && profile.schools) ? profile.schools.name : '';
  var links = '';

  if (profile && profile.role === 'teacher') {
    links = '<a href="/teacher-dashboard.html"><i class="fas fa-th-large"></i> Dashboard</a>'
      + '<a href="/exam-builder.html"><i class="fas fa-plus-circle"></i> Create Exam</a>'
      + '<a href="/ca-entry.html"><i class="fas fa-clipboard-check"></i> CA Scores</a>'
      + '<a href="/assignments.html"><i class="fas fa-tasks"></i> Assignments</a>'
      + '<a href="/attendance.html"><i class="fas fa-calendar-check"></i> Attendance</a>'
      + '<a href="/question-bank.html"><i class="fas fa-database"></i> Q-Bank</a>'
      + '<a href="/analytics.html"><i class="fas fa-chart-line"></i> Analytics</a>'
      + '<a href="/messages.html"><i class="fas fa-envelope"></i> Messages</a>'
      + '<a href="/leaderboard.html"><i class="fas fa-trophy"></i> Rewards</a>'
      + '<a href="/class-materials.html"><i class="fas fa-folder-open"></i> Materials</a>'
      + '<a href="/discussion-forum.html"><i class="fas fa-comments"></i> Forum</a>'
      + '<a href="/teacher-profile.html"><i class="fas fa-user-cog"></i> Profile</a>';
  } else if (profile && profile.role === 'student') {
    links = '<a href="/student-dashboard.html"><i class="fas fa-th-large"></i> Dashboard</a>'
      + '<a href="/assignments.html"><i class="fas fa-tasks"></i> Assignments</a>'
      + '<a href="/term-report.html"><i class="fas fa-file-alt"></i> Report Card</a>'
      + '<a href="/analytics.html"><i class="fas fa-chart-line"></i> My Stats</a>'
      + '<a href="/leaderboard.html"><i class="fas fa-trophy"></i> Rewards</a>'
      + '<a href="/class-materials.html"><i class="fas fa-folder-open"></i> Materials</a>'
      + '<a href="/discussion-forum.html"><i class="fas fa-comments"></i> Forum</a>';
  } else if (profile && profile.role === 'parent') {
    links = '<a href="/parent-dashboard.html"><i class="fas fa-th-large"></i> Dashboard</a>'
      + '<a href="/term-report.html"><i class="fas fa-file-alt"></i> Report Card</a>'
      + '<a href="/analytics.html"><i class="fas fa-chart-line"></i> Analytics</a>'
      + '<a href="/messages.html"><i class="fas fa-envelope"></i> Messages</a>'
      + '<a href="/class-materials.html"><i class="fas fa-folder-open"></i> Materials</a>'
      + '<a href="/discussion-forum.html"><i class="fas fa-comments"></i> Forum</a>';
  }

  nav.innerHTML =
    '<div class="nav-inner">'
    + '<a href="/" class="nav-brand"><i class="fas fa-graduation-cap"></i> ExamPortal</a>'
    + '<div class="nav-links">' + links + '</div>'
    + '<div class="nav-user">'
    + (schoolName ? '<span class="nav-school">' + schoolName + '</span>' : '')
    + (profile ? '<span class="nav-name">' + profile.full_name + '</span>' : '')
    + (profile ? '<button onclick="logout()" class="btn btn-sm btn-logout"><i class="fas fa-sign-out-alt"></i> Logout</button>' : '')
    + '</div>'
    + '<button class="nav-toggle" onclick="document.getElementById(\'portal-nav\').classList.toggle(\'nav-open\')"><i class="fas fa-bars"></i></button>'
    + '</div>';
}

/* ---------- Misc helpers ---------- */

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').catch(function() {});
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '-';
  var parts = timeStr.split(':');
  var h = parseInt(parts[0]), m = parts[1];
  var ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + m + ' ' + ampm;
}

async function loadSchools() {
  var { data } = await db.from('schools').select('id, name').order('name');
  return data || [];
}
