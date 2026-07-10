'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
  subscription_status: string;
  created_at: string;
}

interface Analytics {
  total_users: number;
  premium_users: number;
  total_lessons_completed: number;
  most_popular_course: string;
  most_popular_lesson: string;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [tab, setTab] = useState<'overview' | 'users' | 'announcements'>('overview');
  const [announcement, setAnnouncement] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'superuser')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.id && user.role === 'superuser') {
      fetchUsers();
      fetchAnalytics();
    }
  }, [user?.id, user?.role]);

  async function fetchUsers() {
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    setUsers(data || []);
  }

  async function fetchAnalytics() {
    // Get user stats
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: premiumUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'premium');

    // Get engagement stats
    const { count: completions } = await supabase
      .from('progress')
      .select('*', { count: 'exact', head: true })
      .not('completed_at', 'is', null);

    // Popular courses (mock data for now)
    const { data: courses } = await supabase
      .from('analytics')
      .select('course_slug')
      .eq('event_type', 'view');

    const courseFreq = courses?.reduce((acc: Record<string, number>, c: { course_slug: string }) => {
      acc[c.course_slug] = (acc[c.course_slug] || 0) + 1;
      return acc;
    }, {}) || {};

    const mostPopularCourse = Object.entries(courseFreq).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A';

    setAnalytics({
      total_users: totalUsers || 0,
      premium_users: premiumUsers || 0,
      total_lessons_completed: completions || 0,
      most_popular_course: mostPopularCourse,
      most_popular_lesson: 'N/A',
    });
  }

  async function createAnnouncement() {
    if (!announcementTitle || !announcement) return;

    await supabase
      .from('announcements')
      .insert({
        created_by_id: user?.id,
        title: announcementTitle,
        content: announcement,
      });

    setAnnouncementTitle('');
    setAnnouncement('');
    alert('Announcement created!');
  }

  async function makeUserPremium(userId: string) {
    await supabase
      .from('users')
      .update({ subscription_status: 'premium' })
      .eq('id', userId);

    fetchUsers();
  }

  async function deleteUser(userId: string) {
    if (confirm('Are you sure? This will delete all their progress.')) {
      await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      fetchUsers();
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user || user.role !== 'superuser') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">🔧 Admin Dashboard</h1>
          <button
            onClick={() => {
              supabase.auth.signOut();
              router.push('/');
            }}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex gap-6 px-6">
          {(['overview', 'users', 'announcements'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-4 px-2 font-medium capitalize ${
                tab === t
                  ? 'border-b-2 border-indigo-500 text-indigo-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {tab === 'overview' && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded p-6">
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-indigo-400">{analytics.total_users}</p>
            </div>
            <div className="bg-gray-800 rounded p-6">
              <p className="text-gray-400 text-sm">Premium Users</p>
              <p className="text-3xl font-bold text-green-400">{analytics.premium_users}</p>
            </div>
            <div className="bg-gray-800 rounded p-6">
              <p className="text-gray-400 text-sm">Lessons Completed</p>
              <p className="text-3xl font-bold text-blue-400">{analytics.total_lessons_completed}</p>
            </div>
            <div className="bg-gray-800 rounded p-6">
              <p className="text-gray-400 text-sm">Most Popular</p>
              <p className="text-lg font-bold text-yellow-400 truncate">{analytics.most_popular_course}</p>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="bg-gray-800 rounded p-6">
            <h2 className="text-xl font-bold mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.full_name || '-'}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            u.subscription_status === 'premium'
                              ? 'bg-green-900 text-green-200'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {u.subscription_status}
                        </span>
                      </td>
                      <td className="p-3 capitalize">{u.role}</td>
                      <td className="p-3 space-x-2">
                        {u.subscription_status !== 'premium' && (
                          <button
                            onClick={() => makeUserPremium(u.id)}
                            className="text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                          >
                            Make Premium
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'announcements' && (
          <div className="bg-gray-800 rounded p-6">
            <h2 className="text-xl font-bold mb-4">Create Announcement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-32"
                  placeholder="Announcement content"
                />
              </div>
              <button
                onClick={createAnnouncement}
                className="bg-indigo-600 px-6 py-2 rounded hover:bg-indigo-700 font-medium"
              >
                Create Announcement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
