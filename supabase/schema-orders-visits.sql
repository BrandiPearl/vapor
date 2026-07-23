-- Orders + site visit logging
-- Run in Supabase SQL Editor

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'submitted',
  email text not null,
  phone text not null,
  customer jsonb not null default '{}'::jsonb,
  billing jsonb not null default '{}'::jsonb,
  shipping jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10, 2) not null default 0,
  shipping_price numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  shipping_method text,
  payment_preference text,
  coupon text,
  notes text,
  whatsapp_message text
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_email_idx on public.orders (email);

create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  path text,
  referrer text,
  user_agent text,
  notified boolean not null default false
);

create index if not exists site_visits_created_at_idx on public.site_visits (created_at desc);
create index if not exists site_visits_session_idx on public.site_visits (session_id, created_at desc);

alter table public.orders enable row level security;
alter table public.site_visits enable row level security;

-- No public policies: writes/reads go through service role (API routes).
