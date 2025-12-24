export type ChartExercise = {
  id: number
  name: string
  variation?: string
  image?: string
  imagePosition?: string // Para sprites: 'center top', '0% 10%', etc.
  imageSize?: string     // Para sprites: '100% auto', 'cover', etc.
  imageHeight?: string   // Altura do container para exibir o recorte correto
}

export type Level = 'A' | 'B' | 'C' | 'D'
export type SubLevel = 'minus' | 'neutral' | 'plus'

export type Chart = {
  id: number
  title: string
  exercises: ChartExercise[]
  timings: number[]
  reps?: Partial<Record<Level, Partial<Record<SubLevel, number[]>>>>
  units?: string[]
}

export const BASE_EXERCISES: ChartExercise[] = [
  { id: 1, name: 'Alongamento (Pés Afastados)' },
  { id: 2, name: 'Abdominais (Sit-ups)' },
  { id: 3, name: 'Extensão Lombar' },
  { id: 4, name: 'Flexões de Braço' },
  { id: 5, name: 'Corrida Estacionária' },
]

export const CHARTS: Chart[] = [
  {
    id: 1,
    title: 'Chart 1',
    exercises: [
      { 
        id: 1, 
        name: 'Toque nos Pés', 
        variation: 'Pés afastados, braços para cima. Incline-se para frente até tocar o chão, depois estique-se para cima e incline-se para trás. Não force para manter os joelhos retos.', 
        image: '/exercises/chart1.png',
        imagePosition: '0% 2%', // Topo da imagem
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 2, 
        name: 'Levantamento de Cabeça', 
        variation: 'Deitado de costas, pés afastados 15cm, braços ao lado do corpo. Levante o tronco apenas o suficiente para ver seus calcanhares. Mantenha as pernas retas; cabeça e ombros devem sair do chão.',
        image: '/exercises/chart1.png',
        imagePosition: '0% 21%', // ~1/5 da imagem
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 3, 
        name: 'Levantamento de Cabeça e Ombros', 
        variation: 'Deitado de bruços, palmas das mãos sob as coxas. Levante a cabeça e uma perna, repita alternando as pernas. Mantenha a perna reta no joelho; as coxas devem sair de cima das palmas.',
        image: '/exercises/chart1.png',
        imagePosition: '0% 40%', // ~2/5 da imagem
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 4, 
        name: 'Flexão com Joelhos', 
        variation: 'Deitado de bruços, mãos sob os ombros, palmas planas no chão. Estique os braços levantando a parte superior do corpo, mantendo os joelhos no chão. Dobre os braços para baixar o corpo. Mantenha o corpo reto a partir dos joelhos; braços devem ser totalmente estendidos; o peito deve tocar o chão para completar um movimento.',
        image: '/exercises/chart1.png',
        imagePosition: '0% 60%', // ~3/5 da imagem
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 5, 
        name: 'Corrida Estacionária', 
        variation: 'Corrida estacionária (conte um passo cada vez que o pé esquerdo tocar o chão. Levante os pés aproximadamente 10cm do chão). A cada 75 passos, faça 10 "saltos tesoura". Saltos tesoura: Fique em pé com a perna direita e braço esquerdo estendidos para frente, e perna esquerda e braço direito estendidos para trás. Pule trocando a posição dos braços e pernas.',
        image: '/exercises/chart1.png',
        imagePosition: '0% 85%', // ~4/5 da imagem
        imageSize: '100% auto', 
        imageHeight: '200px' // Um pouco maior para caber a corrida
      },
    ],
    timings: [120, 60, 60, 60, 360],
    units: ['reps', 'reps', 'reps', 'reps', 'passos'],
    reps: {
      D: {
        minus: [2, 3, 4, 2, 100],
        neutral: [3, 4, 5, 3, 145],
        plus: [4, 5, 6, 3, 175]
      },
      C: {
        minus: [6, 7, 8, 4, 205],
        neutral: [7, 8, 10, 5, 235],
        plus: [8, 9, 12, 6, 260]
      },
      B: {
        minus: [10, 11, 13, 7, 280],
        neutral: [12, 12, 14, 8, 305],
        plus: [14, 13, 15, 9, 320]
      },
      A: {
        minus: [16, 15, 16, 11, 335],
        neutral: [18, 17, 17, 12, 375],
        plus: [20, 18, 18, 13, 400]
      }
    }
  },
  {
    id: 2,
    title: 'Chart 2',
    exercises: [
      { 
        id: 1, 
        name: 'Toque no Chão e Costas', 
        variation: 'Pés afastados, braços para cima. Toque o chão e pressione (balance) uma vez, depois estique-se para cima e incline-se para trás. Não force para manter os joelhos retos.',
        image: '/exercises/chart2.png',
        imagePosition: '0% 2%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 2, 
        name: 'Abdominal Simples', 
        variation: 'Deitado de costas, pés afastados 15cm, braços ao lado. Sente-se até a posição vertical, mantendo os pés no chão (pode prendê-los sob uma cadeira se necessário). Permita que os joelhos dobrem levemente.',
        image: '/exercises/chart2.png',
        imagePosition: '0% 21%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 3, 
        name: 'Levantamento de Pernas Duplo', 
        variation: 'Deitado de bruços, palmas sob as coxas. Levante a cabeça, ombros e ambas as pernas. Mantenha as pernas retas; ambas as coxas devem desencostar das palmas.',
        image: '/exercises/chart2.png',
        imagePosition: '0% 40%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 4, 
        name: 'Flexão Padrão', 
        variation: 'Deitado de bruços, mãos sob os ombros, palmas no chão. Estique os braços para levantar o corpo apoiado apenas nas palmas e dedos dos pés. Costas retas. O peito deve tocar o chão a cada movimento.',
        image: '/exercises/chart2.png',
        imagePosition: '0% 60%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 5, 
        name: 'Corrida Estacionária', 
        variation: 'Corrida no lugar (levante pés 10cm). A cada 75 passos, faça 10 "saltos afastados". Saltos afastados: Pés juntos, braços ao lado. Pule afastando pernas e levantando braços acima dos ombros. Retorne à posição inicial.',
        image: '/exercises/chart2.png',
        imagePosition: '0% 85%', 
        imageSize: '100% auto', 
        imageHeight: '200px'
      },
    ],
    timings: [120, 60, 60, 60, 360],
    units: ['reps', 'reps', 'reps', 'reps', 'passos'],
    reps: {
      D: {
        minus: [14, 10, 13, 9, 335],
        neutral: [15, 11, 14, 10, 360],
        plus: [16, 12, 15, 11, 380]
      },
      C: {
        minus: [18, 13, 17, 12, 395],
        neutral: [19, 14, 19, 13, 410],
        plus: [20, 15, 21, 14, 425]
      },
      B: {
        minus: [22, 16, 23, 15, 440],
        neutral: [24, 17, 25, 16, 455],
        plus: [26, 18, 27, 17, 455]
      },
      A: {
        minus: [28, 20, 29, 18, 470],
        neutral: [29, 21, 31, 19, 485],
        plus: [30, 23, 33, 20, 500]
      }
    }
  },
  {
    id: 3,
    title: 'Chart 3',
    exercises: [
      { 
        id: 1, 
        name: 'Toque no Chão e Costas (Sem Pressão)', 
        variation: 'Pés afastados, braços para cima. Toque o chão (sem pressionar/balançar), depois estique-se para cima e incline-se para trás. Braços e pernas retos. Dobre os joelhos apenas se necessário.',
        image: '/exercises/chart3.png',
        imagePosition: '0% 2%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 2, 
        name: 'Abdominal Pernas Retas', 
        variation: 'Deitado de costas, pés afastados 15cm, braços ao lado. Sente-se mantendo pernas retas. Use uma cadeira para prender os pés se necessário.',
        image: '/exercises/chart3.png',
        imagePosition: '0% 21%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 3, 
        name: 'Extensão Lombar Braços Estendidos', 
        variation: 'Deitado de bruços, braços estendidos acima da cabeça. Levante braços, cabeça, peito e ambas as pernas simultaneamente. Joelhos e cotovelos retos.',
        image: '/exercises/chart3.png',
        imagePosition: '0% 40%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 4, 
        name: 'Movimento de Queixo e Testa', 
        variation: 'Deitado de bruços, mãos sob os ombros, palmas no chão. Toque o queixo no chão à frente das mãos, depois a testa atrás das mãos, e então estique os braços levantando o corpo. São 3 movimentos distintos: queixo, testa, extensão.',
        image: '/exercises/chart3.png',
        imagePosition: '0% 60%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 5, 
        name: 'Corrida com Saltos Cruzados', 
        variation: 'Corrida no lugar (pés 15cm do chão). A cada 75 passos, faça 10 "saltos cruzados". Saltos: Pés afastados, braços estendidos na altura dos ombros. Pule cruzando um pé na frente do outro e braços na frente do peito. Alterne qual pé/braço fica na frente.',
        image: '/exercises/chart3.png',
        imagePosition: '0% 85%', 
        imageSize: '100% auto', 
        imageHeight: '200px'
      },
    ],
    timings: [120, 60, 60, 60, 360],
    units: ['reps', 'reps', 'reps', 'reps', 'passos'],
    reps: {
      D: {
        minus: [24, 20, 29, 15, 400],
        neutral: [24, 21, 30, 15, 415],
        plus: [24, 22, 31, 15, 430]
      },
      C: {
        minus: [26, 23, 33, 16, 450],
        neutral: [26, 24, 34, 17, 465],
        plus: [26, 25, 35, 17, 480]
      },
      B: {
        minus: [28, 26, 37, 18, 490],
        neutral: [28, 27, 39, 19, 500],
        plus: [28, 28, 41, 20, 510]
      },
      A: {
        minus: [30, 30, 43, 21, 525],
        neutral: [30, 31, 45, 22, 540],
        plus: [30, 32, 47, 24, 550]
      }
    }
  },
  {
    id: 4,
    title: 'Chart 4',
    exercises: [
      { 
        id: 1, 
        name: 'Círculo de Tronco', 
        variation: 'Pés afastados, braços para cima. Toque o chão fora do pé esquerdo, entre os pés, fora do pé direito. Faça um círculo inclinando-se para trás o máximo possível. Inverta a direção na metade. Braços sempre acima da cabeça.',
        image: '/exercises/chart4.png',
        imagePosition: '0% 2%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 2, 
        name: 'Abdominal com Toque nos Pés', 
        variation: 'Deitado de costas, pernas retas, braços esticados acima da cabeça. Sente-se e toque os dedos dos pés mantendo braços e pernas retos. Use cadeira para prender os pés apenas se necessário.',
        image: '/exercises/chart4.png',
        imagePosition: '0% 21%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 3, 
        name: 'Extensão Lateral', 
        variation: 'Deitado de bruços, braços estendidos lateralmente. Levante cabeça, ombros, braços, peito e ambas as pernas o mais alto possível. Tire peito e coxas do chão.',
        image: '/exercises/chart4.png',
        imagePosition: '0% 40%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 4, 
        name: 'Flexão Aberta', 
        variation: 'Deitado de bruços, palmas no chão a 30cm das orelhas. Estique os braços para levantar o corpo. O peito deve tocar o chão a cada movimento.',
        image: '/exercises/chart4.png',
        imagePosition: '0% 60%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 5, 
        name: 'Corrida com Saltos', 
        variation: 'Corrida no lugar (pés 10cm). A cada 75 passos, faça 10 "saltos semi-agachados". Saltos: Agache até a metade, mãos nos joelhos, pule para a vertical trocando os pés no ar.',
        image: '/exercises/chart4.png',
        imagePosition: '0% 85%', 
        imageSize: '100% auto', 
        imageHeight: '200px'
      },
    ],
    timings: [120, 60, 60, 60, 360],
    units: ['reps', 'reps', 'reps', 'reps', 'passos'],
    reps: {
      D: {
        minus: [24, 18, 40, 17, 300],
        neutral: [24, 18, 40, 19, 315],
        plus: [24, 18, 41, 21, 320]
      },
      C: {
        minus: [26, 19, 43, 24, 335],
        neutral: [26, 19, 43, 26, 345],
        plus: [26, 19, 44, 28, 355]
      },
      B: {
        minus: [28, 21, 46, 30, 365],
        neutral: [28, 21, 46, 32, 375],
        plus: [28, 21, 47, 34, 380]
      },
      A: {
        minus: [30, 22, 49, 37, 390],
        neutral: [30, 22, 49, 40, 395],
        plus: [30, 22, 50, 42, 400]
      }
    }
  },
  {
    id: 5,
    title: 'Chart 5',
    exercises: [
      { 
        id: 1, 
        name: 'Círculo de Tronco com Toque', 
        variation: 'Pés afastados, braços para cima, mãos entrelaçadas. Toque o chão fora do pé esquerdo, entre os pés, fora do pé direito. Faça um círculo inclinando-se para trás o máximo possível. Inverta a direção na metade. Braços sempre acima da cabeça.',
        image: '/exercises/chart5.png',
        imagePosition: '0% 2%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 2, 
        name: 'Abdominal Jackknife com Torção', 
        variation: 'Deitado de costas, pernas retas. Sente-se e levante as pernas flexionadas simultaneamente, girando para tocar o cotovelo direito no joelho esquerdo. Alterne a direção a cada repetição. Mantenha os pés fora do chão no topo.',
        image: '/exercises/chart5.png',
        imagePosition: '0% 21%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 3, 
        name: 'Extensão Lombar Completa', 
        variation: 'Deitado de bruços, braços estendidos acima da cabeça. Levante braços, cabeça, peito e ambas as pernas o mais alto possível. Mantenha pernas e braços retos, tirando coxas e peito do chão.',
        image: '/exercises/chart5.png',
        imagePosition: '0% 40%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 4, 
        name: 'Flexão com Palma', 
        variation: 'Deitado de bruços, mãos sob os ombros. Empurre o chão com força suficiente para bater palmas antes de aterrissar. Mantenha o corpo reto. A batida de palmas deve ser audível.',
        image: '/exercises/chart5.png',
        imagePosition: '0% 60%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 5, 
        name: 'Corrida com Saltos Polichinelo', 
        variation: 'Corrida no lugar. A cada 75 passos, faça 10 "Saltos Polichinelo Agachados". Saltos: Comece agachado com mãos nos joelhos, pule abrindo as pernas e braços no ar, aterrisse com pés juntos.',
        image: '/exercises/chart5.png',
        imagePosition: '0% 85%', 
        imageSize: '100% auto', 
        imageHeight: '200px'
      },
    ],
    timings: [120, 60, 60, 60, 360],
    units: ['reps', 'reps', 'reps', 'reps', 'passos'],
    reps: {
      D: {
        minus: [24, 26, 39, 30, 375],
        neutral: [24, 27, 40, 31, 385],
        plus: [24, 28, 41, 32, 400]
      },
      C: {
        minus: [26, 30, 42, 34, 410],
        neutral: [26, 31, 43, 35, 420],
        plus: [26, 32, 44, 36, 435]
      },
      B: {
        minus: [28, 34, 45, 38, 445],
        neutral: [28, 35, 46, 39, 455],
        plus: [28, 36, 47, 40, 465]
      },
      A: {
        minus: [30, 38, 48, 42, 475],
        neutral: [30, 39, 49, 43, 485],
        plus: [30, 40, 50, 44, 500]
      }
    }
  },
  {
    id: 6,
    title: 'Chart 6',
    exercises: [
      { 
        id: 1, 
        name: 'Círculo de Tronco com Mãos Invertidas', 
        variation: 'Pés afastados, braços para cima, mãos entrelaçadas invertidas. Toque o chão fora do pé esquerdo, entre os pés, pressione uma vez, depois fora do pé direito. Faça um círculo inclinando-se para trás o máximo possível. Inverta a direção na metade. Mantenha as mãos entrelaçadas de forma invertida o tempo todo.',
        image: '/exercises/chart6.png',
        imagePosition: '0% 2%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 2, 
        name: 'Abdominal V-Sit (Canivete)', 
        variation: 'Deitado de costas, pernas retas, braços acima da cabeça. Sente-se levantando ambas as pernas retas simultaneamente para tocar os pés na posição V. Mantenha pés juntos, pernas e braços retos. Parte superior das costas e pernas não tocam o chão.',
        image: '/exercises/chart6.png',
        imagePosition: '0% 21%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 3, 
        name: 'Extensão Lombar com Impulso', 
        variation: 'Deitado de bruços, braços estendidos acima da cabeça. Levante braços, cabeça, peito e ambas as pernas o mais alto possível, depois dê um impulso extra para trás uma vez. Mantenha membros retos. Peito e coxas fora do chão.',
        image: '/exercises/chart6.png',
        imagePosition: '0% 40%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 4, 
        name: 'Flexão com Batida no Peito', 
        variation: 'Deitado de bruços, mãos sob os ombros. Empurre o chão e bata as mãos no peito antes de retornar à posição inicial. Mantenha o corpo reto. A batida no peito deve ser audível.',
        image: '/exercises/chart6.png',
        imagePosition: '0% 60%', 
        imageSize: '100% auto', 
        imageHeight: '150px'
      },
      { 
        id: 5, 
        name: 'Corrida com Saltos Jack', 
        variation: 'Corrida no lugar. A cada 75 passos, faça 10 "Saltos Jack". Saltos: Pés juntos, agache e toque o chão. Pule alto, levante pernas retas na altura da cintura e toque os pés no ar. Aterrisse com pés juntos.',
        image: '/exercises/chart6.png',
        imagePosition: '0% 85%', 
        imageSize: '100% auto', 
        imageHeight: '200px'
      },
    ],
    timings: [120, 60, 60, 60, 360],
    units: ['reps', 'reps', 'reps', 'reps', 'passos'],
    reps: {
      D: {
        minus: [24, 35, 29, 26, 450],
        neutral: [24, 36, 30, 27, 460],
        plus: [24, 37, 31, 28, 475]
      },
      C: {
        minus: [26, 39, 32, 30, 485],
        neutral: [26, 40, 33, 31, 495],
        plus: [26, 41, 34, 32, 505]
      },
      B: {
        minus: [28, 43, 35, 34, 515],
        neutral: [28, 44, 36, 35, 525],
        plus: [28, 45, 37, 36, 530]
      },
      A: {
        minus: [30, 47, 38, 38, 555],
        neutral: [30, 48, 39, 39, 580],
        plus: [30, 50, 40, 40, 600]
      }
    }
  },
]

function generateChartReps(start: number[], end: number[]) {
  const levels: Level[] = ['D', 'C', 'B', 'A']
  const subLevels: SubLevel[] = ['minus', 'neutral', 'plus']
  const totalSteps = 12
  const result: any = {}

  let stepIndex = 0
  levels.forEach(level => {
    result[level] = {}
    subLevels.forEach(subLevel => {
      const currentReps = start.map((s, i) => {
        const e = end[i]
        const val = s + ((e - s) * stepIndex) / (totalSteps - 1)
        return Math.round(val)
      })
      result[level][subLevel] = currentReps
      stepIndex++
    })
  })

  return result
}
