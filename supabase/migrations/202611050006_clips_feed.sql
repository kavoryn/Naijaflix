create table if not exists public.clips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  video_url text not null,
  poster_url text,
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.clips enable row level security;
drop policy if exists clips_read_published on public.clips;
create policy clips_read_published on public.clips
for select to anon, authenticated using (published = true);
drop policy if exists clips_admin_manage on public.clips;
create policy clips_admin_manage on public.clips
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
grant select on public.clips to anon, authenticated;
create index if not exists clips_published_created_idx on public.clips(published, created_at desc);