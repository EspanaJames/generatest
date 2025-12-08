-- adminUsers table
create table if not exists adminUsers (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  first_name text not null,
  last_name text not null,
  created_at timestamp with time zone default now()
);

-- subjects table
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  subject_name text not null,
  subject_code text not null unique,
  created_by text not null references adminUsers(username) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table adminUsers enable row level security;
alter table subjects enable row level security;

-- Policies for adminUsers
create policy "Allow select on adminUsers"
on adminUsers
for select
to public
using (true);

create policy "Allow insert/update/delete on adminUsers"
on adminUsers
for all
to public
using (true)
with check (true);

create policy "Allow select on subjects"
on subjects
for select
to public
using (true);

create policy "Allow insert/update/delete on subjects"
on subjects
for all
to public
using (true)
with check (true);

-- Seed some users (store actual hashes, not plaintext)
insert into adminUsers (username, password_hash, first_name, last_name) 
values 
  ('victorjohn', 'vj123', 'Victor', 'John Anunciado'),
  ('james', 'james123', 'James', 'España');

insert into subjects (subject_name, subject_code, created_by)
values
  ('Mathematics', 'MATH101', 'james'),
  ('Physics', 'PHYS101', 'james'),
  ('Chemistry', 'CHEM101', 'james'),
  ('English', 'ENG101', 'james'),
  ('English2', 'ENG102', 'victorjohn'),
  ('Computer Science', 'CS101', 'james');