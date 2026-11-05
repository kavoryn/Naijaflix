-- Existing Supabase project already has RLS policies on all NaijaFlix tables.
-- This migration adds protection against users changing their own profile role.
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
