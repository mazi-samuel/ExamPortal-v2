-- =============================================
-- SEED: ICT Mid-Term Question Bank (Year 1-5)
-- For Ephraim School, Teacher: Mr Mazi
-- Run AFTER schema.sql in Supabase SQL Editor
-- =============================================

-- IDs for reuse
DO $$
DECLARE
  v_school_id UUID := '00000000-0000-0000-0000-000000000001';  -- Ephraim School
  v_teacher_id UUID;

  -- Subject IDs
  v_ict1_id UUID;
  v_ict2_id UUID;
  v_ict3_id UUID;
  v_ict4_id UUID;
  v_ict5_id UUID;

  -- Exam IDs
  v_exam1_id UUID;
  v_exam2_id UUID;
  v_exam3_id UUID;
  v_exam4_id UUID;
  v_exam5_id UUID;

  -- Section IDs
  v_secA UUID;
  v_secB UUID;
  v_secC UUID;

BEGIN

  -- Try to find Mr Mazi's profile (may not exist yet)
  SELECT id INTO v_teacher_id FROM profiles WHERE full_name ILIKE '%Mazi%' AND school_id = v_school_id LIMIT 1;

  -- Clean up any previously seeded ICT Mid-Term exams (safe to re-run)
  DELETE FROM exams WHERE school_id = v_school_id AND title LIKE 'ICT Mid-Term Examination - Grade %';

  -- =============================================
  -- UPSERT ICT SUBJECTS FOR EACH GRADE
  -- (Re-uses existing rows if already created)
  -- =============================================
  INSERT INTO subjects (id, name, school_id, class, teacher_id, description, icon)
  VALUES (uuid_generate_v4(), 'ICT', v_school_id, 'grade1', v_teacher_id, 'Information and Communication Technology - Grade 1', 'fas fa-laptop')
  ON CONFLICT (name, school_id, class) DO UPDATE SET teacher_id = COALESCE(EXCLUDED.teacher_id, subjects.teacher_id)
  RETURNING id INTO v_ict1_id;

  INSERT INTO subjects (id, name, school_id, class, teacher_id, description, icon)
  VALUES (uuid_generate_v4(), 'ICT', v_school_id, 'grade2', v_teacher_id, 'Information and Communication Technology - Grade 2', 'fas fa-laptop')
  ON CONFLICT (name, school_id, class) DO UPDATE SET teacher_id = COALESCE(EXCLUDED.teacher_id, subjects.teacher_id)
  RETURNING id INTO v_ict2_id;

  INSERT INTO subjects (id, name, school_id, class, teacher_id, description, icon)
  VALUES (uuid_generate_v4(), 'ICT', v_school_id, 'grade3', v_teacher_id, 'Information and Communication Technology - Grade 3', 'fas fa-laptop')
  ON CONFLICT (name, school_id, class) DO UPDATE SET teacher_id = COALESCE(EXCLUDED.teacher_id, subjects.teacher_id)
  RETURNING id INTO v_ict3_id;

  INSERT INTO subjects (id, name, school_id, class, teacher_id, description, icon)
  VALUES (uuid_generate_v4(), 'ICT', v_school_id, 'grade4', v_teacher_id, 'Information and Communication Technology - Grade 4', 'fas fa-laptop')
  ON CONFLICT (name, school_id, class) DO UPDATE SET teacher_id = COALESCE(EXCLUDED.teacher_id, subjects.teacher_id)
  RETURNING id INTO v_ict4_id;

  INSERT INTO subjects (id, name, school_id, class, teacher_id, description, icon)
  VALUES (uuid_generate_v4(), 'ICT', v_school_id, 'grade5', v_teacher_id, 'Information and Communication Technology - Grade 5', 'fas fa-laptop')
  ON CONFLICT (name, school_id, class) DO UPDATE SET teacher_id = COALESCE(EXCLUDED.teacher_id, subjects.teacher_id)
  RETURNING id INTO v_ict5_id;

  -- =============================================
  -- YEAR 1 (BASIC 1) - ICT MID-TERM EXAM
  -- =============================================
  INSERT INTO exams (id, title, description, subject_id, school_id, class, duration_minutes, total_marks, is_published, created_by)
  VALUES (uuid_generate_v4(), 'ICT Mid-Term Examination - Grade 1', 'First Term Mid-Term ICT Exam for Grade 1 (Basic 1)', v_ict1_id, v_school_id, 'grade1', 30, 25, true, v_teacher_id)
  RETURNING id INTO v_exam1_id;

  -- Section A: Objectives (10 questions, 1 mark each = 10 marks)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam1_id, 'Section A: Objectives', 'mcq', 10, 'Choose the correct answer for each question.', 0)
  RETURNING id INTO v_secA;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, options, correct_answer, marks, sort_order) VALUES
  (v_exam1_id, v_secA, 'A computer is a ______.', 'mcq', '["animal","machine","tree","food"]', 'machine', 1, 0),
  (v_exam1_id, v_secA, 'A printer gives us ______ copy.', 'mcq', '["soft","hard","no","digital"]', 'hard', 1, 1),
  (v_exam1_id, v_secA, 'A scanner is used to ______.', 'mcq', '["print paper","copy into computer","play music","eat food"]', 'copy into computer', 1, 2),
  (v_exam1_id, v_secA, 'A flash drive is used to ______.', 'mcq', '["cook food","store files","wash clothes","sing songs"]', 'store files', 1, 3),
  (v_exam1_id, v_secA, 'RAM means ______.', 'mcq', '["Random Access Memory","Read All Memory","Run A Machine","Rest And Move"]', 'Random Access Memory', 1, 4),
  (v_exam1_id, v_secA, 'Before pressing the power button, we switch on the ______.', 'mcq', '["fan","power source","television","radio"]', 'power source', 1, 5),
  (v_exam1_id, v_secA, 'We must not ______ cables.', 'mcq', '["touch","pull","see","count"]', 'pull', 1, 6),
  (v_exam1_id, v_secA, 'The computer room is used for ______.', 'mcq', '["cooking","learning","sleeping","dancing"]', 'learning', 1, 7),
  (v_exam1_id, v_secA, 'We should use ______ hands when using the computer.', 'mcq', '["dirty","wet","clean","oily"]', 'clean', 1, 8),
  (v_exam1_id, v_secA, 'USB cable is used to ______ devices.', 'mcq', '["break","connect","throw","hide"]', 'connect', 1, 9);

  -- Section B: Fill in the Gap (5 questions, 2 marks each = 10 marks)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam1_id, 'Section B: Fill in the Gap', 'fill_blank', 10, 'Fill in the blanks with the correct word.', 1)
  RETURNING id INTO v_secB;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, correct_answer, marks, sort_order) VALUES
  (v_exam1_id, v_secB, 'The ______ stores information inside the computer.', 'fill_blank', 'ROM', 2, 0),
  (v_exam1_id, v_secB, 'The ______ button is pressed to start the computer.', 'fill_blank', 'Power', 2, 1),
  (v_exam1_id, v_secB, 'A computer room is a special ______ for computers.', 'fill_blank', 'room', 2, 2),
  (v_exam1_id, v_secB, 'We must not eat or ______ near the computer.', 'fill_blank', 'drink', 2, 3),
  (v_exam1_id, v_secB, 'ROM means ______ Only Memory.', 'fill_blank', 'Read', 2, 4);

  -- Section C: Theory (3 questions, 5 marks total)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam1_id, 'Section C: Theory', 'theory', 5, 'Answer the following questions in full sentences.', 2)
  RETURNING id INTO v_secC;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, correct_answer, marks, sort_order) VALUES
  (v_exam1_id, v_secC, 'Mention three parts of a computer.', 'theory', 'Monitor, Keyboard, Mouse (CPU also accepted)', 2, 0),
  (v_exam1_id, v_secC, 'State three safety rules in the computer room.', 'theory', 'Do not eat or drink; Use clean hands; Do not pull cables; Sit properly (Any 3)', 2, 1),
  (v_exam1_id, v_secC, 'Explain two steps in starting a computer.', 'theory', 'Switch on the power source/UPS; Press the power button on the CPU; Turn on the monitor (Any 2 well explained)', 1, 2);

  -- =============================================
  -- YEAR 2 (BASIC 2) - ICT MID-TERM EXAM
  -- =============================================
  INSERT INTO exams (id, title, description, subject_id, school_id, class, duration_minutes, total_marks, is_published, created_by)
  VALUES (uuid_generate_v4(), 'ICT Mid-Term Examination - Grade 2', 'First Term Mid-Term ICT Exam for Grade 2 (Basic 2)', v_ict2_id, v_school_id, 'grade2', 30, 25, true, v_teacher_id)
  RETURNING id INTO v_exam2_id;

  -- Section A: Objectives (10 questions, 1 mark each = 10 marks)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam2_id, 'Section A: Objectives', 'mcq', 10, 'Choose the correct answer for each question.', 0)
  RETURNING id INTO v_secA;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, options, correct_answer, marks, sort_order) VALUES
  (v_exam2_id, v_secA, 'ICT means ______.', 'mcq', '["Internet Computer Technology","Information and Communication Technology","International Computer Training","Inside Computer Technology"]', 'Information and Communication Technology', 1, 0),
  (v_exam2_id, v_secA, 'A workstation is ______.', 'mcq', '["a table","a complete computer set","a TV set","a phone"]', 'a complete computer set', 1, 1),
  (v_exam2_id, v_secA, 'The Start button is used to ______.', 'mcq', '["shut down only","open programs","delete files","print papers"]', 'open programs', 1, 2),
  (v_exam2_id, v_secA, 'Recycle Bin stores ______ files.', 'mcq', '["new","deleted","important","hidden"]', 'deleted', 1, 3),
  (v_exam2_id, v_secA, 'File Explorer is used to open ______.', 'mcq', '["games","folders","music","websites"]', 'folders', 1, 4),
  (v_exam2_id, v_secA, 'The largest and fastest computer is ______.', 'mcq', '["micro computer","mini computer","super computer","laptop"]', 'super computer', 1, 5),
  (v_exam2_id, v_secA, 'Mainframe computers are used in ______.', 'mcq', '["homes","banks","kitchens","gardens"]', 'banks', 1, 6),
  (v_exam2_id, v_secA, 'A laptop is a ______ computer.', 'mcq', '["super","mainframe","micro","mini"]', 'micro', 1, 7),
  (v_exam2_id, v_secA, 'Before turning on the CPU, we must switch on the ______.', 'mcq', '["fan","power source","AC","TV"]', 'power source', 1, 8),
  (v_exam2_id, v_secA, 'Media Player is used to play ______.', 'mcq', '["games","music and videos","documents","pictures"]', 'music and videos', 1, 9);

  -- Section B: Fill in the Gap (5 questions, 2 marks each = 10 marks)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam2_id, 'Section B: Fill in the Gap', 'fill_blank', 10, 'Fill in the blanks with the correct word.', 1)
  RETURNING id INTO v_secB;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, correct_answer, marks, sort_order) VALUES
  (v_exam2_id, v_secB, 'A ______ is a complete computer set arranged for use.', 'fill_blank', 'Workstation', 2, 0),
  (v_exam2_id, v_secB, 'The Recycle Bin stores ______ files.', 'fill_blank', 'deleted', 2, 1),
  (v_exam2_id, v_secB, 'The smallest type of computer is called ______ computer.', 'fill_blank', 'micro', 2, 2),
  (v_exam2_id, v_secB, 'A ______ computer is used for weather forecasting.', 'fill_blank', 'super', 2, 3),
  (v_exam2_id, v_secB, 'File Explorer helps us open ______ and files.', 'fill_blank', 'folders', 2, 4);

  -- Section C: Theory (3 questions, 5 marks total)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam2_id, 'Section C: Theory', 'theory', 5, 'Answer the following questions.', 2)
  RETURNING id INTO v_secC;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, correct_answer, marks, sort_order) VALUES
  (v_exam2_id, v_secC, 'Define a workstation.', 'theory', 'A workstation is a complete computer set consisting of monitor, CPU, keyboard, and mouse arranged for use.', 2, 0),
  (v_exam2_id, v_secC, 'Mention two uses of the Start button.', 'theory', 'To open programs; To shut down the computer; To access settings (Any 2)', 2, 1),
  (v_exam2_id, v_secC, 'List the four types of computers by size.', 'theory', 'Super computer, Mainframe computer, Mini computer, Micro computer', 1, 2);

  -- =============================================
  -- YEAR 3 (BASIC 3) - ICT MID-TERM EXAM
  -- =============================================
  INSERT INTO exams (id, title, description, subject_id, school_id, class, duration_minutes, total_marks, is_published, created_by)
  VALUES (uuid_generate_v4(), 'ICT Mid-Term Examination - Grade 3', 'First Term Mid-Term ICT Exam for Grade 3 (Basic 3)', v_ict3_id, v_school_id, 'grade3', 30, 25, true, v_teacher_id)
  RETURNING id INTO v_exam3_id;

  -- Section A: Objectives (10 questions, 1 mark each = 10 marks)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam3_id, 'Section A: Objectives', 'mcq', 10, 'Choose the correct answer for each question.', 0)
  RETURNING id INTO v_secA;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, options, correct_answer, marks, sort_order) VALUES
  (v_exam3_id, v_secA, 'Hardware refers to ______.', 'mcq', '["programs","physical parts","ideas","music"]', 'physical parts', 1, 0),
  (v_exam3_id, v_secA, 'MS Word is an example of ______.', 'mcq', '["hardware","application software","input device","output device"]', 'application software', 1, 1),
  (v_exam3_id, v_secA, 'Encarta is used for ______.', 'mcq', '["typing","research","drawing","printing"]', 'research', 1, 2),
  (v_exam3_id, v_secA, 'Mavis Beacon teaches ______.', 'mcq', '["drawing","typing","singing","cooking"]', 'typing', 1, 3),
  (v_exam3_id, v_secA, 'The brain of the computer is the ______.', 'mcq', '["Monitor","Keyboard","CPU","Mouse"]', 'CPU', 1, 4),
  (v_exam3_id, v_secA, 'The Control Unit directs ______.', 'mcq', '["traffic","computer activities","cooking","dancing"]', 'computer activities', 1, 5),
  (v_exam3_id, v_secA, 'The ALU performs ______.', 'mcq', '["typing","calculations","printing","scanning"]', 'calculations', 1, 6),
  (v_exam3_id, v_secA, 'Which of these is an input device?', 'mcq', '["Printer","Monitor","Mouse","Speaker"]', 'Mouse', 1, 7),
  (v_exam3_id, v_secA, 'MS Word is used for ______.', 'mcq', '["typing documents","playing games","drawing pictures","sending email"]', 'typing documents', 1, 8),
  (v_exam3_id, v_secA, 'Software can be ______.', 'mcq', '["eaten","touched","carried","not touched"]', 'not touched', 1, 9);

  -- Section B: Fill in the Gap (5 questions, 2 marks each = 10 marks)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam3_id, 'Section B: Fill in the Gap', 'fill_blank', 10, 'Fill in the blanks with the correct word.', 1)
  RETURNING id INTO v_secB;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, correct_answer, marks, sort_order) VALUES
  (v_exam3_id, v_secB, 'CPU means ______ Processing Unit.', 'fill_blank', 'Central', 2, 0),
  (v_exam3_id, v_secB, 'The ______ Unit directs computer operations.', 'fill_blank', 'Control', 2, 1),
  (v_exam3_id, v_secB, 'The ALU performs ______ calculations.', 'fill_blank', 'arithmetic and logical', 2, 2),
  (v_exam3_id, v_secB, 'A program used for typing is ______.', 'fill_blank', 'MS Word', 2, 3),
  (v_exam3_id, v_secB, 'Physical parts of a computer are called ______.', 'fill_blank', 'Hardware', 2, 4);

  -- Section C: Theory (3 questions, 5 marks total)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam3_id, 'Section C: Theory', 'theory', 5, 'Answer the following questions in full sentences.', 2)
  RETURNING id INTO v_secC;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, correct_answer, marks, sort_order) VALUES
  (v_exam3_id, v_secC, 'Differentiate between hardware and software.', 'theory', 'Hardware are the physical parts of a computer that can be seen and touched, while software are the programs that run on the computer and cannot be touched.', 2, 0),
  (v_exam3_id, v_secC, 'Mention two components of the CPU and their functions.', 'theory', 'Control Unit – Directs all computer operations; ALU – Performs arithmetic and logical calculations', 2, 1),
  (v_exam3_id, v_secC, 'List four examples of application software.', 'theory', 'MS Word, MS Excel, PowerPoint, Mavis Beacon (Encarta also accepted)', 1, 2);

  -- =============================================
  -- YEAR 4 (BASIC 4) - ICT MID-TERM EXAM
  -- =============================================
  INSERT INTO exams (id, title, description, subject_id, school_id, class, duration_minutes, total_marks, is_published, created_by)
  VALUES (uuid_generate_v4(), 'ICT Mid-Term Examination - Grade 4', 'First Term Mid-Term ICT Exam for Grade 4 (Basic 4)', v_ict4_id, v_school_id, 'grade4', 45, 30, true, v_teacher_id)
  RETURNING id INTO v_exam4_id;

  -- Section A: Objectives (10 questions, 1 mark each = 10 marks)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam4_id, 'Section A: Objectives', 'mcq', 10, 'Choose the correct answer for each question.', 0)
  RETURNING id INTO v_secA;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, options, correct_answer, marks, sort_order) VALUES
  (v_exam4_id, v_secA, 'To create a new slide in PowerPoint, you click ______.', 'mcq', '["New File","New Slide","New Page","New Document"]', 'New Slide', 1, 0),
  (v_exam4_id, v_secA, 'Formatting means making your work ______.', 'mcq', '["messy","neat and attractive","deleted","hidden"]', 'neat and attractive', 1, 1),
  (v_exam4_id, v_secA, 'Which of these makes text darker?', 'mcq', '["Italic","Bold","Underline","Strikethrough"]', 'Bold', 1, 2),
  (v_exam4_id, v_secA, 'A computer virus is a ______ program.', 'mcq', '["helpful","harmful","useful","beautiful"]', 'harmful', 1, 3),
  (v_exam4_id, v_secA, 'Which of these is a type of virus?', 'mcq', '["Worm","Dog","Cat","Fish"]', 'Worm', 1, 4),
  (v_exam4_id, v_secA, 'Antivirus is used to ______ viruses.', 'mcq', '["create","spread","detect and remove","install"]', 'detect and remove', 1, 5),
  (v_exam4_id, v_secA, 'Which of these is an antivirus program?', 'mcq', '["MS Word","Avast","Paint","Calculator"]', 'Avast', 1, 6),
  (v_exam4_id, v_secA, 'Coding means giving ______ to a computer.', 'mcq', '["food","instructions","water","clothes"]', 'instructions', 1, 7),
  (v_exam4_id, v_secA, 'One reason to learn coding is to build ______.', 'mcq', '["houses","games","farms","roads"]', 'games', 1, 8),
  (v_exam4_id, v_secA, 'To save a PowerPoint file, click File and then ______.', 'mcq', '["Delete","Save As","Print","Close"]', 'Save As', 1, 9);

  -- Section B: Fill in the Gap (5 questions, 2 marks each = 10 marks)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam4_id, 'Section B: Fill in the Gap', 'fill_blank', 10, 'Fill in the blanks with the correct word.', 1)
  RETURNING id INTO v_secB;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, correct_answer, marks, sort_order) VALUES
  (v_exam4_id, v_secB, 'Formatting can change font ______ and color.', 'fill_blank', 'size', 2, 0),
  (v_exam4_id, v_secB, 'A ______ damages computer files.', 'fill_blank', 'virus', 2, 1),
  (v_exam4_id, v_secB, '______ protects the computer from virus.', 'fill_blank', 'Antivirus', 2, 2),
  (v_exam4_id, v_secB, 'Coding helps us create apps and ______.', 'fill_blank', 'games', 2, 3),
  (v_exam4_id, v_secB, 'To type in PowerPoint, click the ______ box.', 'fill_blank', 'text', 2, 4);

  -- Section C: Theory (3 questions, 10 marks total)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam4_id, 'Section C: Theory', 'theory', 10, 'Answer the following questions in full sentences.', 2)
  RETURNING id INTO v_secC;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, correct_answer, marks, sort_order) VALUES
  (v_exam4_id, v_secC, 'Define computer virus and list two causes.', 'theory', 'A computer virus is a harmful program that damages files and affects computer performance. Causes: Infected flash drives; Downloading unsafe files; Internet threats (Any 2)', 4, 0),
  (v_exam4_id, v_secC, 'Mention three examples of antivirus programs and state one use.', 'theory', 'Examples: Avast, Norton, McAfee. Use: To detect, prevent, and remove computer viruses.', 3, 1),
  (v_exam4_id, v_secC, 'Explain the steps involved in saving a PowerPoint presentation.', 'theory', 'Click File; Click Save As; Choose location; Type file name; Click Save', 3, 2);

  -- =============================================
  -- YEAR 5 (BASIC 5) - ICT MID-TERM EXAM
  -- =============================================
  INSERT INTO exams (id, title, description, subject_id, school_id, class, duration_minutes, total_marks, is_published, created_by)
  VALUES (uuid_generate_v4(), 'ICT Mid-Term Examination - Grade 5', 'First Term Mid-Term ICT Exam for Grade 5 (Basic 5)', v_ict5_id, v_school_id, 'grade5', 45, 30, true, v_teacher_id)
  RETURNING id INTO v_exam5_id;

  -- Section A: Objectives (10 questions, 1 mark each = 10 marks)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam5_id, 'Section A: Objectives', 'mcq', 10, 'Choose the correct answer for each question.', 0)
  RETURNING id INTO v_secA;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, options, correct_answer, marks, sort_order) VALUES
  (v_exam5_id, v_secA, 'A search engine helps us to ______ information.', 'mcq', '["hide","find","delete","create"]', 'find', 1, 0),
  (v_exam5_id, v_secA, 'Which of these is a search engine?', 'mcq', '["Google","MS Word","Paint","Calculator"]', 'Google', 1, 1),
  (v_exam5_id, v_secA, 'Email is used to send ______ through the internet.', 'mcq', '["food","messages","clothes","water"]', 'messages', 1, 2),
  (v_exam5_id, v_secA, 'The folder that stores received emails is called ______.', 'mcq', '["Drafts","Sent","Inbox","Trash"]', 'Inbox', 1, 3),
  (v_exam5_id, v_secA, 'Spam emails are usually ______.', 'mcq', '["important","unwanted","useful","official"]', 'unwanted', 1, 4),
  (v_exam5_id, v_secA, 'An attachment is a ______ added to an email.', 'mcq', '["file","stamp","letter","phone"]', 'file', 1, 5),
  (v_exam5_id, v_secA, 'Internet safety means using the internet ______.', 'mcq', '["carelessly","wisely","angrily","quickly"]', 'wisely', 1, 6),
  (v_exam5_id, v_secA, 'We should not share our ______ online.', 'mcq', '["names","passwords","pictures","ideas"]', 'passwords', 1, 7),
  (v_exam5_id, v_secA, 'HTML means ______.', 'mcq', '["HyperText Markup Language","High Tech Machine Language","Home Technology Media Link","Hard Text Marking Language"]', 'HyperText Markup Language', 1, 8),
  (v_exam5_id, v_secA, 'The <body> tag is used inside an ______ document.', 'mcq', '["HTML","Word","Excel","PDF"]', 'HTML', 1, 9);

  -- Section B: Fill in the Gap (5 questions, 2 marks each = 10 marks)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam5_id, 'Section B: Fill in the Gap', 'fill_blank', 10, 'Fill in the blanks with the correct word.', 1)
  RETURNING id INTO v_secB;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, correct_answer, marks, sort_order) VALUES
  (v_exam5_id, v_secB, 'Google is an example of a ______ engine.', 'fill_blank', 'search', 2, 0),
  (v_exam5_id, v_secB, 'Email stands for electronic ______.', 'fill_blank', 'mail', 2, 1),
  (v_exam5_id, v_secB, 'The folder that stores deleted emails is called ______.', 'fill_blank', 'Trash', 2, 2),
  (v_exam5_id, v_secB, 'We must avoid sharing our ______ online.', 'fill_blank', 'passwords', 2, 3),
  (v_exam5_id, v_secB, 'HTML is used to create ______ pages.', 'fill_blank', 'web', 2, 4);

  -- Section C: Theory (3 questions, 10 marks total)
  INSERT INTO exam_sections (id, exam_id, section_name, section_type, max_marks, instructions, sort_order)
  VALUES (uuid_generate_v4(), v_exam5_id, 'Section C: Theory', 'theory', 10, 'Answer the following questions in full sentences.', 2)
  RETURNING id INTO v_secC;

  INSERT INTO questions (exam_id, section_id, question_text, question_type, correct_answer, marks, sort_order) VALUES
  (v_exam5_id, v_secC, 'Define a search engine and mention three examples.', 'theory', 'A search engine is a website used to find information on the internet. Examples: Google, Bing, Yahoo.', 3, 0),
  (v_exam5_id, v_secC, 'List and explain four parts of an email account.', 'theory', 'Inbox – receives messages; Sent – stores sent messages; Draft – saves unfinished emails; Trash – stores deleted emails', 4, 1),
  (v_exam5_id, v_secC, 'Write a simple HTML structure using the tags: <html>, <head>, and <body>.', 'theory', '<html><head><title>My Page</title></head><body>This is my web page.</body></html>', 3, 2);

  RAISE NOTICE 'ICT Question Bank seeded successfully for Grades 1-5!';
END $$;
