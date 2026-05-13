-- Members profile table (linked to Supabase Auth)
create table if not exists ms_members (
  id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  email text not null,
  full_name text,
  phone text,
  instagram text,
  size_top text,         -- XS/S/M/L/XL/XXL
  size_bottom text,
  size_shoes text,
  style_notes text,      -- AI style profile
  membership text default 'standard' check (membership in ('standard', 'og_pending', 'og_member')),
  og_number int,         -- assigned OG number if approved
  og_approved_at timestamptz,
  og_approved_by text,
  referral_code text,    -- how they heard about us
  avatar_url text
);

alter table ms_members enable row level security;
create policy "members read own profile" on ms_members for select using (auth.uid() = id);
create policy "members update own profile" on ms_members for update using (auth.uid() = id);
create policy "members insert own profile" on ms_members for insert with check (auth.uid() = id);
create policy "admin full access members" on ms_members using (
  exists (select 1 from ms_admins where user_id = auth.uid())
);

-- Wishlist
create table if not exists ms_wishlist (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  member_id uuid references ms_members(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_price int,
  product_image text,
  product_tag text
);

alter table ms_wishlist enable row level security;
create policy "members manage own wishlist" on ms_wishlist for all using (auth.uid() = member_id);

-- Orders
create table if not exists ms_orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  member_id uuid references ms_members(id) on delete set null,
  member_email text,
  items jsonb not null default '[]',
  status text default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_cents int,
  shipping_address jsonb,
  notes text
);

alter table ms_orders enable row level security;
create policy "members read own orders" on ms_orders for select using (auth.uid() = member_id);
create policy "public insert orders" on ms_orders for insert with check (true);
create policy "admin full access orders" on ms_orders using (
  exists (select 1 from ms_admins where user_id = auth.uid())
);

-- Admins table (simple, just user IDs)
create table if not exists ms_admins (
  user_id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamptz default now()
);

alter table ms_admins enable row level security;
create policy "admin read self" on ms_admins for select using (auth.uid() = user_id);

-- Auto-create member profile on auth signup
create or replace function handle_new_member()
returns trigger language plpgsql security definer as $$
begin
  insert into ms_members (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_member();

-- Updated_at trigger
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ms_members_updated_at on ms_members;
create trigger ms_members_updated_at
  before update on ms_members
  for each row execute function set_updated_at();
