-- Dioshift streaming TV signups.
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Safe to re-run: every statement checks whether its object already exists.

create extension if not exists pgcrypto; -- gen_random_uuid() (already on in most Supabase projects)

create table if not exists public.streaming_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  status text not null default 'pending_payment'
    constraint streaming_signups_status_check
    check (status in ('pending_payment', 'active', 'canceled')),

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

  -- Filled in by the Stripe Checkout step.
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_checkout_session_id text,
  paid_at timestamptz,

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

-- Row level security is ON with NO policies on purpose.
-- With no policies, the public (anon) and signed-in (authenticated) roles
-- cannot read or write a single row, even if someone gets hold of the
-- publishable key. Only the secret key, which bypasses RLS and lives only on
-- our server (SUPABASE_SECRET_KEY), can touch this table.
-- Do not add policies unless you deliberately want browser access.
alter table public.streaming_signups enable row level security;

comment on table public.streaming_signups is
  'Streaming TV signups from /signup. RLS is enabled with no policies, so only the server (secret key) can read or write.';

grant usage on schema public to service_role;
grant all on table public.streaming_signups to service_role;
notify pgrst, 'reload schema';