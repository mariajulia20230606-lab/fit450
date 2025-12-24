-- Atualizar exercícios para o conjunto oficial do 5BX
BEGIN;

TRUNCATE TABLE exercicios RESTART IDENTITY CASCADE;

INSERT INTO exercicios (nome, descricao, categoria, ordem, instrucoes) VALUES
('Flexão de tronco', 'Alongamento em pé tocando os pés', 'aquecimento', 1, ARRAY[
  'Fique em pé, pés juntos',
  'Eleve os braços acima da cabeça',
  'Flexione o tronco à frente e toque os pés',
  'Retorne à posição inicial mantendo o controle'
]),
('Abdominais', 'Fortalecimento do core abdominal', 'forca', 2, ARRAY[
  'Deite-se de costas',
  'Mãos atrás da cabeça ou cruzadas no peito',
  'Eleve o tronco contraindo o abdômen',
  'Retorne com controle'
]),
('Extensão lombar', 'Elevação do tronco em decúbito ventral', 'forca', 3, ARRAY[
  'Deite-se de bruços, mãos na lombar',
  'Eleve suavemente o tronco olhando à frente',
  'Mantenha os pés no chão',
  'Retorne com controle'
]),
('Flexões de braço', 'Fortalecimento de peito e braços', 'forca', 4, ARRAY[
  'Posição de prancha, mãos no chão',
  'Mãos alinhadas aos ombros',
  'Abaixe até quase tocar o chão',
  'Empurre de volta mantendo o corpo alinhado'
]),
('Corrida no lugar', 'Exercício aeróbico final', 'cardio', 5, ARRAY[
  'Corra no lugar levantando os joelhos',
  'Mantenha os braços ativos',
  'Respire ritmadamente',
  'Mantenha o ritmo até o fim'
]);

COMMIT;
