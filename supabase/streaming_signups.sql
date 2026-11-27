-- Dioshift streaming TV signups.
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Safe to re-run: every statement checks whether its object already exists.

create extension if not exists pgcrypto; -- gen_random_uuid() (already on in most Supabase projects)

create table if not exists public.streaming_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- past_due: a renewal payment failed and the campaign is paused until it's paid.
  status text not null default 'pending_payment'
    constraint streaming_signups_status_check
    check (status in ('pending_payment', 'active', 'past_due', 'canceled')),

  -- Package. Computed on the server from lib/packages.ts, never taken from the browser.
  package_id text not null,
  impressions integer not null,
  monthly_price_cents integer not null,
  cpm_cents integer not null,

  -- Business
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  website text,
  business_category text not null,
  business_city text not null,
  business_state text not null,
  business_zip text not null,

  -- Targeting
  service_area_type text not null
    constraint streaming_signups_service_area_type_check
    check (service_area_type in ('radius', 'zip_codes', 'cities', 'counties')),
  service_area_details text not null,
  radius_miles integer,
  target_age_ranges text[] not null,
  target_gender text not null
    constraint streaming_signups_target_gender_check
    check (target_gender in ('all', 'male', 'female')),
  target_household_income text,
  target_interests text,
  preferred_start text not null, -- 'asap' or an ISO date (YYYY-MM-DD)

  -- Commercial
  creative_status text not null
    constraint streaming_signups_creative_status_check
    check (creative_status in ('have', 'need')),
  creative_link text,
  creative_specs_confirmed boolean not null default false,
  creative_notes text,
  additional_notes text,

  terms_accepted_at timestamptz not null,
  -- TERMS_VERSION from lib/legal.ts at signup. Nullable for rows older than this column.
  terms_version text,

  -- Filled in by the Stripe Checkout step.
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_checkout_session_id text,
  paid_at timestamptz,
  -- Set by the webhook when a renewal payment fails.
  last_payment_failed_at timestamptz,

  -- Campaign tracking, set from the admin dashboard (/admin).
  campaign_status text not null default 'not_started'
    constraint streaming_signups_campaign_status_check
    check (campaign_status in ('not_started', 'waiting_on_creative', 'ready', 'live', 'paused', 'ended')),
  launched_at timestamptz,
  cancel_requested_at timestamptz,
  cancel_effective_at timestamptz,

  constraint streaming_signups_creative_link_required
    check (creative_status <> 'have' or creative_link is not null)
);

-- Keep updated_at current on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists streaming_signups_set_updated_at on public.streaming_signups;
create trigger streaming_signups_set_updated_at
  before update on public.streaming_signups
  for each row
  execute function public.set_updated_at();

create index if not exists streaming_signups_email_idx on public.streaming_signups (email);
create index if not exists streaming_signups_status_idx on public.streaming_signups (status);
create index if not exists streaming_signups_created_at_idx on public.streaming_signups (created_at desc);
create index if not exists streaming_signups_stripe_subscription_id_idx on public.streaming_signups (stripe_subscription_id);

-- Upgrades for a table created before 2026-11-25 (no-ops on a fresh install).
-- Same as supabase/2026-11-25_terms_and_past_due.sql.
alter table public.streaming_signups add column if not exists terms_version text;
alter table public.streaming_signups add column if not exists last_payment_failed_at timestamptz;
alter table public.streaming_signups drop constraint if exists streaming_signups_status_check;
alter table public.streaming_signups
  add constraint streaming_signups_status_check
  check (status in ('pending_payment', 'active', 'past_due', 'canceled'));

-- Upgrades for a table created before 2026-11-27 (no-ops on a fresh install).
-- Same columns as supabase/2026-11-27_admin.sql.
alter table public.streaming_signups
  add column if not exists campaign_status text not null default 'not_started';
alter table public.streaming_signups drop constraint if exists streaming_signups_campaign_status_check;
alter table public.streaming_signups
  add constraint streaming_signups_campaign_status_check
  check (campaign_status in ('not_started', 'waiting_on_creative', 'ready', 'live', 'paused', 'ended'));
alter table public.streaming_signups add column if not exists launched_at timestamptz;
alter table public.streaming_signups add column if not exists cancel_requested_at timestamptz;
alter table public.streaming_signups add column if not exists cancel_effective_at timestamptz;

-- Row level security is ON with NO policies on purpose.
-- With no policies, the public (anon) and signed-in (authenticated) roles
-- cannot read or write a single row, even if someone gets hold of the
-- publishable key. Only the secret key, which bypasses RLS and lives only on
-- our server (SUPABASE_SECRET_KEY), can touch this table.
-- Do not add policies unless you deliberately want browser access.
alter table public.streaming_signups enable row level security;

comment on table public.streaming_signups is
  'Streaming TV signups from /signup. RLS is enabled with no policies, so only the server (secret key) can read or write.';

-- ===========================================================================
-- Admin dashboard tables (same as supabase/2026-11-27_admin.sql).
-- ===========================================================================

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

grant usage on schema public to service_role;
grant all on table public.streaming_signups to service_role;
grant all on table public.admin_users to service_role;
grant all on table public.admin_login_tokens to service_role;
grant all on table public.contact_messages to service_role;
grant all on table public.signup_notes to service_role;
grant all on table public.signup_activity to service_role;
notify pgrst, 'reload schema';
