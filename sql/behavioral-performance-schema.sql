-- =============================================
-- Behavioral Performance Tracking Schema
-- Add this to your Supabase database
-- =============================================

-- =============================================
-- 1. PERFORMANCE METRICS (Define metric categories)
-- =============================================
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('academic_engagement', 'social_skills', 'learning_behavior', 'classroom_conduct', 'personal_development')),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default metrics
INSERT INTO performance_metrics (name, category, description, display_order) VALUES
  ('Class Participation', 'academic_engagement', 'Active involvement in class activities', 1),
  ('Assignment Completion', 'academic_engagement', 'Timely submission of assignments', 2),
  ('Attention During Lessons', 'academic_engagement', 'Focus and concentration in class', 3),
  
  ('Teamwork', 'social_skills', 'Ability to work effectively in groups', 4),
  ('Respect for Others', 'social_skills', 'Courtesy and respect towards peers and teachers', 5),
  ('Communication', 'social_skills', 'Clear and effective communication skills', 6),
  
  ('Listening Skills', 'learning_behavior', 'Active listening during instructions', 7),
  ('Following Instructions', 'learning_behavior', 'Ability to follow and execute instructions', 8),
  ('Asking Questions', 'learning_behavior', 'Initiative in seeking clarification', 9),
  
  ('Discipline', 'classroom_conduct', 'Adherence to classroom rules', 10),
  ('Punctuality', 'classroom_conduct', 'Timely arrival and submission', 11),
  ('Rule Adherence', 'classroom_conduct', 'Following school and classroom rules', 12),
  
  ('Leadership', 'personal_development', 'Ability to lead and guide others', 13),
  ('Creativity', 'personal_development', 'Creative thinking and innovative ideas', 14),
  ('Initiative', 'personal_development', 'Taking proactive steps and responsibility', 15)
ON CONFLICT DO NOTHING;

-- =============================================
-- 2. STUDENT DAILY PERFORMANCE (Main table)
-- =============================================
CREATE TABLE IF NOT EXISTS student_performance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  class TEXT NOT NULL,
  class_section TEXT,
  date DATE NOT NULL,
  
  -- JSON score storage for flexibility (metric_id: score)
  metric_scores JSONB NOT NULL DEFAULT '{}',
  
  -- Overall calculations
  overall_score DECIMAL(5,2),
  average_score DECIMAL(5,2),
  
  -- Comments and notes
  teacher_comment TEXT,
  
  -- Tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(student_id, date, school_id)
);

-- =============================================
-- 3. PERFORMANCE INSIGHTS (Auto-generated)
-- =============================================
CREATE TABLE IF NOT EXISTS performance_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  
  strengths TEXT[],           -- Array of strong metric names
  improvements TEXT[],        -- Array of metrics needing improvement
  trend_analysis TEXT,        -- Text description of trends
  overall_insight TEXT,       -- Generated insight
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(student_id, date, school_id)
);

-- =============================================
-- 4. PARENT NOTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS parent_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  
  notification_type TEXT NOT NULL CHECK (notification_type IN ('daily_summary', 'performance_alert', 'achievement', 'improvement')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  summary JSONB,              -- Performance details
  
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. PERFORMANCE ALERTS (For teachers)
-- =============================================
CREATE TABLE IF NOT EXISTS performance_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  
  alert_type TEXT NOT NULL CHECK (alert_type IN ('critical', 'warning', 'improvement', 'achievement')),
  metric_name TEXT,
  message TEXT NOT NULL,
  
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. PERFORMANCE REPORTS (Weekly/Term summaries)
-- =============================================
CREATE TABLE IF NOT EXISTS performance_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  
  report_type TEXT NOT NULL CHECK (report_type IN ('daily', 'weekly', 'termly')),
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  
  metric_averages JSONB,      -- Average scores per metric
  overall_average DECIMAL(5,2),
  
  strengths TEXT[],
  areas_for_improvement TEXT[],
  teacher_comments TEXT,
  parent_acknowledged BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX idx_student_performance_student_date ON student_performance(student_id, date DESC);
CREATE INDEX idx_student_performance_school ON student_performance(school_id, date DESC);
CREATE INDEX idx_student_performance_class ON student_performance(class, date DESC);

CREATE INDEX idx_parent_notifications_parent ON parent_notifications(parent_id, is_read);
CREATE INDEX idx_parent_notifications_student ON parent_notifications(student_id, sent_at DESC);

CREATE INDEX idx_performance_alerts_student ON performance_alerts(student_id, created_at DESC);
CREATE INDEX idx_performance_alerts_teacher ON performance_alerts(teacher_id, is_acknowledged);

CREATE INDEX idx_performance_insights_student ON performance_insights(student_id, date DESC);

-- =============================================
-- Example Insert (Test data)
-- =============================================
-- INSERT INTO student_performance (student_id, teacher_id, school_id, class, date, metric_scores, overall_score, average_score)
-- VALUES (
--   'student-uuid-here',
--   'teacher-uuid-here',
--   'school-uuid-here',
--   'grade5',
--   NOW()::date,
--   '{"metric1": 4, "metric2": 5, "metric3": 3}',
--   4.0,
--   4.0
-- );
