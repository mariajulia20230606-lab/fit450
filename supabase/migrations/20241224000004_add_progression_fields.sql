BEGIN;

-- Adicionar campos de controle de progressão na tabela user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS nivel_atual_index INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS dias_no_nivel INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS ultimo_treino_data DATE;

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_nivel_atual ON user_profiles(nivel_atual_index);

COMMIT;
