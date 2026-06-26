'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface ProgressItem {
  course_slug: string;
  lesson_slug: string;
  completed_at: string | null;
}

interface CourseProgress {
  slug: string;
  title: string;
  completed: number;
  total: number;
  percentage: number;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [nextLesson, setNextLesson] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.id) {
      fetchProgress();
      fetchNextLesson();
    }
  }, [user?.id]);

  async function fetchProgress() {
    const { data } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user?.id);

    if (data) {
      setProgress(data);
      calculateCourseProgress(data);
    }
  }

  function calculateCourseProgress(progressData: ProgressItem[]) {
    // Group by course and calculate percentage
    const byCourse: Record<string, { completed: number; total: number }> = {};

    progressData.forEach((p) => {
      if (!byCourse[p.course_slug]) {
        byCourse[p.course_slug] = { completed: 0, total: 0 };
      }
      byCourse[p.course_slug].total += 1;
      if (p.completed_at) {
        byCourse[p.course_slug].completed += 1;
      }
    });

    const courses = Object.entries(byCourse).map(([slug, data]) => ({
      slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      completed: data.completed,
      total: data.total,
      percentage: Math.round((data.completed / data.total) * 100),
    }));

    setCourseProgress(courses);
  }

  async function fetchNextLesson() {
    const completed = progress.filter((p) => p.completed_at);
    if (completed.length > 0) {
      setNextLesson({
        course: completed[completed.length - 1].course_slug,
        lesson: 'Continue where you left off',
      });
    } else {
      setNextLesson({
        course: 'intro-to-energy-management',
        lesson: 'what-is-energy',
      });
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.full_name || user.email}
            </h1>
            <p className="text-gray-600 mt-1">
              {user.subscription_status === 'premium' ? '⭐ Premium Member' : 'Free Member'}
            </p>
          </div>
          <div className="flex gap-3">
            {user.role === 'superuser' && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                supabase.auth.signOut();
                router.push('/');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Next Steps */}
        {nextLesson && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">📚 Continue Learning</h2>
            <p className="text-gray-600 mb-4">
              {nextLesson.lesson}
            </p>
            <Link
              href={`/courses/${nextLesson.course}/${nextLesson.lesson}`}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Lesson
            </Link>
          </div>
        )}

        {/* Course Progress */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Your Progress</h2>
          <div className="space-y-4">
            {courseProgress.length === 0 ? (
              <p className="text-gray-600">No courses started yet.</p>
            ) : (
              courseProgress.map((course) => (
                <div key={course.slug}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <span className="text-sm text-gray-600">
                      {course.completed} / {course.total} lessons
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{course.percentage}% complete</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* All Courses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📖 All Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/levels/level-1"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <h3 className="font-bold text-gray-900">Level 1: Foundations</h3>
              <p className="text-sm text-gray-600">Master energy fundamentals</p>
            </Link>
            <Link
              href="/levels/level-2"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <h3 className="font-bold text-gray-900">Level 2: System Deep Dives</h3>
              <p className="text-sm text-gray-600">Technical expertise in energy systems</p>
            </Link>
            <Link
              href="/levels/level-3"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <h3 className="font-bold text-gray-900">Level 3: Leadership</h3>
              <p className="text-sm text-gray-600">Lead energy transformation</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
