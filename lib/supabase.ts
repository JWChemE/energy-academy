import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return user;
}

export async function markLessonComplete(
  userId: string,
  courseSlug: string,
  lessonSlug: string
) {
  return supabase
    .from('progress')
    .upsert(
      {
        user_id: userId,
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,course_slug,lesson_slug' }
    );
}

export async function saveQuizResult(
  userId: string,
  courseSlug: string,
  lessonSlug: string,
  quizId: string,
  score: number,
  maxScore: number,
  answers: Record<string, number>
) {
  return supabase
    .from('quiz_results')
    .upsert(
      {
        user_id: userId,
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
        quiz_id: quizId,
        score,
        max_score: maxScore,
        answers,
      },
      { onConflict: 'user_id,quiz_id' }
    );
}

export async function getUserProgress(userId: string) {
  return supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId);
}

export async function getNextLesson(userId: string) {
  const { data: completed } = await supabase
    .from('progress')
    .select('course_slug, lesson_slug')
    .eq('user_id', userId)
    .not('completed_at', 'is', null);

  // Simple recommender: if user completed a lesson, suggest the next one in that course
  // Otherwise, suggest the first lesson of Level 1
  if (completed && completed.length > 0) {
    const lastCompleted = completed[completed.length - 1];
    return { course: lastCompleted.course_slug, lesson: 'next-in-sequence' };
  }

  return { course: 'intro-to-energy-management', lesson: 'what-is-energy' };
}
