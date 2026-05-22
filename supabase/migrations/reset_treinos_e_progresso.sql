begin;

truncate table public.treinos, public.treino_exercicios restart identity;

update public.user_profiles
set
  dias_no_nivel = 0,
  ultimo_treino_data = null;

commit;
