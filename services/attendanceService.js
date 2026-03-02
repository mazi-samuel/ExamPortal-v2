// =============================================
// Attendance Service
// =============================================
const { getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class AttendanceService {
  constructor() {
    this.db = getSupabaseAdmin();
  }

  // Create or get today's attendance session
  async getOrCreateSession(schoolId, className, classSection, markedBy) {
    const today = new Date().toISOString().split('T')[0];

    // Check if session exists
    let query = this.db
      .from('attendance_sessions')
      .select('*')
      .eq('school_id', schoolId)
      .eq('class', className)
      .eq('date', today);

    if (classSection) query = query.eq('class_section', classSection);
    else query = query.is('class_section', null);

    const { data: existing } = await query.single();
    if (existing) return existing;

    // Create new session
    const { data: session, error } = await this.db
      .from('attendance_sessions')
      .insert({
        school_id: schoolId,
        class: className,
        class_section: classSection || null,
        date: today,
        marked_by: markedBy
      })
      .select()
      .single();
    if (error) throw error;
    return session;
  }

  // Mark attendance for multiple students (batch)
  async markAttendance(sessionId, records) {
    // records = [{ student_id, status, notes }]
    const data = records.map(r => ({
      session_id: sessionId,
      student_id: r.student_id,
      status: r.status || 'present',
      check_in_time: r.status === 'present' || r.status === 'late' ? new Date().toISOString() : null,
      notes: r.notes || null
    }));

    const { data: result, error } = await this.db
      .from('attendance_records')
      .upsert(data, { onConflict: 'session_id,student_id' })
      .select();
    if (error) throw error;
    return result;
  }

  // Get attendance for a specific session
  async getSessionAttendance(sessionId) {
    const { data, error } = await this.db
      .from('attendance_records')
      .select('*, profiles:student_id(full_name, class, class_section)')
      .eq('session_id', sessionId)
      .order('profiles(full_name)');
    if (error) throw error;
    return data || [];
  }

  // Get attendance stats using the DB function
  async getAttendanceStats(studentId, startDate, endDate) {
    const { data, error } = await this.db.rpc('get_attendance_stats', {
      p_student_id: studentId,
      p_start_date: startDate || null,
      p_end_date: endDate || null
    });
    if (error) throw error;
    return data?.[0] || { total_days: 0, present_days: 0, absent_days: 0, late_days: 0, excused_days: 0, attendance_rate: 0 };
  }

  // Get class attendance for a date range
  async getClassAttendance(schoolId, className, startDate, endDate) {
    let query = this.db
      .from('attendance_sessions')
      .select('*, attendance_records(*, profiles:student_id(full_name))')
      .eq('school_id', schoolId)
      .eq('class', className);

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query.order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // Get absent students for notification
  async getAbsentStudents(sessionId) {
    const { data, error } = await this.db
      .from('attendance_records')
      .select('student_id, profiles:student_id(full_name, parent_phone, parent_name, school_id)')
      .eq('session_id', sessionId)
      .eq('status', 'absent');
    if (error) throw error;
    return data || [];
  }

  // Export attendance to CSV format
  async exportAttendanceCSV(schoolId, className, startDate, endDate) {
    const sessions = await this.getClassAttendance(schoolId, className, startDate, endDate);

    const rows = [['Date', 'Student Name', 'Status', 'Check-in Time', 'Notes']];

    sessions.forEach(session => {
      (session.attendance_records || []).forEach(record => {
        rows.push([
          session.date,
          record.profiles?.full_name || 'Unknown',
          record.status,
          record.check_in_time || '',
          record.notes || ''
        ]);
      });
    });

    return rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  }

  // Generate QR code data for self check-in
  generateQRData(sessionId) {
    const payload = { session_id: sessionId, ts: Date.now() };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}

module.exports = new AttendanceService();
