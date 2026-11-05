create table if not exists public.movie_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id uuid not null references public.movies(id) on delete cascade,
  rating text not null check (rating in ('not_for_me', 'like', 'love')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, movie_id)
);
alter table public.movie_ratings enable row level security;
drop policy if exists movie_ratings_read_own on public.movie_ratings;
create policy movie_ratings_read_own on public.movie_ratings
for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists movie_ratings_insert_own on public.movie_ratings;
create policy movie_ratings_insert_own on public.movie_ratings
for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists movie_ratings_update_own on public.movie_ratings;
create policy movie_ratings_update_own on public.movie_ratings
for update to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
