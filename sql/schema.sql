-- =============================================
-- Online Exam Portal - Supabase Database Schema
-- Run this ENTIRE file in Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. SCHOOLS
-- =============================================
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. PROFILES (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student', 'admin')),
  -- Teacher-only fields
  teacher_status TEXT CHECK (teacher_status IN ('subject_teacher', 'class_teacher', 'head_teacher')),
  subject_taught TEXT,                         -- subject name (for subject teachers)
  assigned_class TEXT,                         -- base grade key e.g. 'grade1' (for class teachers)
  assigned_class_section TEXT,                 -- section letter e.g. 'A', 'B' or NULL
  -- Common fields
  school_id UUID REFERENCES schools(id),
  class TEXT,                                  -- for students: grade key e.g. 'grade1'
  class_section TEXT,                          -- for students: section letter e.g. 'A', 'B' or NULL
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  parent_name TEXT,
  parent_phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. SUBJECTS
-- =============================================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  class TEXT NOT NULL,
  teacher_id UUID REFERENCES profiles(id),
  description TEXT,
  icon TEXT DEFAULT 'fas fa-book',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, school_id, class)
);

-- =============================================
-- 4. EXAMS
-- =============================================
CREATE TABLE IF NOT EXISTS exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  class TEXT NOT NULL,
  exam_date DATE,
  exam_time TIME,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  total_marks INTEGER NOT NULL DEFAULT 60,
  is_published BOOLEAN DEFAULT FALSE,
  allow_late_submission BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. EXAM SECTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS exam_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE NOT NULL,
  section_name TEXT NOT NULL,
  section_type TEXT NOT NULL CHECK (section_type IN ('mcq', 'fill_blank', 'theory')),
  max_marks INTEGER NOT NULL,
  instructions TEXT,
  sort_order INTEGER DEFAULT 0
);

-- =============================================
-- 6. QUESTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE NOT NULL,
  section_id UUID REFERENCES exam_sections(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'fill_blank', 'theory')),
  options JSONB,
  correct_answer TEXT,
  marks INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  image_url TEXT
);

-- =============================================
-- 7. EXAM SUBMISSIONS
-- =============================================
CREATE TABLE IF NOT EXISTS exam_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  is_auto_submitted BOOLEAN DEFAULT FALSE,
  total_score NUMERIC DEFAULT 0,
  max_score NUMERIC DEFAULT 0,
  percentage NUMERIC DEFAULT 0,
  grade_letter TEXT,
  section_scores JSONB DEFAULT '{}',
  answers JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

-- =============================================
-- 8. TEACHER SIGNATURES
-- =============================================
CREATE TABLE IF NOT EXISTS teacher_signatures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  signature_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. QUESTION FILES (uploaded Word/PDF)
-- =============================================
CREATE TABLE IF NOT EXISTS question_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_files ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Schools: anyone can read, anyone can insert (needed during signup before auth)
CREATE POLICY "schools_select" ON schools FOR SELECT USING (true);
CREATE POLICY "schools_insert" ON schools FOR INSERT WITH CHECK (true);
CREATE POLICY "schools_update" ON schools FOR UPDATE USING (auth.uid() IS NOT NULL);

-- =============================================
-- RPC: Safe school creation (callable before auth)
-- =============================================
CREATE OR REPLACE FUNCTION create_school_if_not_exists(school_name TEXT)
RETURNS UUID AS $$
DECLARE
  school_id UUID;
BEGIN
  -- Try to find existing school
  SELECT id INTO school_id FROM schools WHERE name = school_name;
  IF school_id IS NOT NULL THEN
    RETURN school_id;
  END IF;
  -- Insert new school
  INSERT INTO schools (name) VALUES (school_name) RETURNING id INTO school_id;
  RETURN school_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subjects
CREATE POLICY "subjects_select" ON subjects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "subjects_insert" ON subjects FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "subjects_update" ON subjects FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "subjects_delete" ON subjects FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Exams
CREATE POLICY "exams_select" ON exams FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "exams_insert" ON exams FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "exams_update" ON exams FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "exams_delete" ON exams FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Exam Sections
CREATE POLICY "sections_select" ON exam_sections FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "sections_insert" ON exam_sections FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "sections_update" ON exam_sections FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "sections_delete" ON exam_sections FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Questions
CREATE POLICY "questions_select" ON questions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "questions_insert" ON questions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "questions_update" ON questions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "questions_delete" ON questions FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Submissions
CREATE POLICY "submissions_select" ON exam_submissions FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "submissions_insert" ON exam_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "submissions_update" ON exam_submissions FOR UPDATE USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Teacher Signatures
CREATE POLICY "signatures_select" ON teacher_signatures FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "signatures_insert" ON teacher_signatures FOR INSERT WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "signatures_update" ON teacher_signatures FOR UPDATE USING (auth.uid() = teacher_id);
CREATE POLICY "signatures_delete" ON teacher_signatures FOR DELETE USING (auth.uid() = teacher_id);

-- Question Files
CREATE POLICY "qfiles_select" ON question_files FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "qfiles_insert" ON question_files FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "qfiles_delete" ON question_files FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- =============================================
-- TRIGGER: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, email, role, teacher_status, subject_taught, assigned_class, assigned_class_section, school_id, class, class_section, date_of_birth, gender, parent_name, parent_phone)
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
    NEW.raw_user_meta_data->>'parent_phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- TRIGGER: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER exams_updated_at BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- SEED: Ephraim School
-- =============================================
INSERT INTO schools (id, name, address)
VALUES ('00000000-0000-0000-0000-000000000001', 'Ephraim School', 'Nigeria')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- STORAGE BUCKETS
-- Create these in Supabase Dashboard > Storage
-- or uncomment and run:
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('signatures', 'signatures', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('question-files', 'question-files', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('school-logos', 'school-logos', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for signatures bucket
CREATE POLICY "Signatures are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'signatures');
CREATE POLICY "Authenticated users can upload signatures" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'signatures' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own signatures" ON storage.objects FOR UPDATE USING (bucket_id = 'signatures' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own signatures" ON storage.objects FOR DELETE USING (bucket_id = 'signatures' AND auth.uid() IS NOT NULL);

-- Storage policies for question-files bucket
CREATE POLICY "Auth users can read question files" ON storage.objects FOR SELECT USING (bucket_id = 'question-files' AND auth.uid() IS NOT NULL);
CREATE POLICY "Teachers can upload question files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'question-files' AND auth.uid() IS NOT NULL);
CREATE POLICY "Teachers can delete question files" ON storage.objects FOR DELETE USING (bucket_id = 'question-files' AND auth.uid() IS NOT NULL);
