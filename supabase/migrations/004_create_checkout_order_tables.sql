create extension if not exists pgcrypto;

create type public.order_status as enum ('Pending', 'Confirmed', 'Cancelled', 'Delivered');
create type public.payment_status as enum ('Pending', 'Paid', 'Failed', 'Refunded');

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  country text not null,
  postal_code text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid not null references auth.users (id) on delete cascade,
  shipping_address_id uuid references public.addresses (id) on delete set null,
  shipping_address jsonb not null,
  subtotal numeric(10, 2) not null default 0,
  shipping_cost numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  shipping_method text not null,
  status public.order_status not null default 'Pending',
  payment_status public.payment_status not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null default 0,
  total_price numeric(10, 2) not null default 0
);

create index if not exists idx_addresses_user_id on public.addresses (user_id);
create index if not exists idx_addresses_default on public.addresses (user_id, is_default);
create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_orders_order_number on public.orders (order_number);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_product_id on public.order_items (product_id);

alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Users can read their own addresses"
  on public.addresses
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own addresses"
  on public.addresses
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own addresses"
  on public.addresses
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own addresses"
  on public.addresses
  for delete
  using (auth.uid() = user_id);

create policy "Users can read their own orders"
  on public.orders
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own orders"
  on public.orders
  for insert
  with check (auth.uid() = user_id);

create policy "Users can read their own order items"
  on public.order_items
  for select
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_addresses_updated_at
before update on public.addresses
for each row
execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create or replace function public.place_order(
  p_address_id uuid,
  p_shipping_method text,
  p_shipping_cost numeric,
  p_tax numeric,
  p_discount numeric default 0
)
returns table(order_id uuid, order_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(10, 2);
  v_total numeric(10, 2);
  v_address public.addresses%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required.';
  end if;

  select *
  into v_address
  from public.addresses
  where id = p_address_id
    and user_id = v_user_id;

  if not found then
    raise exception 'Invalid shipping address.';
  end if;

  if not exists (
    select 1
    from public.cart_items ci
    where ci.user_id = v_user_id
  ) then
    raise exception 'Your cart is empty.';
  end if;

  if exists (
    select 1
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    where ci.user_id = v_user_id
      and (p.active = false or p.stock < ci.quantity)
  ) then
    raise exception 'One or more cart items are out of stock.';
  end if;

  select coalesce(sum(ci.quantity * p.price), 0)
  into v_subtotal
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.user_id = v_user_id;

  v_total := v_subtotal + coalesce(p_shipping_cost, 0) + coalesce(p_tax, 0) - coalesce(p_discount, 0);
  v_order_number := 'NS-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.orders (
    order_number,
    user_id,
    shipping_address_id,
    shipping_address,
    subtotal,
    shipping_cost,
    tax,
    discount,
    total,
    shipping_method,
    status,
    payment_status
  )
  values (
    v_order_number,
    v_user_id,
    p_address_id,
    jsonb_build_object(
      'full_name', v_address.full_name,
      'phone', v_address.phone,
      'email', v_address.email,
      'address_line_1', v_address.address_line_1,
      'address_line_2', v_address.address_line_2,
      'city', v_address.city,
      'state', v_address.state,
      'country', v_address.country,
      'postal_code', v_address.postal_code
    ),
    v_subtotal,
    coalesce(p_shipping_cost, 0),
    coalesce(p_tax, 0),
    coalesce(p_discount, 0),
    v_total,
    p_shipping_method,
    'Pending',
    'Pending'
  )
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, quantity, unit_price, total_price)
  select
    v_order_id,
    ci.product_id,
    ci.quantity,
    p.price,
    (ci.quantity * p.price)
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.user_id = v_user_id;

  update public.products p
  set stock = greatest(0, p.stock - ci.quantity),
      updated_at = now()
  from public.cart_items ci
  where ci.user_id = v_user_id
    and ci.product_id = p.id;

  delete from public.cart_items where user_id = v_user_id;

  return query select v_order_id, v_order_number;
end;
$$;

grant execute on function public.place_order(uuid, text, numeric, numeric, numeric) to authenticated;
