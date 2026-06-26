# Quick Start: Get Everything Running

## 1. Install Supabase Package (1 minute)

```bash
npm install @supabase/supabase-js
```

## 2. Create Supabase Project (2 minutes)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `energy-academy`
3. Wait for initialization
4. Copy Project URL and Anon Key (Settings → API)

## 3. Create .env.local File (1 minute)

In your project root:

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
EOF
```

Replace with your actual Supabase credentials.

## 4. Set Up Database Schema (2 minutes)

1. In Supabase: SQL Editor → New Query
2. Copy entire `docs/DATABASE_SCHEMA.sql`
3. Paste and click Run
4. Wait for success

## 5. Create Superuser (1 minute)

In Supabase SQL Editor, run:

```sql
-- First, create superuser account
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  'jacobwillis994@gmail.com',
  crypt('your_password_here', gen_salt('bf')),
  now(),
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Then set role to superuser
UPDATE public.users 
SET role = 'superuser' 
WHERE email = 'jacobwillis994@gmail.com';
```

(Or manually via Supabase Authentication UI → Add User)

## 6. Test Locally (2 minutes)

```bash
npm run dev
```

Visit: `http://localhost:3000/auth`

- Sign up with a test email
- Dashboard should load
- As superuser (`jacobwillis994@gmail.com`), visit `/admin`

## 7. Deploy (5 minutes)

```bash
git add .
git commit -m "Add user auth, progress tracking, admin dashboard"
git push origin main
```

Then on [vercel.com](https://vercel.com):
1. Connect your GitHub repo
2. Add env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. Deploy!

Your app is now live at `your-app.vercel.app`

## What You Now Have

✅ **User authentication** — Sign up, sign in, sign out
✅ **User dashboard** — Progress tracking, next steps
✅ **Admin dashboard** — Manage users, view analytics, create announcements
✅ **Role-based access** — Superuser privileges for you
✅ **Database** — Track progress, quizzes, bookmarks
✅ **31 courses, 470+ lessons** — All authored and ready

## What's Next?

### Option A: Add Progress to Lessons (30 minutes)
Update lesson pages to show "Mark Complete" button:
- See `AUTH_IMPLEMENTATION.md` for code example
- Add to `app/courses/[course]/[lesson]/page.tsx`

### Option B: Set Up Payments (1-2 hours)
Integrate Stripe for premium subscriptions:
- Create Stripe account
- Add webhook for subscription changes
- Upgrade `subscription_status` on payment

### Option C: Deploy Immediately
Everything works without these! Ship it and add features later.

## Files You Need to Review

- `docs/SETUP_GUIDE.md` — Detailed step-by-step
- `docs/AUTH_IMPLEMENTATION.md` — How everything works
- `app/auth-context.tsx` — Auth state management
- `app/admin/page.tsx` — Admin dashboard code
- `lib/supabase.ts` — Database helpers

## Support

Stuck? Check:
1. **Are env vars set?** `echo $NEXT_PUBLIC_SUPABASE_URL`
2. **Is Supabase project created?** Check supabase.com dashboard
3. **Did schema load?** Check Supabase SQL Editor for tables
4. **Is superuser created?** Check users table in Supabase

## Success Checklist

- [ ] Supabase project created
- [ ] .env.local configured with URL + key
- [ ] DATABASE_SCHEMA.sql executed
- [ ] Superuser account created
- [ ] `npm run dev` works
- [ ] Can sign up at `/auth`
- [ ] Dashboard loads at `/dashboard`
- [ ] Superuser sees `/admin` button
- [ ] Admin dashboard works
- [ ] Deploy to Vercel
- [ ] Live app accessible

You're done! 🎉
