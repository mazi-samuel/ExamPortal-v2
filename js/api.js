/* =============================================
   API Abstraction Layer — /js/api.js
   Wraps all v2 backend calls with auth headers.
   Usage:  const data = await API.assessments.list({ class:'grade5' });
   ============================================= */

const API = (function () {
  const BASE = '/api/v2';

  // ---------- Helpers ----------
  async function getAuthHeaders() {
    const session = await getSession();          // from supabase-config.js
    const headers = { 'Content-Type': 'application/json' };
    if (session && session.access_token) {
      headers['Authorization'] = 'Bearer ' + session.access_token;
    }
    return headers;
  }

  async function request(method, path, body, raw) {
    const opts = { method, headers: await getAuthHeaders() };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);
    const res = await fetch(BASE + path, opts);
    if (raw) return res;                         // allow caller to handle CSV etc.
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || err.message || 'API error ' + res.status);
    }
    return res.json();
  }

  function qs(params) {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params || {})) {
      if (v !== undefined && v !== null && v !== '') p.set(k, v);
    }
    const s = p.toString();
    return s ? '?' + s : '';
  }

  // ---------- Assessments (CA) ----------
  const assessments = {
    list:   (filters) => request('GET', '/assessments' + qs(filters)),
    get:    (id) => request('GET', '/assessments/' + id),
    create: (data) => request('POST', '/assessments', data),
    update: (id, data) => request('PUT', '/assessments/' + id, data),
    remove: (id) => request('DELETE', '/assessments/' + id),
    saveScores: (id, scores) => request('POST', '/assessments/' + id + '/scores', { scores }),
    getScores:  (id) => request('GET', '/assessments/' + id + '/scores'),
    studentScores: (studentId, termId) =>
      request('GET', '/assessments/student/' + studentId + qs({ term_id: termId })),
  };

  // ---------- Term Results ----------
  const termResults = {
    calculate: (data) => request('POST', '/term-results/calculate', data),
    calculateBatch: (data) => request('POST', '/term-results/calculate-batch', data),
    report: (studentId, termId, sessionId) =>
      request('GET', '/term-results/report/' + studentId + qs({ term_id: termId, session_id: sessionId })),
    classPositions: (cls, termId, sessionId) =>
      request('GET', '/term-results/class-positions' + qs({ class: cls, term_id: termId, session_id: sessionId })),
  };

  // ---------- Assignments ----------
  const assignments = {
    list:   (filters) => request('GET', '/assignments' + qs(filters)),
    get:    (id) => request('GET', '/assignments/' + id),
    create: (data) => request('POST', '/assignments', data),
    update: (id, data) => request('PUT', '/assignments/' + id, data),
    remove: (id) => request('DELETE', '/assignments/' + id),
    saveRubrics: (id, rubrics) => request('POST', '/assignments/' + id + '/rubrics', { rubrics }),
    submit: (id, data) => request('POST', '/assignments/' + id + '/submit', data),
    getSubmissions: (id) => request('GET', '/assignments/' + id + '/submissions'),
    grade: (submissionId, data) =>
      request('POST', '/assignments/submissions/' + submissionId + '/grade', data),
  };

  // ---------- Attendance ----------
  const attendance = {
    createSession: (data) => request('POST', '/attendance/sessions', data),
    getSessions: (params) => request('GET', '/attendance/sessions' + qs(params)),
    mark: (sessionId, records) =>
      request('POST', '/attendance/sessions/' + sessionId + '/mark', { records }),
    studentStats: (studentId, dateFrom, dateTo) =>
      request('GET', '/attendance/stats/student/' + studentId + qs({ date_from: dateFrom, date_to: dateTo })),
    classStats: (cls, dateFrom, dateTo) =>
      request('GET', '/attendance/stats/class' + qs({ class: cls, date_from: dateFrom, date_to: dateTo })),
    exportCSV: (cls, dateFrom, dateTo) =>
      request('GET', '/attendance/export' + qs({ class: cls, date_from: dateFrom, date_to: dateTo }), null, true),
    generateQR: (sessionId) => request('POST', '/attendance/qr', { session_id: sessionId }),
  };

  // ---------- Notifications ----------
  const notifications = {
    list: (page, limit) => request('GET', '/notifications' + qs({ page, limit })),
    read: (id) => request('POST', '/notifications/read/' + id),
    readAll: () => request('POST', '/notifications/read-all'),
    send: (data) => request('POST', '/notifications/send', data),
    sendBulk: (data) => request('POST', '/notifications/send-bulk', data),
    getPreferences: () => request('GET', '/notifications/preferences'),
    updatePreferences: (prefs) => request('PUT', '/notifications/preferences', prefs),
    pushSubscribe: (subscription) => request('POST', '/notifications/push-subscribe', { subscription }),
  };

  // ---------- Question Bank ----------
  const questionBank = {
    search: (filters) => request('GET', '/question-bank' + qs(filters)),
    get:    (id) => request('GET', '/question-bank/' + id),
    create: (data) => request('POST', '/question-bank', data),
    update: (id, data) => request('PUT', '/question-bank/' + id, data),
    remove: (id) => request('DELETE', '/question-bank/' + id),
    history: (id) => request('GET', '/question-bank/' + id + '/history'),
    generatePaper: (data) => request('POST', '/question-bank/generate-paper', data),
    importCSV: (data) => request('POST', '/question-bank/import-csv', data),
    getTags: (subjectId) => request('GET', '/question-bank/meta/tags' + qs({ subject_id: subjectId })),
    createTag: (data) => request('POST', '/question-bank/meta/tags', data),
  };

  // ---------- Analytics ----------
  const analytics = {
    student: (studentId, termId, sessionId) =>
      request('GET', '/analytics/student/' + studentId + qs({ term_id: termId, session_id: sessionId })),
    classOverview: (cls, termId, sessionId) =>
      request('GET', '/analytics/class' + qs({ class: cls, term_id: termId, session_id: sessionId })),
    weakTopics: (cls, subjectId, termId) =>
      request('GET', '/analytics/weak-topics' + qs({ class: cls, subject_id: subjectId, term_id: termId })),
    teacherSummary: (termId) => request('GET', '/analytics/teacher-summary' + qs({ term_id: termId })),
    schoolDashboard: (sessionId) => request('GET', '/analytics/school-dashboard' + qs({ session_id: sessionId })),
  };

  // ---------- Messaging ----------
  const messages = {
    conversations: () => request('GET', '/messages/conversations'),
    createConversation: (participantIds, subject) =>
      request('POST', '/messages/conversations', { participant_ids: participantIds, subject }),
    getMessages: (convId, page, limit) =>
      request('GET', '/messages/conversations/' + convId + qs({ page, limit })),
    send: (convId, body, attachments) =>
      request('POST', '/messages/conversations/' + convId, { body, attachments }),
    markRead: (msgId) => request('POST', '/messages/' + msgId + '/read'),
    unreadCount: () => request('GET', '/messages/unread-count'),
  };

  // ---------- Gamification ----------
  const gamification = {
    myPoints: () => request('GET', '/gamification/points'),
    studentPoints: (studentId) => request('GET', '/gamification/points/' + studentId),
    award: (data) => request('POST', '/gamification/award', data),
    badges: () => request('GET', '/gamification/badges'),
    studentBadges: (studentId) => request('GET', '/gamification/badges/' + studentId),
    checkBadges: (studentId) => request('POST', '/gamification/check-badges', { student_id: studentId }),
    leaderboard: (cls, period, limit) =>
      request('GET', '/gamification/leaderboard' + qs({ class: cls, period, limit })),
  };

  return {
    assessments,
    termResults,
    assignments,
    attendance,
    notifications,
    questionBank,
    analytics,
    messages,
    gamification,
  };
})();
