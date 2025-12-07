create table if not exists adminUsers (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  first_name text not null,
  last_name text not null,
  created_at timestamp with time zone default now()
);
alter table adminUsers enable row level security;
create policy "Allow read for all users"
on adminUsers
for select
to public
using (true);
insert into adminUsers (username, password_hash, first_name, last_name) 
values 
  ('victorJohnAnunciado', 'sirVJ123', 'Victor', 'John Anunciado'),
  ('james', 'james123', 'James', 'España');