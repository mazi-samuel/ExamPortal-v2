-- =============================================
-- Schema V3: Enterprise LMS Expansion
-- Run in Supabase SQL Editor AFTER schema.sql & schema-v2.sql
-- =============================================
-- Covers:
--   Phase 1: CA, Term Results, Assignments, Attendance, Notifications
--   Phase 2: Question Bank, Analytics, Parent Messaging
--   Phase 3: PWA push subscriptions
--   Phase 4: Multi-tenant, Gamification, Virtual Classroom
--   Phase 5: Audit Logs, Compliance
-- =============================================

-- =============================================
-- ROLE EXPANSION  (add super_admin, school_admin)
-- =============================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('super_admin','school_admin','teacher','student','parent','admin'));

-- =============================================
-- SCHOOL ENHANCEMENTS (multi-tenant branding)
-- =============================================
ALTER TABLE schools ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#667eea';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS motto TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free'
  CHECK (subscription_plan IN ('free','basic','premium','enterprise'));
ALTER TABLE schools ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';

-- =============================================
-- ACADEMIC YEAR / TERM / SESSION CONFIG
-- =============================================
CREATE TABLE IF NOT EXISTS academic_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,                          -- e.g. '2025/2026'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, name)
);

CREATE TABLE IF NOT EXISTS term_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES academic_sessions(id) ON DELETE CASCADE NOT NULL,
  term TEXT NOT NULL CHECK (term IN ('first','second','third')),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, term)
);

-- =============================================
-- GRADING SCALES (per-school configurable)
-- =============================================
CREATE TABLE IF NOT EXISTS grading_scales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default',
  scale JSONB NOT NULL DEFAULT '[
    {"min":90,"max":100,"letter":"A+","remark":"Outstanding","gpa":4.0},
    {"min":80,"max":89,"letter":"A","remark":"Excellent","gpa":3.7},
    {"min":70,"max":79,"letter":"B","remark":"Very Good","gpa":3.3},
    {"min":60,"max":69,"letter":"C","remark":"Good","gpa":2.7},
    {"min":50,"max":59,"letter":"D","remark":"Fair","gpa":2.0},
    {"min":0,"max":49,"letter":"F","remark":"Needs Improvement","gpa":0.0}
  ]',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CONTINUOUS ASSESSMENT CONFIG (weights per school)
-- =============================================
CREATE TABLE IF NOT EXISTS ca_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES academic_sessions(id) ON DELETE CASCADE,
  test_weight NUMERIC NOT NULL DEFAULT 20,     -- % weight for CA tests
  assignment_weight NUMERIC NOT NULL DEFAULT 10,
  project_weight NUMERIC NOT NULL DEFAULT 10,
  exam_weight NUMERIC NOT NULL DEFAULT 60,     -- % weight for terminal exam
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT ca_weights_sum CHECK (test_weight + assignment_weight + project_weight + exam_weight = 100)
);

-- =============================================
-- ASSESSMENTS (CA tests, classwork, etc.)
-- =============================================
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  class TEXT NOT NULL,
  term_id UUID REFERENCES term_config(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('test','assignment','project','classwork','homework')),
  title TEXT NOT NULL,
  description TEXT,
  max_score NUMERIC NOT NULL DEFAULT 100,
  weight NUMERIC DEFAULT 1,                    -- relative weight within type
  due_date TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_class ON assessments(school_id, class, term_id);
CREATE INDEX IF NOT EXISTS idx_assessments_subject ON assessments(subject_id);

-- =============================================
-- ASSESSMENT SCORES
-- =============================================
CREATE TABLE IF NOT EXISTS assessment_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score NUMERIC NOT NULL,
  remarks TEXT,
  graded_by UUID REFERENCES profiles(id),
  graded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_assessment_scores_student ON assessment_scores(student_id);

-- =============================================
-- TERM RESULTS (aggregated per student per subject per term)
-- =============================================
CREATE TABLE IF NOT EXISTS term_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  term_id UUID REFERENCES term_config(id) ON DELETE CASCADE NOT NULL,
  class TEXT NOT NULL,
  ca_test_score NUMERIC DEFAULT 0,
  ca_assignment_score NUMERIC DEFAULT 0,
  ca_project_score NUMERIC DEFAULT 0,
  ca_total NUMERIC DEFAULT 0,
  exam_score NUMERIC DEFAULT 0,
  total_score NUMERIC DEFAULT 0,
  percentage NUMERIC DEFAULT 0,
  grade_letter TEXT,
  grade_remark TEXT,
  gpa NUMERIC DEFAULT 0,
  subject_position INTEGER,
  teacher_remark TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject_id, term_id)
);

CREATE INDEX IF NOT EXISTS idx_term_results_student ON term_results(student_id, term_id);
CREATE INDEX IF NOT EXISTS idx_term_results_class ON term_results(school_id, class, term_id);

-- =============================================
-- REPORT CARDS (per student per term)
-- =============================================
CREATE TABLE IF NOT EXISTS report_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  term_id UUID REFERENCES term_config(id) ON DELETE CASCADE NOT NULL,
  class TEXT NOT NULL,
  total_subjects INTEGER DEFAULT 0,
  total_score NUMERIC DEFAULT 0,
  average_percentage NUMERIC DEFAULT 0,
  overall_gpa NUMERIC DEFAULT 0,
  grade_letter TEXT,
  class_position INTEGER,
  class_size INTEGER,
  teacher_comment TEXT,
  principal_comment TEXT,
  principal_approved BOOLEAN DEFAULT FALSE,
  principal_approved_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, term_id)
);

CREATE INDEX IF NOT EXISTS idx_report_cards_class ON report_cards(school_id, class, term_id);

-- =============================================
-- ASSIGNMENTS & HOMEWORK (Phase 1)
-- =============================================
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  class TEXT NOT NULL,
  term_id UUID REFERENCES term_config(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  max_score NUMERIC NOT NULL DEFAULT 100,
  due_date TIMESTAMPTZ NOT NULL,
  allow_late BOOLEAN DEFAULT FALSE,
  late_penalty_percent NUMERIC DEFAULT 10,
  attachment_urls JSONB DEFAULT '[]',
  created_by UUID REFERENCES profiles(id),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(school_id, class);

CREATE TABLE IF NOT EXISTS assignment_rubrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  criterion TEXT NOT NULL,
  max_points NUMERIC NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  is_late BOOLEAN DEFAULT FALSE,
  file_urls JSONB DEFAULT '[]',
  text_response TEXT,
  total_score NUMERIC,
  percentage NUMERIC,
  grade_letter TEXT,
  feedback TEXT,
  graded_by UUID REFERENCES profiles(id),
  graded_at TIMESTAMPTZ,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft','submitted','graded','returned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_assignment_subs_student ON assignment_submissions(student_id);

CREATE TABLE IF NOT EXISTS rubric_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_id UUID REFERENCES assignment_submissions(id) ON DELETE CASCADE NOT NULL,
  rubric_id UUID REFERENCES assignment_rubrics(id) ON DELETE CASCADE NOT NULL,
  score NUMERIC NOT NULL DEFAULT 0,
  comment TEXT,
  UNIQUE(submission_id, rubric_id)
);

-- =============================================
-- ATTENDANCE SYSTEM (Phase 1)
-- =============================================
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  class TEXT NOT NULL,
  class_section TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  marked_by UUID REFERENCES profiles(id),
  qr_code TEXT,                                -- optional QR code for self-check-in
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, class, class_section, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_sessions_date ON attendance_sessions(school_id, date);

CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present','absent','late','excused')),
  check_in_time TIMESTAMPTZ,
  notes TEXT,
  parent_notified BOOLEAN DEFAULT FALSE,
  UNIQUE(session_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON attendance_records(student_id);

-- =============================================
-- NOTIFICATION SYSTEM (Phase 1)
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN (
    'exam_reminder','assignment_deadline','absence_alert','result_published',
    'message','broadcast','system','attendance','grade_update'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,                                   -- deep link to relevant page
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  channel TEXT DEFAULT 'in_app' CHECK (channel IN ('in_app','email','sms','push')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_school ON notifications(school_id, created_at DESC);

-- Push subscription store (PWA)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subscription JSONB NOT NULL,                 -- PushSubscription object
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subscription)
);

-- User notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT TRUE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  disabled_types TEXT[] DEFAULT '{}',          -- array of notification types to suppress
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- QUESTION BANK (Phase 2)
-- =============================================
CREATE TABLE IF NOT EXISTS question_bank (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  class TEXT,
  topic TEXT,
  subtopic TEXT,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq','fill_blank','theory','true_false','matching')),
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  marks NUMERIC DEFAULT 1,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_by UUID REFERENCES profiles(id),
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qbank_subject ON question_bank(school_id, subject_id, class);
CREATE INDEX IF NOT EXISTS idx_qbank_topic ON question_bank(topic);
CREATE INDEX IF NOT EXISTS idx_qbank_tags ON question_bank USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_qbank_difficulty ON question_bank(difficulty);

-- Question version history
CREATE TABLE IF NOT EXISTS question_bank_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES question_bank(id) ON DELETE CASCADE NOT NULL,
  version INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topic tags (normalized)
CREATE TABLE IF NOT EXISTS topic_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  class TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, subject_id, name, class)
);

-- =============================================
-- PARENT MESSAGING (Phase 2)
-- =============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  participant_1 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);

CREATE TABLE IF NOT EXISTS message_reads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- =============================================
-- GAMIFICATION (Phase 4)
-- =============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,  -- NULL = system-wide
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT '🏆',
  criteria JSONB NOT NULL DEFAULT '{}',        -- e.g. {"type":"exam_score","threshold":90}
  category TEXT DEFAULT 'academic' CHECK (category IN ('academic','participation','attendance','social')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, badge_id)
);

CREATE TABLE IF NOT EXISTS student_points (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  reason TEXT NOT NULL,
  source_type TEXT CHECK (source_type IN ('exam','assignment','attendance','forum','badge','manual')),
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_points ON student_points(student_id, school_id);

CREATE TABLE IF NOT EXISTS leaderboards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  class TEXT,                                  -- NULL = school-wide
  period TEXT DEFAULT 'weekly' CHECK (period IN ('daily','weekly','monthly','term','all_time')),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  total_points INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, class, period, student_id)
);

-- =============================================
-- VIRTUAL CLASSROOM (Phase 4)
-- =============================================
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  class TEXT NOT NULL,
  teacher_id UUID REFERENCES profiles(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  meeting_link TEXT,                           -- Zoom/Google Meet link
  is_recurring BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS virtual_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  class TEXT NOT NULL,
  teacher_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  meeting_link TEXT,
  meeting_platform TEXT CHECK (meeting_platform IN ('zoom','google_meet','teams','custom')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  recording_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AUDIT LOGS (Phase 5)
-- =============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school ON audit_logs(school_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- =============================================
-- CONSENT TRACKING (Phase 5 - GDPR/FERPA)
-- =============================================
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('data_processing','email_notifications','sms_notifications','photo_consent','terms_of_service')),
  granted BOOLEAN DEFAULT FALSE,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, consent_type)
);

-- =============================================
-- SOFT DELETE SUPPORT: Add deleted_at to major tables
-- =============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- =============================================
-- ENABLE RLS ON ALL NEW TABLES
-- =============================================
ALTER TABLE academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE term_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE ca_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE term_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubric_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Helper: check if user is teacher/admin in the school
-- (used across many policies)

-- Academic Sessions
CREATE POLICY "sessions_select" ON academic_sessions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "sessions_manage" ON academic_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin','super_admin'))
);

-- Term Config
CREATE POLICY "term_config_select" ON term_config FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "term_config_manage" ON term_config FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin','super_admin'))
);

-- Grading Scales
CREATE POLICY "grading_scales_select" ON grading_scales FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "grading_scales_manage" ON grading_scales FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin','super_admin'))
);

-- CA Config
CREATE POLICY "ca_config_select" ON ca_config FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "ca_config_manage" ON ca_config FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin','super_admin'))
);

-- Assessments
CREATE POLICY "assessments_select" ON assessments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "assessments_manage" ON assessments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Assessment Scores
CREATE POLICY "assessment_scores_select" ON assessment_scores FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin')) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'parent' AND linked_student_id = student_id)
);
CREATE POLICY "assessment_scores_manage" ON assessment_scores FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Term Results
CREATE POLICY "term_results_select" ON term_results FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin')) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'parent' AND linked_student_id = student_id)
);
CREATE POLICY "term_results_manage" ON term_results FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Report Cards
CREATE POLICY "report_cards_select" ON report_cards FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin')) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'parent' AND linked_student_id = student_id)
);
CREATE POLICY "report_cards_manage" ON report_cards FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Assignments
CREATE POLICY "assignments_select" ON assignments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "assignments_manage" ON assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Assignment Rubrics
CREATE POLICY "rubrics_select" ON assignment_rubrics FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "rubrics_manage" ON assignment_rubrics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Assignment Submissions
CREATE POLICY "assignment_subs_select" ON assignment_submissions FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin')) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'parent' AND linked_student_id = student_id)
);
CREATE POLICY "assignment_subs_insert" ON assignment_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "assignment_subs_update" ON assignment_submissions FOR UPDATE USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Rubric Scores
CREATE POLICY "rubric_scores_select" ON rubric_scores FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "rubric_scores_manage" ON rubric_scores FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Attendance Sessions
CREATE POLICY "att_sessions_select" ON attendance_sessions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "att_sessions_manage" ON attendance_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Attendance Records
CREATE POLICY "att_records_select" ON attendance_records FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin','parent'))
);
CREATE POLICY "att_records_manage" ON attendance_records FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Notifications
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin','super_admin'))
  OR auth.uid() = recipient_id
);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = recipient_id);

-- Push Subscriptions
CREATE POLICY "push_subs_select" ON push_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "push_subs_insert" ON push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "push_subs_delete" ON push_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- Notification Preferences
CREATE POLICY "notif_prefs_select" ON notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_prefs_manage" ON notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Question Bank
CREATE POLICY "qbank_select" ON question_bank FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "qbank_manage" ON question_bank FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Question Bank History
CREATE POLICY "qbank_history_select" ON question_bank_history FOR SELECT USING (auth.uid() IS NOT NULL);

-- Topic Tags
CREATE POLICY "topic_tags_select" ON topic_tags FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "topic_tags_manage" ON topic_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Conversations
CREATE POLICY "conversations_select" ON conversations FOR SELECT USING (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);
CREATE POLICY "conversations_insert" ON conversations FOR INSERT WITH CHECK (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);

-- Messages
CREATE POLICY "messages_select" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND (participant_1 = auth.uid() OR participant_2 = auth.uid()))
);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Message Reads
CREATE POLICY "message_reads_select" ON message_reads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "message_reads_insert" ON message_reads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges
CREATE POLICY "badges_select" ON badges FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "badges_manage" ON badges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin','super_admin'))
);

-- Student Badges
CREATE POLICY "student_badges_select" ON student_badges FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "student_badges_manage" ON student_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Student Points
CREATE POLICY "student_points_select" ON student_points FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "student_points_insert" ON student_points FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
  OR auth.uid() = student_id
);

-- Leaderboards
CREATE POLICY "leaderboards_select" ON leaderboards FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "leaderboards_manage" ON leaderboards FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin','super_admin'))
);

-- Class Schedules
CREATE POLICY "schedules_select" ON class_schedules FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "schedules_manage" ON class_schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Virtual Sessions
CREATE POLICY "vsessions_select" ON virtual_sessions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "vsessions_manage" ON virtual_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','school_admin'))
);

-- Audit Logs (only admins can read)
CREATE POLICY "audit_select" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','school_admin','super_admin'))
);
CREATE POLICY "audit_insert" ON audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Consent Records
CREATE POLICY "consent_select" ON consent_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "consent_manage" ON consent_records FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('assignments', 'assignments', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('question-images', 'question-images', true) ON CONFLICT (id) DO NOTHING;

-- Assignment files: teachers upload, students download
CREATE POLICY "assignment_files_select" ON storage.objects FOR SELECT USING (bucket_id = 'assignments' AND auth.uid() IS NOT NULL);
CREATE POLICY "assignment_files_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'assignments' AND auth.uid() IS NOT NULL);

-- Submission files: students upload, teachers view
CREATE POLICY "submission_files_select" ON storage.objects FOR SELECT USING (bucket_id = 'submissions' AND auth.uid() IS NOT NULL);
CREATE POLICY "submission_files_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'submissions' AND auth.uid() IS NOT NULL);

-- Question images: public read, teacher upload
CREATE POLICY "qimg_select" ON storage.objects FOR SELECT USING (bucket_id = 'question-images');
CREATE POLICY "qimg_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'question-images' AND auth.uid() IS NOT NULL);

-- =============================================
-- USEFUL DATABASE FUNCTIONS (RPCs)
-- =============================================

-- Get attendance stats for a student in a date range
CREATE OR REPLACE FUNCTION get_attendance_stats(
  p_student_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  total_days BIGINT,
  present_days BIGINT,
  absent_days BIGINT,
  late_days BIGINT,
  excused_days BIGINT,
  attendance_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_days,
    COUNT(*) FILTER (WHERE ar.status = 'present')::BIGINT AS present_days,
    COUNT(*) FILTER (WHERE ar.status = 'absent')::BIGINT AS absent_days,
    COUNT(*) FILTER (WHERE ar.status = 'late')::BIGINT AS late_days,
    COUNT(*) FILTER (WHERE ar.status = 'excused')::BIGINT AS excused_days,
    CASE
      WHEN COUNT(*) > 0
      THEN ROUND(
        (COUNT(*) FILTER (WHERE ar.status IN ('present','late'))::NUMERIC / COUNT(*)::NUMERIC) * 100, 1
      )
      ELSE 0
    END AS attendance_rate
  FROM attendance_records ar
  JOIN attendance_sessions ats ON ats.id = ar.session_id
  WHERE ar.student_id = p_student_id
    AND (p_start_date IS NULL OR ats.date >= p_start_date)
    AND (p_end_date IS NULL OR ats.date <= p_end_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get class performance summary
CREATE OR REPLACE FUNCTION get_class_performance(
  p_school_id UUID,
  p_class TEXT,
  p_term_id UUID
)
RETURNS TABLE (
  subject_name TEXT,
  class_avg NUMERIC,
  highest_score NUMERIC,
  lowest_score NUMERIC,
  pass_rate NUMERIC,
  student_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.name AS subject_name,
    ROUND(AVG(tr.percentage), 1) AS class_avg,
    MAX(tr.percentage) AS highest_score,
    MIN(tr.percentage) AS lowest_score,
    ROUND(
      (COUNT(*) FILTER (WHERE tr.percentage >= 50)::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC) * 100, 1
    ) AS pass_rate,
    COUNT(DISTINCT tr.student_id) AS student_count
  FROM term_results tr
  JOIN subjects s ON s.id = tr.subject_id
  WHERE tr.school_id = p_school_id
    AND tr.class = p_class
    AND tr.term_id = p_term_id
  GROUP BY s.name
  ORDER BY s.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Compute leaderboard points for a student
CREATE OR REPLACE FUNCTION get_student_total_points(
  p_student_id UUID,
  p_school_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COALESCE(SUM(points), 0) INTO total
  FROM student_points
  WHERE student_id = p_student_id AND school_id = p_school_id;
  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
