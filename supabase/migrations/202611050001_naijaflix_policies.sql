-- NaijaFlix Row Level Security policies. Review existing policies before applying.
create policy "profiles_read_self" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles_update_self" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "movies_read_published" on public.movies for select to anon, authenticated using (published = true or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "movies_admin_insert" on public.movies for insert to authenticated with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "movies_admin_update" on public.movies for update to authenticated using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "movies_admin_delete" on public.movies for delete to authenticated using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "subscriptions_read_own" on public.subscriptions for select to authenticated using (user_id = auth.uid());
create policy "watch_progress_select_own" on public.watch_progress for select to authenticated using (user_id = auth.uid());
create policy "watch_progress_insert_own" on public.watch_progress for insert to authenticated with check (user_id = auth.uid());
create policy "watch_progress_update_own" on public.watch_progress for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "watch_progress_delete_own" on public.watch_progress for delete to authenticated using (user_id = auth.uid());