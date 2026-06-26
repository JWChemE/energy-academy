# Energy Academy Setup Guide

## Overview

This guide walks you through setting up the complete Energy Academy platform with user authentication, progress tracking, and admin dashboard.

## Prerequisites

- Node.js 18+ installed
- Git
- A Supabase account (free tier works great)

## Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

## Step 2: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose a name (e.g., "energy-academy")
5. Create a strong database password
6. Wait for the project to initialize (~2 minutes)

## Step 3: Set Up Database Schema

1. In Supabase, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `docs/DATABASE_SCHEMA.sql`
4. Paste into the SQL editor
5. Click "Run"
6. Wait for it to complete successfully

## Step 4: Create Superuser Account

After the schema is created:

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Email: `jacobwillis994@gmail.com`
4. Password: (create a strong one)
5. Click "Create user"

Then manually update the user's role to superuser:

1. Go to **SQL Editor**
2. Run:
```sql
UPDATE public.users 
SET role = 'superuser' 
WHERE email = 'jacobwillis994@gmail.com';
```

## Step 5: Get Your API Keys

1. In Supabase, go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 6: Create .env.local File

In your project root, create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 7: Update app/layout.tsx

Wrap your app with AuthProvider:

```tsx
import { AuthProvider } from '@/app/auth-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## Step 8: Install Supabase Package

```bash
npm install @supabase/supabase-js
```

## Step 9: Test the Setup

1. Run: `npm run dev`
2. Go to `http://localhost:3000/auth`
3. Sign up with a test account
4. You should be redirected to dashboard
5. Check your Supabase project → **Users** to confirm the user was created

## Step 10: Access Admin Dashboard

1. Log in as `jacobwillis994@gmail.com`
2. You'll see an "Admin Dashboard" button on the dashboard
3. Click it to access: `/admin`
4. Here you can:
   - View all users and their progress
   - Promote users to premium
   - Create announcements
   - View analytics

## Step 11: Add Progress Tracking to Lessons

In lesson pages, add a button to mark lessons complete:

```tsx
import { useAuth } from '@/app/auth-context';
import { markLessonComplete } from '@/lib/supabase';

export default function LessonPage({ params }) {
  const { user } = useAuth();

  async function handleMarkComplete() {
    if (!user?.id) return;
    await markLessonComplete(
      user.id,
      params.course,
      params.lesson
    );
    alert('Marked as complete!');
  }

  return (
    <div>
      {/* Lesson content */}
      {user && (
        <button
          onClick={handleMarkComplete}
          className="mt-8 px-6 py-2 bg-green-600 text-white rounded"
        >
          ✓ Mark as Complete
        </button>
      )}
    </div>
  );
}
```

## Features Now Available

✅ User signup/login
✅ User dashboard with progress tracking
✅ Admin dashboard (superuser only)
✅ View all users and their progress
✅ Promote users to premium
✅ Create announcements
✅ Quiz score tracking
✅ Lesson completion tracking
✅ Bookmark lessons
✅ Time spent tracking

## Next Steps

1. **Deploy to Vercel:**
   ```bash
   git push origin main
   ```
   Then connect to Vercel at vercel.com

2. **Add Payment Processing** (future):
   - Integrate Stripe for premium subscriptions
   - Update `subscription_status` based on Stripe webhooks

3. **Email Notifications** (future):
   - Add email on course completion
   - Weekly progress summaries

## Troubleshooting

**"RLS policy error when creating user"**
- Make sure DATABASE_SCHEMA.sql was fully executed
- Check that RLS policies exist in Supabase

**"User created but role is NULL"**
- Manually run the SQL update command to set role to 'superuser'

**"Can't sign in"**
- Check that email confirmation is OFF in Supabase Settings → Authentication
- Or confirm the email in the Supabase dashboard

**"404 on /auth page"**
- Make sure auth/page.tsx exists
- Clear browser cache
- Restart dev server
