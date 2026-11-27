-- 2026-11-27: private admin dashboard (/admin).
-- Run once in the Supabase SQL Editor (Dashboard > SQL Editor > New query),
-- BEFORE deploying the code that uses these tables and columns.
-- Safe to re-run: every statement checks whether its object already exists.
--
-- Every new table has row level security ON with NO policies, like
-- streaming_signups. Only the server's secret key (SUPABASE_SECRET_KEY) can
-- read or write them. Do not add policies.

create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Admins. ADMIN_BOOTSTRAP_EMAIL is always an admin and is NOT stored here.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique
    constraint admin_users_email_lowercase check (email = lower(email)),
  created_at timestamptz not null default now(),
  added_by text,
  active boolean not null default true
);

create index if not exists admin_users_created_at_idx on public.admin_users (created_at desc);

alter table public.admin_users enable row level security;
comment on table public.admin_users is
  'Dioshift admin accounts. Emails are stored lowercased. Removing an admin sets active = false. RLS on, no policies: server only.';

-- ---------------------------------------------------------------------------
-- Emailed sign-in links. Only the SHA-256 hash of each token is stored.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_login_tokens (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz
);

create index if not exists admin_login_tokens_created_at_idx on public.admin_login_tokens (created_at);

alter table public.admin_login_tokens enable row level security;
comment on table public.admin_login_tokens is
  'Admin sign-in link tokens (SHA-256 hashes only). Rows older than 24 hours are deleted when a new link is sent. RLS on, no policies: server only.';

-- ---------------------------------------------------------------------------
-- Contact form messages (also emailed, as before).
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  business_name text not null,
  email text not null,
  phone text,
  message text not null,
  read_at timestamptz,
  archived boolean not null default false
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
-- The unread badge counts unread inbox messages on every admin page.
create index if not exists contact_messages_unread_idx
  on public.contact_messages (created_at desc) where read_at is null and archived = false;

alter table public.contact_messages enable row level security;
comment on table public.contact_messages is
  'Messages from the /contact form. RLS on, no policies: server only.';

-- ---------------------------------------------------------------------------
-- Internal notes on a client (signup).
-- ---------------------------------------------------------------------------
create table if not exists public.signup_notes (
  id uuid primary key default gen_random_uuid(),
  signup_id uuid not null references public.streaming_signups (id) on delete cascade,
  author_email text,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists signup_notes_signup_id_idx on public.signup_notes (signup_id);
create index if not exists signup_notes_created_at_idx on public.signup_notes (created_at desc);

alter table public.signup_notes enable row level security;
comment on table public.signup_notes is
  'Internal admin notes on a client. RLS on, no policies: server only.';

-- ---------------------------------------------------------------------------
-- Activity log for a client (signup).
-- ---------------------------------------------------------------------------
create table if not exists public.signup_activity (
  id uuid primary key default gen_random_uuid(),
  signup_id uuid not null references public.streaming_signups (id) on delete cascade,
  actor text not null, -- an admin email, 'system' or 'stripe'
  action text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists signup_activity_signup_id_idx on public.signup_activity (signup_id);
create index if not exists signup_activity_created_at_idx on public.signup_activity (created_at desc);

alter table public.signup_activity enable row level security;
comment on table public.signup_activity is
  'What happened to a client and who did it. RLS on, no policies: server only.';

-- ---------------------------------------------------------------------------
-- Campaign tracking on streaming_signups.
-- ---------------------------------------------------------------------------
alter table public.streaming_signups
  add column if not exists campaign_status text not null default 'not_started';
alter table public.streaming_signups
  drop constraint if exists streaming_signups_campaign_status_check;
alter table public.streaming_signups
  add constraint streaming_signups_campaign_status_check
  check (campaign_status in ('not_started', 'waiting_on_creative', 'ready', 'live', 'paused', 'ended'));

alter table public.streaming_signups add column if not exists launched_at timestamptz;
alter table public.streaming_signups add column if not exists cancel_requested_at timestamptz;
alter table public.streaming_signups add column if not exists cancel_effective_at timestamptz;

-- ---------------------------------------------------------------------------
-- Access for the server's secret key.
-- ---------------------------------------------------------------------------
grant usage on schema public to service_role;
grant all on table public.admin_users to service_role;
grant all on table public.admin_login_tokens to service_role;
grant all on table public.contact_messages to service_role;
grant all on table public.signup_notes to service_role;
grant all on table public.signup_activity to service_role;

notify pgrst, 'reload schema';
