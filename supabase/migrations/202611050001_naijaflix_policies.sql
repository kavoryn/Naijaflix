-- Existing Supabase project already has RLS policies on all NaijaFlix tables.
-- Prevent users from changing their own profile role.
create or replace function public.prevent_profile_role_escalation()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and not exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') then
    raise exception 'Only an administrator can change profile roles';
  end if;
  return new;
end;
$$;
drop trigger if exists prevent_profile_role_escalation on public.profiles;
create trigger prevent_profile_role_escalation
before update on public.profiles
for each row execute function public.prevent_profile_role_escalation();

-- These functions are called internally by triggers, not through the public Data API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Cover foreign keys used by admin and watch-history lookups.
create index if not exists movies_created_by_idx on public.movies (created_by);
create index if not exists watch_progress_movie_id_idx on public.watch_progress (movie_id);
