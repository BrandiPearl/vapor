-- Editable storefront settings (minimum order, shipping, contact, banner)
-- Run in Supabase SQL Editor

create table if not exists public.site_settings (
  id text primary key default 'default',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 'default')
);

insert into public.site_settings (id, data)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- The storefront reads these with the anon key on every request; the admin
-- writes through the service role, which bypasses RLS.
drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read
  on public.site_settings
  for select
  using (true);
