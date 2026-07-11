-- =============================================
-- Phase 12: Reviews, Coupons, Notifications
-- =============================================

-- Reviews table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  body text,
  helpful_votes integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (user_id, product_id)
);

create index if not exists idx_reviews_product_id on public.reviews (product_id);
create index if not exists idx_reviews_user_id on public.reviews (user_id);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Verified purchasers can create reviews"
  on public.reviews for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where o.user_id = auth.uid()
        and oi.product_id = reviews.product_id
    )
  );

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- Coupons table
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10, 2) not null check (discount_value > 0),
  minimum_order_value numeric(10, 2) default 0,
  max_uses integer,
  used_count integer default 0,
  expires_at timestamptz,
  active boolean default true not null,
  created_at timestamptz default now() not null
);

alter table public.coupons enable row level security;

create policy "Coupons are viewable by authenticated users"
  on public.coupons for select
  using (auth.uid() is not null);

-- Coupon usages table
create table if not exists public.coupon_usages (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  used_at timestamptz default now() not null,
  unique (coupon_id, user_id)
);

create index if not exists idx_coupon_usages_coupon_id on public.coupon_usages (coupon_id);
create index if not exists idx_coupon_usages_user_id on public.coupon_usages (user_id);

alter table public.coupon_usages enable row level security;

create policy "Users can view own coupon usages"
  on public.coupon_usages for select
  using (auth.uid() = user_id);

create policy "Authenticated users can insert coupon usages"
  on public.coupon_usages for insert
  with check (auth.uid() = user_id);

-- Stock notifications table
create table if not exists public.stock_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  notified boolean default false not null,
  created_at timestamptz default now() not null,
  unique (user_id, product_id)
);

create index if not exists idx_stock_notifications_product_id on public.stock_notifications (product_id);

alter table public.stock_notifications enable row level security;

create policy "Users can view own stock notifications"
  on public.stock_notifications for select
  using (auth.uid() = user_id);

create policy "Authenticated users can create stock notifications"
  on public.stock_notifications for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own stock notifications"
  on public.stock_notifications for delete
  using (auth.uid() = user_id);
