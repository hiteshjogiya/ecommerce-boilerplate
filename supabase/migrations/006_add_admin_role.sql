-- Add admin role field to user_profiles
alter table if exists public.user_profiles 
  add column if not exists role text default 'user' not null;

-- Create index for role lookups
create index if not exists idx_user_profiles_role on public.user_profiles (role);

-- Create admin-only RLS policy for admin tables
create policy "Admins can perform all admin operations"
  on public.products
  for all
  using (
    (select role from public.user_profiles where user_id = auth.uid()) = 'admin'
    or auth.uid() is null
  )
  with check (
    (select role from public.user_profiles where user_id = auth.uid()) = 'admin'
  );

create policy "Admins can view all orders"
  on public.orders
  for select
  using (
    (select role from public.user_profiles where user_id = auth.uid()) = 'admin'
    or auth.uid()::text = user_id::text
  );

create policy "Admins can update order status"
  on public.orders
  for update
  using (
    (select role from public.user_profiles where user_id = auth.uid()) = 'admin'
  )
  with check (
    (select role from public.user_profiles where user_id = auth.uid()) = 'admin'
  );

-- Seed one admin user (replace with real admin email/ID after first setup)
-- Uncomment and use after initial admin user is created
-- update public.user_profiles set role = 'admin' where email = 'admin@example.com';
