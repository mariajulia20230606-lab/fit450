begin;

alter table public.user_profiles enable row level security;
alter table public.treinos enable row level security;
alter table public.treino_exercicios enable row level security;
alter table public.progresso_usuario enable row level security;

drop policy if exists "Usuários podem ver apenas seu próprio perfil" on public.user_profiles;
drop policy if exists "Usuários podem ver apenas seus próprios treinos" on public.treinos;
drop policy if exists "Usuários podem ver apenas seus próprios exercícios de treino" on public.treino_exercicios;
drop policy if exists "Usuários podem ver apenas seu próprio progresso" on public.progresso_usuario;

drop policy if exists user_profiles_select on public.user_profiles;
drop policy if exists user_profiles_insert on public.user_profiles;
drop policy if exists user_profiles_update on public.user_profiles;
drop policy if exists user_profiles_delete on public.user_profiles;

drop policy if exists treinos_select on public.treinos;
drop policy if exists treinos_insert on public.treinos;
drop policy if exists treinos_update on public.treinos;
drop policy if exists treinos_delete on public.treinos;

drop policy if exists treino_exercicios_select on public.treino_exercicios;
drop policy if exists treino_exercicios_insert on public.treino_exercicios;
drop policy if exists treino_exercicios_update on public.treino_exercicios;
drop policy if exists treino_exercicios_delete on public.treino_exercicios;

drop policy if exists progresso_select on public.progresso_usuario;
drop policy if exists progresso_insert on public.progresso_usuario;
drop policy if exists progresso_update on public.progresso_usuario;
drop policy if exists progresso_delete on public.progresso_usuario;

create policy user_profiles_select on public.user_profiles
  for select using (auth.uid() = id);
create policy user_profiles_insert on public.user_profiles
  for insert with check (auth.uid() = id);
create policy user_profiles_update on public.user_profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy user_profiles_delete on public.user_profiles
  for delete using (auth.uid() = id);

create policy treinos_select on public.treinos
  for select using (auth.uid() = user_id);
create policy treinos_insert on public.treinos
  for insert with check (auth.uid() = user_id);
create policy treinos_update on public.treinos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy treinos_delete on public.treinos
  for delete using (auth.uid() = user_id);

create policy treino_exercicios_select on public.treino_exercicios
  for select using (
    exists (
      select 1
      from public.treinos t
      where t.id = treino_exercicios.treino_id
        and t.user_id = auth.uid()
    )
  );
create policy treino_exercicios_insert on public.treino_exercicios
  for insert with check (
    exists (
      select 1
      from public.treinos t
      where t.id = treino_exercicios.treino_id
        and t.user_id = auth.uid()
    )
  );
create policy treino_exercicios_update on public.treino_exercicios
  for update using (
    exists (
      select 1
      from public.treinos t
      where t.id = treino_exercicios.treino_id
        and t.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1
      from public.treinos t
      where t.id = treino_exercicios.treino_id
        and t.user_id = auth.uid()
    )
  );
create policy treino_exercicios_delete on public.treino_exercicios
  for delete using (
    exists (
      select 1
      from public.treinos t
      where t.id = treino_exercicios.treino_id
        and t.user_id = auth.uid()
    )
  );

create policy progresso_select on public.progresso_usuario
  for select using (auth.uid() = user_id);
create policy progresso_insert on public.progresso_usuario
  for insert with check (auth.uid() = user_id);
create policy progresso_update on public.progresso_usuario
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy progresso_delete on public.progresso_usuario
  for delete using (auth.uid() = user_id);

grant all on public.user_profiles to authenticated;
grant all on public.treinos to authenticated;
grant all on public.treino_exercicios to authenticated;
grant all on public.progresso_usuario to authenticated;

commit;
