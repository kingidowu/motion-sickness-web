-- Product images bucket (public read, admin write only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB max
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Anyone can view product images
create policy "public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Only admins can upload/update/delete product images
create policy "admin upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from ms_admins where user_id = auth.uid())
  );

create policy "admin update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and exists (select 1 from ms_admins where user_id = auth.uid())
  );

create policy "admin delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from ms_admins where user_id = auth.uid())
  );

-- Member avatars bucket (members manage their own)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'member-avatars',
  'member-avatars',
  true,
  3145728, -- 3MB max
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "public read avatars"
  on storage.objects for select
  using (bucket_id = 'member-avatars');

create policy "members upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'member-avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "members update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'member-avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "members delete own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'member-avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Product images registry table (tracks all uploaded images with metadata)
create table if not exists ms_product_images (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  product_id text not null,       -- e.g. "cap-black", "tee-heritage"
  angle text not null,            -- "front", "back", "left", "right"
  storage_path text not null,     -- path in storage bucket
  url text,                       -- full public URL (cached)
  colorway text,                  -- e.g. "all-black", "cream-red"
  sort_order int default 0,
  uploaded_by uuid references auth.users(id)
);

alter table ms_product_images enable row level security;
create policy "public read product image registry" on ms_product_images for select using (true);
create policy "admin manage product image registry" on ms_product_images for all
  using (exists (select 1 from ms_admins where user_id = auth.uid()));
