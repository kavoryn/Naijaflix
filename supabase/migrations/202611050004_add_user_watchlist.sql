create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id uuid not null references public.movies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, movie_id)
);
alter table public.watchlist enable row level security;
drop policy if exists watchlist_manage_own on public.watchlist;
create policy watchlist_manage_own on public.watchlist
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create index if not exists watchlist_user_created_idx on public.watchlist(user_id, created_at desc);