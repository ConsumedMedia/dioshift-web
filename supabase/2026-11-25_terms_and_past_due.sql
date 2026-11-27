-- 2026-11-25: terms version tracking and the failed payment (past_due) flow.
-- Run once in the Supabase SQL Editor (Dashboard > SQL Editor > New query),
-- BEFORE deploying the code that uses these columns.
-- Safe to re-run.

-- Which version of the Terms (lib/legal.ts TERMS_VERSION) each client accepted.
-- Nullable: rows from before this change have no recorded version.
alter table public.streaming_signups
  add column if not exists terms_version text;

-- When the most recent renewal payment failed. Set by the Stripe webhook.
alter table public.streaming_signups
  add column if not exists last_payment_failed_at timestamptz;

-- Allow the new 'past_due' status (renewal failed, campaign paused).
alter table public.streaming_signups
  drop constraint if exists streaming_signups_status_check;
alter table public.streaming_signups
  add constraint streaming_signups_status_check
  check (status in ('pending_payment', 'active', 'past_due', 'canceled'));

-- The webhook looks rows up by subscription on every invoice event.
create index if not exists streaming_signups_stripe_subscription_id_idx
  on public.streaming_signups (stripe_subscription_id);

notify pgrst, 'reload schema';
