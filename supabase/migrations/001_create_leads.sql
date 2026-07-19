-- Nexora AI — Phase 2: leads table
-- Run in Supabase SQL Editor or via Supabase CLI migrations.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  company text,
  budget text,
  project_description text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);

comment on table public.leads is 'Consultation requests from the Nexora AI lead capture form.';

-- Optional: enable RLS and restrict direct client access (server uses service role).
alter table public.leads enable row level security;

-- No public policies by default — inserts go through /api/leads with service role.
