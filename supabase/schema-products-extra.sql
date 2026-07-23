-- Optional: run after initial schema if you want first-class columns
-- (import works without this — extras go in metadata jsonb)

alter table public.products
  add column if not exists sku text,
  add column if not exists short_description text,
  add column if not exists source_url text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists source_images text[] not null default '{}',
  add column if not exists image_urls text[] not null default '{}',
  add column if not exists variations jsonb not null default '[]'::jsonb;

create index if not exists products_tags_gin on public.products using gin (tags);
