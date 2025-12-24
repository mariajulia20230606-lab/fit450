export type ChartLevel = {
  chart: number
  level: string // 'A', 'B', 'C', 'D'
  subLevel: string // '-', '', '+' (representado como 'minus', 'neutral', 'plus' no código existente)
  totalIndex: number // 0 a N
}

// Mapeamento de subníveis para strings usadas no app
export const SUBLEVEL_MAP: Record<string, 'minus' | 'neutral' | 'plus'> = {
  '-': 'minus',
  '': 'neutral',
  '+': 'plus'
}

export const REVERSE_SUBLEVEL_MAP: Record<string, string> = {
  'minus': '-',
  'neutral': '',
  'plus': '+'
}

// Gerar todos os níveis sequencialmente
// Chart 1: D-, D, D+, C-, C, C+, B-, B, B+, A-, A, A+
// Chart 2: ...
export const ALL_LEVELS: ChartLevel[] = []

const LEVELS = ['D', 'C', 'B', 'A']
const SUBLEVELS = ['-', '', '+']

let globalIndex = 0
for (let chart = 1; chart <= 6; chart++) {
  for (const level of LEVELS) {
    for (const sub of SUBLEVELS) {
      ALL_LEVELS.push({
        chart,
        level,
        subLevel: sub,
        totalIndex: globalIndex++
      })
    }
  }
}

// Função para obter a meta baseada na idade (Target Level)
// Baseado nas tabelas gerais do 5BX para Homens (padrão)
export function getTargetLevel(age: number): number {
  // Retorna o totalIndex do nível alvo
  
  // 6-7 anos -> Chart 1, A (aprox index 10)
  // ... Simplificando para faixas principais de adultos conforme 5BX
  
  if (age < 12) return getIndex(1, 'A', '') // Crianças
  if (age < 18) return getIndex(3, 'C', '') // Adolescentes
  if (age < 25) return getIndex(3, 'A', '') // Jovens Adultos
  if (age < 30) return getIndex(3, 'A', '')
  if (age < 35) return getIndex(3, 'B', '')
  if (age < 40) return getIndex(3, 'C', '')
  if (age < 45) return getIndex(2, 'A', '')
  if (age < 50) return getIndex(2, 'B', '')
  if (age < 55) return getIndex(2, 'C', '')
  if (age < 60) return getIndex(1, 'A', '+')
  return getIndex(1, 'A', '') // 60+
}

function getIndex(chart: number, level: string, sub: string): number {
  return ALL_LEVELS.findIndex(l => l.chart === chart && l.level === level && l.subLevel === sub)
}

export function getLevelByIndex(index: number): ChartLevel {
  return ALL_LEVELS[index] || ALL_LEVELS[0]
}

export function canAdvance(currentDays: number): boolean {
  return currentDays >= 3
}
