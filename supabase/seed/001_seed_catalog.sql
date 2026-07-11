insert into public.categories (name, slug, image)
values
  ('Accessories', 'accessories', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80'),
  ('Outerwear', 'outerwear', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'),
  ('Footwear', 'footwear', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'),
  ('Home', 'home', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'),
  ('Essentials', 'essentials', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80');

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Aero Shell Jacket', 'aero-shell-jacket', 'Weather-ready shell with a tailored finish.', 189.00, 240.00, 24, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', true, true
from public.categories where slug = 'outerwear';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Contour Tote', 'contour-tote', 'Minimal structured tote for everyday carry.', 98.00, null, 18, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', true, true
from public.categories where slug = 'accessories';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Lumen Knit Set', 'lumen-knit-set', 'Soft knit layers designed for comfort.', 156.00, 198.00, 15, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80', true, true
from public.categories where slug = 'essentials';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Studio Loafers', 'studio-loafers', 'Polished loafers with a sculptural profile.', 132.00, null, 20, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'footwear';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Harbor Desk Lamp', 'harbor-desk-lamp', 'Warm ambient lighting in a sculpted silhouette.', 84.00, 110.00, 10, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'home';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'North Line Backpack', 'north-line-backpack', 'A streamlined everyday backpack with room to move.', 124.00, 148.00, 22, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', true, true
from public.categories where slug = 'accessories';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Pine Travel Set', 'pine-travel-set', 'Essential pieces for your weekly escapes.', 76.00, null, 14, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'essentials';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Sculpted Wool Coat', 'sculpted-wool-coat', 'Layer with confidence in a minimalist outerwear staple.', 210.00, 260.00, 12, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80', true, true
from public.categories where slug = 'outerwear';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Drift Sneakers', 'drift-sneakers', 'Everyday sneakers with lightweight comfort.', 118.00, 140.00, 25, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'footwear';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Marlow Ceramic Vase', 'marlow-ceramic-vase', 'A sculptural vase for modern interiors.', 92.00, null, 16, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'home';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Velvet Travel Case', 'velvet-travel-case', 'A compact companion for your essentials.', 68.00, null, 13, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'accessories';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Formline Cardigan', 'formline-cardigan', 'A refined staple for cooler days.', 148.00, 184.00, 17, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'essentials';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Ridge Parka', 'ridge-parka', 'A practical parka with elevated detailing.', 208.00, 248.00, 11, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80', true, true
from public.categories where slug = 'outerwear';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Dune Runner', 'dune-runner', 'Comfortable runners ready for everyday movement.', 129.00, 154.00, 21, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'footwear';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'North Ledger', 'north-ledger', 'A polished notebook for notes and planning.', 54.00, null, 9, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'home';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Halo Watch', 'halo-watch', 'A sleek timepiece crafted to stand out.', 214.00, 254.00, 8, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', true, true
from public.categories where slug = 'accessories';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Alpine Knit Pullover', 'alpine-knit-pullover', 'A cozy layer with a refined finish.', 138.00, 168.00, 12, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'essentials';

insert into public.products (category_id, title, slug, description, price, compare_price, stock, thumbnail, featured, active)
select id, 'Nordic Throw', 'nordic-throw', 'Soft texture and understated warmth for everyday comfort.', 86.00, 110.00, 10, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', false, true
from public.categories where slug = 'home';
