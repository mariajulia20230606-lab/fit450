# Sistema 5BX - Tabelas do FIT450

-- Tabela de usuários (estendendo a auth do Supabase)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nome TEXT,
  idade INTEGER,
  peso DECIMAL(5,2),
  altura DECIMAL(3,2),
  nivel_fitness TEXT DEFAULT 'iniciante' CHECK (nivel_fitness IN ('iniciante', 'intermediario', 'avancado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de exercícios 5BX
CREATE TABLE IF NOT EXISTS exercicios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL CHECK (categoria IN ('aquecimento', 'forca', 'cardio')),
  ordem INTEGER NOT NULL,
  instrucoes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de níveis de dificuldade
CREATE TABLE IF NOT EXISTS niveis (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  nivel_numero INTEGER NOT NULL,
  min_repeticoes INTEGER NOT NULL,
  max_repeticoes INTEGER NOT NULL,
  tempo_segundos INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de treinos realizados
CREATE TABLE IF NOT EXISTS treinos (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_treino DATE NOT NULL,
  nivel_id INTEGER REFERENCES niveis(id),
  tempo_total_segundos INTEGER,
  completado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de exercícios por treino
CREATE TABLE IF NOT EXISTS treino_exercicios (
  id SERIAL PRIMARY KEY,
  treino_id INTEGER REFERENCES treinos(id) ON DELETE CASCADE,
  exercicio_id INTEGER REFERENCES exercicios(id),
  repeticoes_realizadas INTEGER NOT NULL,
  tempo_segundos INTEGER,
  completado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de progresso do usuário
CREATE TABLE IF NOT EXISTS progresso_usuario (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_registro DATE NOT NULL,
  peso DECIMAL(5,2),
  medidas JSONB,
  nivel_atual TEXT DEFAULT 'iniciante',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inserir exercícios 5BX básicos
INSERT INTO exercicios (nome, descricao, categoria, ordem, instrucoes) VALUES
('Polichinelos', 'Exercício cardiovascular de aquecimento', 'aquecimento', 1, ARRAY['Pés juntos, braços ao lado', 'Salte abrindo as pernas e levantando os braços', 'Retorne à posição inicial', 'Mantenha ritmo constante']),
('Abdominais', 'Fortalecimento do core abdominal', 'forca', 2, ARRAY['Deite-se de costas', 'Mãos atrás da cabeça', 'Levante o tronco flexionando o abdômen', 'Retorne lentamente']),
('Flexões', 'Fortalecimento de braços e peito', 'forca', 3, ARRAY['Posição de prancha', 'Mãos no chão alinhadas com os ombros', 'Abaixe o corpo quase tocando o chão', 'Empurre de volta para cima']),
('Agachamentos', 'Fortalecimento de pernas e glúteos', 'forca', 4, ARRAY['Pés na largura dos ombros', 'Abaixe o quadril como se fosse sentar', 'Mantenha os joelhos alinhados com os pés', 'Retorne à posição inicial']),
('Corrida Estacionária', 'Exercício cardiovascular final', 'cardio', 5, ARRAY['Corra no lugar', 'Levante os joelhos', 'Movimente os braços', 'Mantenha ritmo constante por 2-3 minutos']);

-- Inserir níveis básicos
INSERT INTO niveis (nome, descricao, nivel_numero, min_repeticoes, max_repeticoes, tempo_segundos) VALUES
('Nível 1 - Iniciante', 'Para quem está começando', 1, 10, 15, 300),
('Nível 2 - Intermediário', 'Para quem já tem prática', 2, 15, 25, 600),
('Nível 3 - Avançado', 'Para quem busca desafio', 3, 25, 50, 900);

-- Configurar RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE treinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE treino_exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresso_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver apenas seu próprio perfil" ON user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Usuários podem ver apenas seus próprios treinos" ON treinos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver apenas seus próprios exercícios de treino" ON treino_exercicios
  FOR ALL USING (EXISTS (
    SELECT 1 FROM treinos 
    WHERE treinos.id = treino_exercicios.treino_id 
    AND treinos.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem ver apenas seu próprio progresso" ON progresso_usuario
  FOR ALL USING (auth.uid() = user_id);

-- Dar permissões aos roles do Supabase
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON exercicios TO anon, authenticated;
GRANT ALL ON niveis TO anon, authenticated;
GRANT ALL ON treinos TO authenticated;
GRANT ALL ON treino_exercicios TO authenticated;
GRANT ALL ON progresso_usuario TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE treinos_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE treino_exercicios_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE progresso_usuario_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE exercicios_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE niveis_id_seq TO authenticated;