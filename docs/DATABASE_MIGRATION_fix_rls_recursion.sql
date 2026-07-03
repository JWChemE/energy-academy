-- ============================================================================
-- Energy Academy — RLS recursion fix
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to re-run (uses OR REPLACE / drop-if-exists).
--
-- THE BUG: the original "users_can_view_self" policy checks superuser status
-- with a subquery on public.users — from inside a policy ON public.users.
-- Postgres rejects that as infinite recursion, which makes EVERY select on
-- public.users fail ("infinite recursion detected in policy for relation
-- users"). Because the progress / quiz / analytics / consent policies embed
-- the same subquery, their selects fail too. Net effect: signup appears
-- broken (the app can't read the profile row it just created), the dashboard
-- can't load progress, and the admin page can't load anything.
--
-- THE FIX: move the role check into a SECURITY DEFINER function. It runs as
-- the function owner and bypasses RLS internally, so policies can call it
-- without re-entering themselves.
--
-- Verify the bug first (optional): run  SELECT * FROM public.users LIMIT 1;
-- as an authenticated user — if you see the recursion error, this fixes it.
-- ============================================================================

-- 1) Role helper — SECURITY DEFINER so it reads users without invoking RLS ---
create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

-- Belt and braces: only authenticated users can call it, and it leaks nothing
-- beyond the caller's own role.
revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

create or replace function public.is_superuser()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'superuser', false);
$$;

revoke all on function public.is_superuser() from public;
grant execute on function public.is_superuser() to authenticated;

-- 2) users: replace the recursive select policy ------------------------------
drop policy if exists "users_can_view_self" on public.users;
create policy "users_can_view_self" on public.users
  for select using (auth.uid() = id or public.is_superuser());

-- 3) progress: same subquery, same fix ---------------------------------------
drop policy if exists "users_can_view_own_progress" on public.progress;
create policy "users_can_view_own_progress" on public.progress
  for select using (auth.uid() = user_id or public.is_superuser());

-- 4) quiz_results: fix the select policy AND add the missing UPDATE policy
--    (saveQuizResult upserts on user_id+quiz_id; without an UPDATE policy the
--    upsert fails the second time someone takes the same quiz).
drop policy if exists "users_can_view_own_quizzes" on public.quiz_results;
create policy "users_can_view_own_quizzes" on public.quiz_results
  for select using (auth.uid() = user_id or public.is_superuser());

drop policy if exists "users_can_update_own_quizzes" on public.quiz_results;
create policy "users_can_update_own_quizzes" on public.quiz_results
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5) announcements: admin/superuser insert check, de-recursed ----------------
drop policy if exists "only_admin_can_create_announcements" on public.announcements;
create policy "only_admin_can_create_announcements" on public.announcements
  for insert with check (public.current_user_role() in ('admin', 'superuser'));

-- 6) analytics: superuser-only select, de-recursed ---------------------------
drop policy if exists "superuser_can_view_analytics" on public.analytics;
create policy "superuser_can_view_analytics" on public.analytics
  for select using (public.is_superuser());

-- 7) consent_events: same subquery pattern from the comms migration ----------
drop policy if exists "consent_view_own" on public.consent_events;
create policy "consent_view_own" on public.consent_events
  for select using (auth.uid() = user_id or public.is_superuser());

-- 8) Sanity checks — run these after; each should return without error -------
-- select * from public.users where id = auth.uid();      -- as any signed-in user
-- select count(*) from public.progress;                   -- as any signed-in user
-- select public.current_user_role();                      -- returns your role
