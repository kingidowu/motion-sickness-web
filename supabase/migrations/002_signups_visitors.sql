-- Signup table (popup + follow program)
create table if not exists ms_signups (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  instagram text,
  source text default 'popup_signup'
);

alter table ms_signups enable row level security;
create policy "public insert signups" on ms_signups for insert to anon with check (true);
create policy "admin read signups" on ms_signups for select using (false);

-- Visitor tracking table
create table if not exists ms_visitors (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  page text,
  referrer text,
  user_agent text
);

alter table ms_visitors enable row level security;
create policy "public insert visitors" on ms_visitors for insert to anon with check (true);
create policy "admin read visitors" on ms_visitors for select using (false);
