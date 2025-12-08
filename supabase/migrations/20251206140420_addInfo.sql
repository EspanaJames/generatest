-- adminUsers table
create table if not exists adminusers (  
  id uuid primary key references auth.users(id) on delete cascade, 
  username text unique not null,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  gender text,
  created_at timestamp with time zone default now()
);

alter table adminusers enable row level security;

create policy "Users can insert themselves" 
on adminUsers
for insert
with check (auth.uid() = id);

create policy "Users can select themselves"
on adminUsers
for select
using (auth.uid() = id);

create policy "Users can update themselves"
on adminUsers
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can delete themselves"
on adminUsers
for delete
using (auth.uid() = id);


create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  subject_name text not null,
  subject_code text not null unique,
  created_by uuid not null references adminUsers(id) on delete cascade,
  created_at timestamp with time zone default now()
);

alter table subjects enable row level security;
  
create policy "Users can insert their own subjects"
on subjects
for insert
with check (created_by = auth.uid());

create policy "Users can select their own subjects"
on subjects
for select
using (created_by = auth.uid());

create policy "Users can update their own subjects"
on subjects
for update
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy "Users can delete their own subjects"
on subjects
for delete
using (created_by = auth.uid());
create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  exam_id text unique not null,     
  subject_code text not null,
  subject_name text not null,
  exam_name text not null,
  created_by uuid not null references adminUsers(id) on delete cascade,
  num_items int not null,
  created_at timestamp with time zone default now()
);
alter table exams enable row level security;


create policy "Users can insert their own exams"
on exams
for insert
with check (created_by = auth.uid());

create policy "Users can select their own exams"
on exams
for select
using (created_by = auth.uid());

create policy "Users can update their own exams"
on exams
for update
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy "Users can delete their own exams"
on exams
for delete
using (created_by = auth.uid());


create table if not exists subject_books (
    id uuid primary key default gen_random_uuid(),
    subject_code text not null,
    subject_name text not null,
    title text not null,            -- NEW: note title
    created_by uuid not null references adminusers(id) on delete cascade,
    pdf text not null,
    created_at timestamp with time zone default now()
);

alter table subject_books enable row level security;

create policy "Users can insert their own subject books"
on subject_books
for insert
with check (created_by = auth.uid());

create policy "Users can select their own subject books"
on subject_books
for select
using (created_by = auth.uid());

create policy "Users can update their own subject books"
on subject_books
for update
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy "Users can delete their own subject books"
on subject_books
for delete
using (created_by = auth.uid());