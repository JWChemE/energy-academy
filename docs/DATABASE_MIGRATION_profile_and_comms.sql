-- ============================================================================
-- Energy Academy — profile, communications & consent migration
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE).
-- ============================================================================

-- 1) Profile + marketing columns on the users table -------------------------
alter table public.users
  add column if not exists industry text,
  add column if not exists job_role text,
  add column if not exists interests jsonb not null default '[]'::jsonb,
  add column if not exists comms_updates    boolean not null default false,
  add column if not exists comms_newsletter boolean not null default false,
  add column if not exists comms_consulting boolean not null default false,
  add column if not exists comms_events     boolean not null default false,
  add column if not exists marketing_consent_at timestamptz;

-- 2) Consent audit log — proves what each user consented to, and when --------
create table if not exists public.consent_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  channel text not null,              -- updates | newsletter | consulting | events
  granted boolean not null,           -- true = opted in, false = withdrawn
  source  text,                       -- signup | profile
  created_at timestamptz not null default now()
);
alter table public.consent_events enable row level security;

drop policy if exists "consent_view_own" on public.consent_events;
create policy "consent_view_own" on public.consent_events
  for select using (
    auth.uid() = user_id
    or (select role from public.users where id = auth.uid()) = 'superuser'
  );

-- 3) Create the public.users row automatically on signup --------------------
--    Robust: doesn't depend on a client-side insert succeeding, and reliably
--    captures the full name and any consent given at signup (from auth metadata).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updates boolean := coalesce((new.raw_user_meta_data->>'comms_updates')::boolean, false);
  v_news    boolean := coalesce((new.raw_user_meta_data->>'comms_newsletter')::boolean, false);
  v_cons    boolean := coalesce((new.raw_user_meta_data->>'comms_consulting')::boolean, false);
  v_events  boolean := coalesce((new.raw_user_meta_data->>'comms_events')::boolean, false);
begin
  insert into public.users (id, email, full_name,
    comms_updates, comms_newsletter, comms_consulting, comms_events, marketing_consent_at)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    v_updates, v_news, v_cons, v_events,
    case when v_updates or v_news or v_cons or v_events then now() else null end
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, public.users.full_name),
    email = excluded.email;

  if v_updates then insert into public.consent_events(user_id, channel, granted, source) values (new.id, 'updates', true, 'signup'); end if;
  if v_news    then insert into public.consent_events(user_id, channel, granted, source) values (new.id, 'newsletter', true, 'signup'); end if;
  if v_cons    then insert into public.consent_events(user_id, channel, granted, source) values (new.id, 'consulting', true, 'signup'); end if;
  if v_events  then insert into public.consent_events(user_id, channel, granted, source) values (new.id, 'events', true, 'signup'); end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) Update own profile — ONLY safe fields (never role/subscription) ---------
create or replace function public.update_my_profile(
  p_full_name text, p_industry text, p_job_role text, p_interests jsonb
) returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  update public.users set
    full_name = nullif(p_full_name, ''),
    industry  = nullif(p_industry, ''),
    job_role  = nullif(p_job_role, ''),
    interests = coalesce(p_interests, '[]'::jsonb),
    updated_at = now()
  where id = auth.uid();
end;
$$;

-- 5) Update own communication preferences (+ write the consent audit log) ----
create or replace function public.update_my_comms(
  p_updates boolean, p_newsletter boolean, p_consulting boolean, p_events boolean, p_source text
) returns void
language plpgsql security definer set search_path = public
as $$
declare cur record;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select comms_updates, comms_newsletter, comms_consulting, comms_events
    into cur from public.users where id = auth.uid();

  if p_updates    is distinct from cur.comms_updates    then insert into public.consent_events(user_id,channel,granted,source) values (auth.uid(),'updates',p_updates,coalesce(p_source,'profile')); end if;
  if p_newsletter is distinct from cur.comms_newsletter then insert into public.consent_events(user_id,channel,granted,source) values (auth.uid(),'newsletter',p_newsletter,coalesce(p_source,'profile')); end if;
  if p_consulting is distinct from cur.comms_consulting then insert into public.consent_events(user_id,channel,granted,source) values (auth.uid(),'consulting',p_consulting,coalesce(p_source,'profile')); end if;
  if p_events     is distinct from cur.comms_events     then insert into public.consent_events(user_id,channel,granted,source) values (auth.uid(),'events',p_events,coalesce(p_source,'profile')); end if;

  update public.users set
    comms_updates = p_updates,
    comms_newsletter = p_newsletter,
    comms_consulting = p_consulting,
    comms_events = p_events,
    marketing_consent_at = case
      when (p_updates or p_newsletter or p_consulting or p_events) then now()
      else marketing_consent_at end,
    updated_at = now()
  where id = auth.uid();
end;
$$;

-- 6) Reset own progress (one course, or all) — also clears quiz results ------
create or replace function public.reset_my_progress(p_course_slug text default null)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  delete from public.progress      where user_id = auth.uid() and (p_course_slug is null or course_slug = p_course_slug);
  delete from public.quiz_results  where user_id = auth.uid() and (p_course_slug is null or course_slug = p_course_slug);
end;
$$;

-- 7) Grants -----------------------------------------------------------------
grant execute on function public.update_my_profile(text,text,text,jsonb) to authenticated;
grant execute on function public.update_my_comms(boolean,boolean,boolean,boolean,text) to authenticated;
grant execute on function public.reset_my_progress(text) to authenticated;

-- Account deletion is handled by the /api/account/delete route using the
-- service-role key (it calls auth.admin.deleteUser, which cascades through the
-- foreign keys above and removes the user's progress, quizzes and consent log).
