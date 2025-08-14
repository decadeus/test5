-- Minimal community schema for discussions (posts, answers, votes, reports)

alter table if exists public.profiles
  add column if not exists is_promoter boolean default false,
  add column if not exists is_verified_promoter boolean default false,
  add column if not exists organization_name text,
  add column if not exists is_moderator boolean default false;

create table if not exists public.post (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.project(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('question','advice','site_update','ama')),
  title text not null,
  body text,
  accepted_answer_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.answer (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.post(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  is_accepted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.post
  add constraint post_accepted_answer_fk
  foreign key (accepted_answer_id) references public.answer(id) on delete set null;

create table if not exists public.vote (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('post','answer')),
  target_id uuid not null,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz default now(),
  unique (user_id, target_type, target_id)
);

create table if not exists public.report (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_type text not null check (target_type in ('post','answer')),
  target_id uuid not null,
  reason text,
  created_at timestamptz default now(),
  status text default 'open' check (status in ('open','reviewing','resolved','rejected'))
);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_post_touch on public.post;
create trigger trg_post_touch before update on public.post
for each row execute function public.touch_updated_at();

drop trigger if exists trg_answer_touch on public.answer;
create trigger trg_answer_touch before update on public.answer
for each row execute function public.touch_updated_at();

alter table public.post enable row level security;
alter table public.answer enable row level security;
alter table public.vote enable row level security;
alter table public.report enable row level security;

create policy if not exists post_read_all on public.post for select using (true);
create policy if not exists answer_read_all on public.answer for select using (true);
create policy if not exists vote_read_all on public.vote for select using (true);
create policy if not exists report_read_mods on public.report for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
);

create policy if not exists post_insert_auth on public.post for insert with check (auth.uid() = author_id);
create policy if not exists answer_insert_auth on public.answer for insert with check (auth.uid() = author_id);
create policy if not exists vote_insert_auth on public.vote for insert with check (auth.uid() = user_id);
create policy if not exists report_insert_auth on public.report for insert with check (auth.uid() = reporter_id);

create policy if not exists post_update_author_mod on public.post for update using (
  auth.uid() = author_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
) with check (true);
create policy if not exists post_delete_author_mod on public.post for delete using (
  auth.uid() = author_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
);

create policy if not exists answer_update_author_mod on public.answer for update using (
  auth.uid() = author_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
) with check (true);
create policy if not exists answer_delete_author_mod on public.answer for delete using (
  auth.uid() = author_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
);

create policy if not exists vote_upsert_owner on public.vote for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists vote_delete_owner on public.vote for delete using (auth.uid() = user_id);

create policy if not exists report_update_mod on public.report for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
) with check (true);

create index if not exists idx_post_project_created_at on public.post(project_id, created_at desc);
create index if not exists idx_answer_post_created_at on public.answer(post_id, created_at desc);
create index if not exists idx_vote_target on public.vote(target_type, target_id);


