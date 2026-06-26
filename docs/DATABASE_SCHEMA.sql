-- Energy Academy Database Schema
-- Supabase PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'superuser')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'cancelled')),
  subscription_expires_at TIMESTAMP
);

-- Progress table (tracks lesson completion)
CREATE TABLE public.progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  completed_at TIMESTAMP,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, course_slug, lesson_slug)
);

-- Quiz results table
CREATE TABLE public.quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  answers JSONB, -- store which answers user selected
  completed_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

-- Bookmarks table (user notes/bookmarks on lessons)
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  note TEXT,
  bookmarked_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, course_slug, lesson_slug)
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by_id UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP
);

-- Analytics table (course/lesson engagement)
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_slug TEXT NOT NULL,
  lesson_slug TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'complete', 'quiz_taken', 'bookmark')),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile + superusers can view all
CREATE POLICY "users_can_view_self" ON public.users
  FOR SELECT USING (auth.uid() = id OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'superuser');

-- Users can see public announcements
CREATE POLICY "anyone_can_read_announcements" ON public.announcements
  FOR SELECT USING (true);

-- Users can only insert announcements if admin/superuser
CREATE POLICY "only_admin_can_create_announcements" ON public.announcements
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'superuser')
  );

-- Users can view their own progress
CREATE POLICY "users_can_view_own_progress" ON public.progress
  FOR SELECT USING (auth.uid() = user_id OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'superuser');

-- Users can insert/update their own progress
CREATE POLICY "users_can_update_own_progress" ON public.progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_progress_update" ON public.progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies for quiz_results and bookmarks
CREATE POLICY "users_can_view_own_quizzes" ON public.quiz_results
  FOR SELECT USING (auth.uid() = user_id OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'superuser');

CREATE POLICY "users_can_insert_quizzes" ON public.quiz_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_view_own_bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_manage_bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_delete_bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics: superusers can view all, users can't directly query
CREATE POLICY "superuser_can_view_analytics" ON public.analytics
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'superuser');

-- Indexes for performance
CREATE INDEX idx_progress_user_id ON public.progress(user_id);
CREATE INDEX idx_progress_course ON public.progress(course_slug);
CREATE INDEX idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at);
