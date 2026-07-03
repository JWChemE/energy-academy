-- ============================================================================
-- Energy Academy — lead-magnet email capture
-- Run this once in the Supabase SQL editor. Safe to re-run.
--
-- Stores newsletter sign-ups from lead-magnet downloads (people who are NOT
-- necessarily account holders). Consent model: the form is an explicit
-- newsletter subscription that delivers the resource — one clear, specific
-- purpose, recorded with source and timestamp (UK GDPR/PECR).
-- ============================================================================

create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  source text not null,               -- which lead magnet / form, e.g. 'energy-audit-checklist'
  consented boolean not null default true,
  consent_text text,                  -- the exact wording agreed to, for the audit trail
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz         -- set instead of deleting, to honour "don't contact again"
);

alter table public.leads enable row level security;

-- Inserts come from the server-side /api/leads route using the anon key.
-- Nobody can SELECT with the anon/authenticated keys — reading the list is a
-- service-role (dashboard / future ESP export) operation only.
drop policy if exists "anyone_can_subscribe" on public.leads;
create policy "anyone_can_subscribe" on public.leads
  for insert to anon, authenticated
  with check (true);

create index if not exists idx_leads_created_at on public.leads(created_at);
