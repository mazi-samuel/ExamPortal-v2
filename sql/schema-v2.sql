-- =============================================
-- Schema V2: Parents, Broadcasts, Materials,
-- Weekly Modules, Discussion Forum
-- Run in Supabase SQL Editor after schema.sql
-- =============================================

-- =============================================
-- UPDATE PROFILES: Allow 'parent' role
-- =============================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('teacher', 'student', 'admin', 'parent'));

-- Add parent linking field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linked_student_id UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linked_student_username TEXT;

-- Ensure legacy profile columns expected by the trigger exist (idempotent)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS teacher_status TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subject_taught TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS assigned_class TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS assigned_class_section TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS class TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS class_section TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Recreate simple CHECK constraints used elsewhere (safe to run repeatedly)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_teacher_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_teacher_status_check CHECK (teacher_status IN ('subject_teacher','class_teacher','head_teacher'));
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_gender_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_gender_check CHECK (gender IN ('male','female','other'));


-- =============================================
-- 10. BROADCASTS / NOTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_role TEXT, -- 'teacher', 'class_teacher', 'head_teacher'
  target_class TEXT, -- NULL = all classes
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  broadcast_type TEXT NOT NULL DEFAULT 'general'
    CHECK (broadcast_type IN ('general', 'assignment', 'exam_result', 'announcement', 'urgent')),
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. WEEKLY MODULES
-- =============================================
CREATE TABLE IF NOT EXISTS weekly_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  class TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject_id, class, week_number)
);

-- =============================================
-- 12. CLASS MATERIALS
-- =============================================
CREATE TABLE IF NOT EXISTS class_materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES weekly_modules(id) ON DELETE CASCADE NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  material_type TEXT NOT NULL
    CHECK (material_type IN ('notes', 'slides', 'pdf', 'document', 'audio', 'video', 'other')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 13. DISCUSSION FORUM
-- =============================================
CREATE TABLE IF NOT EXISTS discussion_topics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  class TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  module_id UUID REFERENCES weekly_modules(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discussion_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  topic_id UUID REFERENCES discussion_topics(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_answer BOOLEAN DEFAULT FALSE, -- marked as accepted answer
  parent_post_id UUID REFERENCES discussion_posts(id) ON DELETE CASCADE, -- for replies
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 14. STUDENT FORUM POINTS
-- =============================================
CREATE TABLE IF NOT EXISTS forum_points (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  reason TEXT, -- 'post', 'reply', 'accepted_answer', 'daily_active'
  topic_id UUID REFERENCES discussion_topics(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 15. PARENT NOTIFICATION READ STATUS
-- =============================================
CREATE TABLE IF NOT EXISTS notification_reads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broadcast_id UUID REFERENCES broadcasts(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broadcast_id, parent_id)
);

-- =============================================
-- 16. MATERIAL VIEWS (seen / read tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS material_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  material_id UUID REFERENCES class_materials(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(material_id, viewer_id)
);

-- =============================================
-- ENABLE RLS ON NEW TABLES
-- =============================================
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_views ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES FOR NEW TABLES
-- =============================================

-- Broadcasts: teachers insert, everyone reads
DROP POLICY IF EXISTS "broadcasts_select" ON broadcasts;
CREATE POLICY "broadcasts_select" ON broadcasts FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "broadcasts_insert" ON broadcasts;
CREATE POLICY "broadcasts_insert" ON broadcasts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
DROP POLICY IF EXISTS "broadcasts_update" ON broadcasts;
CREATE POLICY "broadcasts_update" ON broadcasts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
DROP POLICY IF EXISTS "broadcasts_delete" ON broadcasts;
CREATE POLICY "broadcasts_delete" ON broadcasts FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Weekly modules
DROP POLICY IF EXISTS "modules_select" ON weekly_modules;
CREATE POLICY "modules_select" ON weekly_modules FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "modules_insert" ON weekly_modules;
CREATE POLICY "modules_insert" ON weekly_modules FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
DROP POLICY IF EXISTS "modules_update" ON weekly_modules;
CREATE POLICY "modules_update" ON weekly_modules FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
DROP POLICY IF EXISTS "modules_delete" ON weekly_modules;
CREATE POLICY "modules_delete" ON weekly_modules FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Class materials
DROP POLICY IF EXISTS "materials_select" ON class_materials;
CREATE POLICY "materials_select" ON class_materials FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "materials_insert" ON class_materials;
CREATE POLICY "materials_insert" ON class_materials FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
DROP POLICY IF EXISTS "materials_update" ON class_materials;
CREATE POLICY "materials_update" ON class_materials FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
DROP POLICY IF EXISTS "materials_delete" ON class_materials;
CREATE POLICY "materials_delete" ON class_materials FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Discussion topics
DROP POLICY IF EXISTS "topics_select" ON discussion_topics;
CREATE POLICY "topics_select" ON discussion_topics FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "topics_insert" ON discussion_topics;
CREATE POLICY "topics_insert" ON discussion_topics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "topics_update" ON discussion_topics;
CREATE POLICY "topics_update" ON discussion_topics FOR UPDATE USING (
  auth.uid() = created_by OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
DROP POLICY IF EXISTS "topics_delete" ON discussion_topics;
CREATE POLICY "topics_delete" ON discussion_topics FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Discussion posts
DROP POLICY IF EXISTS "posts_select" ON discussion_posts;
CREATE POLICY "posts_select" ON discussion_posts FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "posts_insert" ON discussion_posts;
CREATE POLICY "posts_insert" ON discussion_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "posts_update" ON discussion_posts;
CREATE POLICY "posts_update" ON discussion_posts FOR UPDATE USING (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
DROP POLICY IF EXISTS "posts_delete" ON discussion_posts;
CREATE POLICY "posts_delete" ON discussion_posts FOR DELETE USING (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Forum points
DROP POLICY IF EXISTS "points_select" ON forum_points;
CREATE POLICY "points_select" ON forum_points FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "points_insert" ON forum_points;
CREATE POLICY "points_insert" ON forum_points FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Notification reads
DROP POLICY IF EXISTS "notif_reads_select" ON notification_reads;
CREATE POLICY "notif_reads_select" ON notification_reads FOR SELECT USING (auth.uid() = parent_id);
DROP POLICY IF EXISTS "notif_reads_insert" ON notification_reads;
CREATE POLICY "notif_reads_insert" ON notification_reads FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- Material views: anyone can see views, authenticated users can insert their own
DROP POLICY IF EXISTS "material_views_select" ON material_views;
CREATE POLICY "material_views_select" ON material_views FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "material_views_insert" ON material_views;
CREATE POLICY "material_views_insert" ON material_views FOR INSERT WITH CHECK (auth.uid() = viewer_id);
DROP POLICY IF EXISTS "material_views_update" ON material_views;
CREATE POLICY "material_views_update" ON material_views FOR UPDATE USING (auth.uid() = viewer_id);

-- =============================================
-- STORAGE BUCKET: class-materials
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('class-materials', 'class-materials', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Class materials are publicly accessible" ON storage.objects;
CREATE POLICY "Class materials are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'class-materials');
DROP POLICY IF EXISTS "Teachers can upload class materials" ON storage.objects;
CREATE POLICY "Teachers can upload class materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'class-materials' AND auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Teachers can delete class materials" ON storage.objects;
CREATE POLICY "Teachers can delete class materials" ON storage.objects FOR DELETE USING (bucket_id = 'class-materials' AND auth.uid() IS NOT NULL);

-- =============================================
-- UPDATE handle_new_user() for parent role
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, email, role, teacher_status, subject_taught, assigned_class, assigned_class_section, school_id, class, class_section, date_of_birth, gender, parent_name, parent_phone, linked_student_id, linked_student_username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', NULL),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'teacher_status',
    NEW.raw_user_meta_data->>'subject_taught',
    NEW.raw_user_meta_data->>'assigned_class',
    NEW.raw_user_meta_data->>'assigned_class_section',
    CASE WHEN NEW.raw_user_meta_data->>'school_id' IS NOT NULL
         THEN (NEW.raw_user_meta_data->>'school_id')::UUID
         ELSE NULL END,
    NEW.raw_user_meta_data->>'class',
    NEW.raw_user_meta_data->>'class_section',
    CASE WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL
         THEN (NEW.raw_user_meta_data->>'date_of_birth')::DATE
         ELSE NULL END,
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'parent_name',
    NEW.raw_user_meta_data->>'parent_phone',
    CASE WHEN NEW.raw_user_meta_data->>'linked_student_id' IS NOT NULL
         THEN (NEW.raw_user_meta_data->>'linked_student_id')::UUID
         ELSE NULL END,
    NEW.raw_user_meta_data->>'linked_student_username'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- Update profiles_select to allow parent access
-- =============================================
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow parents to read submissions of their linked student
DROP POLICY IF EXISTS "submissions_select" ON exam_submissions;
CREATE POLICY "submissions_select" ON exam_submissions FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher') OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'parent' AND linked_student_id = student_id)
);
