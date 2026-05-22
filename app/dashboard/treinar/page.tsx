'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, RotateCcw, CheckCircle, Timer, Lock, ArrowUpCircle } from 'lucide-react'
import { CHARTS, Level, SubLevel } from '@/lib/charts'
import { ALL_LEVELS, getLevelByIndex, canAdvance, SUBLEVEL_MAP, getTargetLevel } from '@/lib/5bx-logic'
import { supabase } from '@/lib/supabase'

type Exercicio = {
  id: number
  nome: string
  descricao: string
  instrucoes: string[]
  duracao: number
  cor: string
  icone: string
  imagem?: string
  imagePosition?: string
  imageSize?: string
  imageHeight?: string
}

const ICONS = ['🧘‍♂️','💪','🦴','🤸‍♂️','🏃‍♂️']

function calculateAge(dobString: string | null): number {
  if (!dobString) return 30 // Default se não houver data
  const dob = new Date(dobString)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

export default function Treinar() {
  const router = useRouter()
  // Estado do Usuário
  const [loading, setLoading] = useState(true)
  const [userLevelIndex, setUserLevelIndex] = useState(0)
  const [daysAtLevel, setDaysAtLevel] = useState(0)
  const [targetLevelIndex, setTargetLevelIndex] = useState(20)
  const [lastWorkoutDate, setLastWorkoutDate] = useState<string | null>(null)

  // Estado do Treino Atual
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [tempo, setTempo] = useState(0)
  const [rodando, setRodando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const timerRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Carregar dados do Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }

        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('data_nascimento, nivel_atual_index, dias_no_nivel, ultimo_treino_data')
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          console.error('Erro ao carregar perfil:', error)
          // Não retornar erro fatal, usar defaults
        }

        if (!profile) {
          await supabase
            .from('user_profiles')
            .upsert({ id: user.id }, { onConflict: 'id' })
        }

        const age = calculateAge(profile?.data_nascimento ?? null)
        setTargetLevelIndex(getTargetLevel(age))
        setUserLevelIndex(profile?.nivel_atual_index || 0)
        setDaysAtLevel(profile?.dias_no_nivel || 0)
        setLastWorkoutDate(profile?.ultimo_treino_data ?? null)
      } catch (err) {
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [router])

  // Obter configuração do nível atual
  const currentLevelConfig = getLevelByIndex(userLevelIndex)
  const chartConfig = CHARTS[currentLevelConfig.chart - 1]
  
  // Atualizar tempo quando mudar de exercício ou carregar
  useEffect(() => {
    if (chartConfig) {
      setTempo(chartConfig.timings[indiceAtual])
    }
  }, [indiceAtual, chartConfig])

  // Timer effect
  useEffect(() => {
    if (!rodando) return
    timerRef.current = window.setInterval(() => {
      setTempo((t) => {
        if (t <= 1) {
          parar()
          avancarExercicio()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [rodando])

  // Efeito sonoro para os últimos 10 segundos
  useEffect(() => {
    if (rodando && tempo <= 10 && tempo > 0) {
      tocarBeep()
    }
  }, [tempo, rodando])

  if (!chartConfig) return <div className="p-8 text-center">Carregando dados do treino...</div>

  const targetLevelConfig = getLevelByIndex(targetLevelIndex)
  const exercicioConfig = chartConfig.exercises[indiceAtual]
  const nivelKey = currentLevelConfig.level as Level
  const subNivelKey = SUBLEVEL_MAP[currentLevelConfig.subLevel] as SubLevel
  const reps = chartConfig.reps?.[nivelKey]?.[subNivelKey]

  const exercicio: Exercicio = {
    id: exercicioConfig?.id || 0,
    nome: exercicioConfig?.name || '',
    descricao: exercicioConfig?.variation ? exercicioConfig.variation : '',
    instrucoes: [],
    duracao: chartConfig.timings[indiceAtual] || 0,
    cor: ['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-red-500'][indiceAtual] || 'bg-gray-500',
    icone: ICONS[indiceAtual] || '?',
    imagem: exercicioConfig?.image,
    imagePosition: exercicioConfig?.imagePosition,
    imageSize: exercicioConfig?.imageSize,
    imageHeight: exercicioConfig?.imageHeight
  }

  const iniciar = () => {
    // Criar contexto de áudio na primeira interação do usuário
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    // Criar elemento de áudio como backup
    if (!audioRef.current) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
    }
    setTempo(chartConfig.timings[indiceAtual])
    setRodando(true)
  }

  const pausar = () => {
    setRodando(false)
    if (timerRef.current) window.clearInterval(timerRef.current)
  }

  const parar = () => {
    setRodando(false)
    if (timerRef.current) window.clearInterval(timerRef.current)
  }

  const reiniciar = () => {
    parar()
    setTempo(chartConfig.timings[indiceAtual])
  }

  const avancarExercicio = () => {
    if (indiceAtual < chartConfig.exercises.length - 1) {
      const proximo = indiceAtual + 1
      setIndiceAtual(proximo)
      setTempo(chartConfig.timings[proximo])
    } else {
      finalizarTreino()
    }
  }

  const finalizarTreino = async () => {
    setConcluido(true)
    
    // Verificar se já treinou hoje
    const today = new Date().toISOString().split('T')[0]
    
    if (lastWorkoutDate === today) {
      return
    }

    const newDays = daysAtLevel + 1
    setDaysAtLevel(newDays)
    setLastWorkoutDate(today)
    
    // Salvar no Supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          dias_no_nivel: newDays,
          ultimo_treino_data: today,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (profileError) console.error('Erro ao atualizar perfil:', profileError)

      // Registrar treino no histórico
      const tempoTotal = chartConfig.timings.reduce((acc, curr) => acc + curr, 0)
      
      const { error: treinoError } = await supabase.from('treinos').insert({
        user_id: user.id,
        data_treino: today,
        tempo_total_segundos: tempoTotal,
        completado: true
        // nivel_id: null // Deixando null pois não temos mapeamento direto com a tabela niveis antiga
      })

      if (treinoError) console.error('Erro ao registrar treino:', treinoError)
    }
  }

  const avancarNivel = async () => {
    if (!canAdvance(daysAtLevel)) return

    const nextLevel = userLevelIndex + 1
    setUserLevelIndex(nextLevel)
    setDaysAtLevel(0)
    setConcluido(false)
    setIndiceAtual(0)
    
    // Salvar no Supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          nivel_atual_index: nextLevel,
          dias_no_nivel: 0,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (error) console.error('Erro ao avançar nível:', error)
    }
  }

  const formatar = (s: number) => {
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${m}:${r.toString().padStart(2, '0')}`
  }

  // Função para tocar som de beep
  const tocarBeep = () => {
    // Tentar primeiro com Web Audio API
    if (audioContextRef.current) {
      try {
        const oscillator = audioContextRef.current.createOscillator()
        const gainNode = audioContextRef.current.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContextRef.current.destination)
        
        oscillator.frequency.value = 1000
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1)
        
        oscillator.start(audioContextRef.current.currentTime)
        oscillator.stop(audioContextRef.current.currentTime + 0.1)
        return
      } catch (error) {
        console.log('Web Audio API falhou, tentando HTML5 Audio:', error)
      }
    }
    
    // Fallback com HTML5 Audio
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(err => console.log('Erro ao tocar áudio:', err))
      } catch (error) {
        console.log('HTML5 Audio também falhou:', error)
      }
    }
  }

  if (!chartConfig) return <div>Carregando...</div>

  if (concluido) {
    const podeAvancar = canAdvance(daysAtLevel)
    const diasRestantes = Math.max(0, 3 - daysAtLevel)

    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="max-w-2xl mx-auto border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Treino Concluído!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <p className="text-green-700 mb-2">
                  Você completou o treino do nível <strong>Chart {currentLevelConfig.chart} - Nível {currentLevelConfig.level}{currentLevelConfig.subLevel}</strong>
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-green-200 text-sm font-medium text-green-800">
                  <Timer className="h-4 w-4" />
                  {daysAtLevel} / 3 dias completados neste nível
                </div>
              </div>

              {podeAvancar ? (
                <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Parabéns! Você pode avançar!</h3>
                  <p className="text-gray-600 mb-4">
                    Você completou os 3 dias obrigatórios neste nível. Deseja avançar para o próximo desafio?
                  </p>
                  <Button 
                    onClick={avancarNivel} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    <ArrowUpCircle className="h-5 w-5 mr-2" />
                    Avançar para o Próximo Nível
                  </Button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border border-orange-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Continue assim!</h3>
                  <p className="text-gray-600 mb-4">
                    Complete mais <strong>{diasRestantes} dias</strong> neste nível para desbloquear o próximo estágio.
                    A consistência é a chave para a evolução segura.
                  </p>
                  <Button variant="outline" disabled className="w-full opacity-50 cursor-not-allowed">
                    <Lock className="h-4 w-4 mr-2" />
                    Avançar Nível (Bloqueado)
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                onClick={() => {
                  setConcluido(false)
                  setIndiceAtual(0)
                  setTempo(chartConfig.timings[0])
                }}
              >
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Chart {currentLevelConfig.chart} <span className="text-gray-400">|</span> Nível {currentLevelConfig.level}{currentLevelConfig.subLevel}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span>Dia {daysAtLevel} de 3 completados</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-blue-600 font-medium">
                Meta: Chart {targetLevelConfig.chart} - {targetLevelConfig.level}{targetLevelConfig.subLevel}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="text-right mr-2 hidden md:block">
              <div className="text-xs text-gray-500 uppercase font-bold">Meta</div>
              <div className="text-sm font-medium text-blue-600">Nível {targetLevelConfig.level}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Progresso do treino</h2>
            <span className="text-sm text-gray-500">
              {indiceAtual + 1} de {chartConfig.exercises.length}
            </span>
          </div>
          <Progress value={((indiceAtual + 1) / chartConfig.exercises.length) * 100} className="h-2" />
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
              {exercicio.icone}
            </div>
            <CardTitle className="text-2xl">{exercicio.nome}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              {exercicio.imagem ? (
                <div 
                  className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm mx-auto max-w-sm bg-white"
                  style={{
                    height: exercicio.imageHeight || '200px', // Altura fixa para o recorte
                    backgroundImage: `url(${exercicio.imagem})`,
                    backgroundPosition: exercicio.imagePosition || 'center',
                    backgroundSize: exercicio.imageSize || 'cover',
                    backgroundRepeat: 'no-repeat'
                  }}
                  title={exercicio.nome}
                />
              ) : (
                <div className={`text-6xl font-bold ${exercicio.cor} text-white rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4`}>
                  <Timer className="h-12 w-12" />
                </div>
              )}
              <div className="text-3xl font-bold text-gray-900">{formatar(tempo)}</div>
              <div className="text-sm text-gray-500 mt-1">{exercicio.descricao}</div>
              {!!reps && (
                <div className="mt-2 text-xl font-medium text-blue-700 bg-blue-50 py-2 px-4 rounded-lg inline-block">
                  {indiceAtual < 4 ? `Meta: ${reps[indiceAtual]} repetições` : `Meta: ${reps[indiceAtual]} ${chartConfig.units?.[indiceAtual] ?? ''}`}
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <ol className="space-y-1 text-sm text-gray-600">
                <li className="flex items-start"><span className="font-medium mr-2">1.</span><span>Execute a variação indicada.</span></li>
                <li className="flex items-start"><span className="font-medium mr-2">2.</span><span>Mantenha ritmo contínuo.</span></li>
                <li className="flex items-start"><span className="font-medium mr-2">3.</span><span>Respeite o tempo da etapa.</span></li>
              </ol>
            </div>

            <div className="flex gap-4 justify-center">
              {!rodando ? (
                <>
                  <Button onClick={iniciar} className="bg-green-600 hover:bg-green-700 w-32">
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </Button>
                  <Button onClick={reiniciar} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reiniciar
                  </Button>
                  <Button onClick={tocarBeep} variant="outline" size="sm">
                    🔊 Testar Som
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={pausar} variant="outline" className="w-32">
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </Button>
                  <Button onClick={avancarExercicio} className="bg-blue-600 hover:bg-blue-700">
                    Próximo
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Exercícios</h3>
          <div className="space-y-2">
            {chartConfig.exercises.slice(indiceAtual + 1).map((ex, i) => {
              const idx = indiceAtual + 1 + i
              const icon = ICONS[idx]
              const dur = chartConfig.timings[idx]
              const r = reps?.[idx]
              return (
                <div key={`${chartConfig.id}-${ex.id}-${idx}`} className="flex items-center space-x-3 p-3 bg-white rounded-lg border opacity-75">
                  <div className="text-2xl grayscale">{icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{ex.name}</p>
                    <p className="text-sm text-gray-500">
                      {dur}s{ex.variation ? ` • ${ex.variation}` : ''}
                    </p>
                  </div>
                  {r !== undefined && (
                    <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {idx < 4 ? `${r}x` : `${r} ${chartConfig.units?.[idx] ?? ''}`}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
