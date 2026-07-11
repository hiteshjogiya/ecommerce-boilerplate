create extension if not exists "uuid-ossp";

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  image text,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references public.categories(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text not null,
  price numeric(10,2) not null default 0,
  compare_price numeric(10,2),
  stock integer not null default 0,
  thumbnail text,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_featured on public.products(featured);
create index if not exists idx_products_active on public.products(active);
