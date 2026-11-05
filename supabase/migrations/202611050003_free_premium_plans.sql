alter table public.movies
  add column if not exists plan text not null default 'free';

alter table public.movies
  drop constraint if exists movies_plan_check;

alter table public.movies
  add constraint movies_plan_check check (plan in ('free', 'premium'));

create index if not exists movies_published_plan_idx
  on public.movies (published, plan);

create index if not exists subscriptions_user_status_ends_idx
  on public.subscriptions (user_id, status, ends_at);
