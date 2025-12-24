BEGIN;

CREATE TABLE IF NOT EXISTS charts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS chart_exercises (
  id SERIAL PRIMARY KEY,
  chart_id INTEGER REFERENCES charts(id) ON DELETE CASCADE,
  exercicio_id INTEGER REFERENCES exercicios(id),
  variation TEXT,
  seconds INTEGER,
  ordem INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

INSERT INTO charts (title) VALUES
('Chart 1'), ('Chart 2'), ('Chart 3'), ('Chart 4'), ('Chart 5'), ('Chart 6');

INSERT INTO chart_exercises (chart_id, exercicio_id, variation, seconds, ordem) VALUES
(1, 1, NULL, 60, 1),
(1, 2, NULL, 60, 2),
(1, 3, NULL, 60, 3),
(1, 4, 'joelhos apoiados', 60, 4),
(1, 5, NULL, 420, 5),

(2, 1, NULL, 60, 1),
(2, 2, NULL, 60, 2),
(2, 3, NULL, 60, 3),
(2, 4, NULL, 60, 4),
(2, 5, NULL, 420, 5),

(3, 1, NULL, 60, 1),
(3, 2, NULL, 60, 2),
(3, 3, NULL, 60, 3),
(3, 4, 'mãos afastadas', 60, 4),
(3, 5, NULL, 420, 5),

(4, 1, NULL, 60, 1),
(4, 2, NULL, 60, 2),
(4, 3, NULL, 60, 3),
(4, 4, 'padrão', 60, 4),
(4, 5, NULL, 420, 5),

(5, 1, NULL, 60, 1),
(5, 2, NULL, 60, 2),
(5, 3, NULL, 60, 3),
(5, 4, 'mãos próximas', 60, 4),
(5, 5, 'saltos a cada 75 passos', 420, 5),

(6, 1, NULL, 60, 1),
(6, 2, NULL, 60, 2),
(6, 3, NULL, 60, 3),
(6, 4, NULL, 60, 4),
(6, 5, 'saltos a cada 75 passos', 420, 5);

COMMIT;
