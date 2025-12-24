BEGIN;

-- Alterar user_profiles para usar data_nascimento em vez de idade
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS data_nascimento DATE;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS idade;

-- Garantir que peso e altura existam e tenham os tipos corretos
-- (Já existem na criação, mas reforçando ou ajustando se necessário)
-- peso DECIMAL(5,2)
-- altura DECIMAL(3,2)

-- Alterar progresso_usuario para incluir altura na evolução
ALTER TABLE progresso_usuario ADD COLUMN IF NOT EXISTS altura DECIMAL(3,2);

COMMIT;
