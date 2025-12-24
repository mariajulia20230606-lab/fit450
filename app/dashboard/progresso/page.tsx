'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Clock,
  BarChart3,
  Zap,
  Scale
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getLevelByIndex } from '@/lib/5bx-logic'

// Tipos
type Treino = {
  data_treino: string
  tempo_total_segundos: number
  completado: boolean
}

type ProgressoPeso = {
  data_registro: string
  peso: number
}

type Stats = {
  diasConsecutivos: number
  totalTreinos: number
  tempoTotal: number // minutos
  nivelAtual: string
  progressoProximoNivel: number
  diasNoNivel: number
}

// Mock para dados que ainda não temos no backend
const mockMetas = [
  { id: 1, titulo: 'Treinar 5 dias por semana', progresso: 80, meta: 100 },
  { id: 2, titulo: 'Completar 30 treinos', progresso: 50, meta: 100 },
  { id: 3, titulo: 'Manter sequência de 14 dias', progresso: 50, meta: 100 },
]

const mockExercicios = [
  { nome: 'Toque nos Pés', vezes: 0 },
  { nome: 'Abdominal', vezes: 0 },
  { nome: 'Extensão Costas', vezes: 0 },
  { nome: 'Flexão', vezes: 0 },
  { nome: 'Corrida', vezes: 0 }
]

export default function Progresso() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('semana')
  const [loading, setLoading] = useState(true)
  
  const [stats, setStats] = useState<Stats>({
    diasConsecutivos: 0,
    totalTreinos: 0,
    tempoTotal: 0,
    nivelAtual: '-',
    progressoProximoNivel: 0,
    diasNoNivel: 0
  })

  const [historicoPeso, setHistoricoPeso] = useState<ProgressoPeso[]>([])
  const [historicoTreinos, setHistoricoTreinos] = useState<Treino[]>([])

  const periodos = [
    { id: 'semana', nome: 'Esta Semana' },
    { id: 'mes', nome: 'Este Mês' },
    { id: 'ano', nome: 'Este Ano' },
  ]

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Carregar Perfil (Nível Atual)
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('nivel_atual_index, dias_no_nivel, peso')
          .eq('id', user.id)
          .maybeSingle()

        let currentLevelLabel = 'Iniciante'
        let progressLevel = 0
        let daysLevel = 0

        if (profile) {
          const levelConfig = getLevelByIndex(profile.nivel_atual_index || 0)
          currentLevelLabel = `Chart ${levelConfig.chart} - ${levelConfig.level}${levelConfig.subLevel}`
          daysLevel = profile.dias_no_nivel || 0
          progressLevel = Math.min(100, (daysLevel / 3) * 100)
        }

        // 2. Carregar Histórico de Treinos
        const { data: treinosData } = await supabase
          .from('treinos')
          .select('data_treino, tempo_total_segundos, completado')
          .eq('user_id', user.id)
          .eq('completado', true)
          .order('data_treino', { ascending: false })

        const treinos = (treinosData as Treino[]) || []
        setHistoricoTreinos(treinos)

        // Calcular Stats
        const totalTreinos = treinos.length
        const totalSegundos = treinos.reduce((acc, t) => acc + (t.tempo_total_segundos || 0), 0)
        const tempoTotalMinutos = Math.floor(totalSegundos / 60)

        // Calcular Dias Consecutivos
        let streak = 0
        if (treinos.length > 0) {
          const uniqueDates = Array.from(new Set(treinos.map(t => t.data_treino))).sort().reverse()
          const today = new Date().toISOString().split('T')[0]
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
          
          // Se o último treino foi hoje ou ontem, o streak está ativo
          if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
            streak = 1
            for (let i = 0; i < uniqueDates.length - 1; i++) {
              const d1 = new Date(uniqueDates[i])
              const d2 = new Date(uniqueDates[i+1])
              const diffTime = Math.abs(d1.getTime() - d2.getTime())
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
              
              if (diffDays === 1) {
                streak++
              } else {
                break
              }
            }
          }
        }

        setStats({
          diasConsecutivos: streak,
          totalTreinos,
          tempoTotal: tempoTotalMinutos,
          nivelAtual: currentLevelLabel,
          progressoProximoNivel: progressLevel,
          diasNoNivel: daysLevel
        })

        // 3. Carregar Histórico de Peso (Progresso)
        // Tenta pegar da tabela progresso_usuario, se não tiver, usa o perfil como ponto único
        const { data: progressoData } = await supabase
          .from('progresso_usuario')
          .select('data_registro, peso')
          .eq('user_id', user.id)
          .order('data_registro', { ascending: true })

        if (progressoData && progressoData.length > 0) {
          setHistoricoPeso(progressoData)
        } else if (profile?.peso) {
          // Fallback: mostra apenas o peso atual como um ponto
          setHistoricoPeso([{ 
            data_registro: new Date().toISOString().split('T')[0], 
            peso: profile.peso 
          }])
        }

      } catch (err) {
        console.error('Erro ao carregar dados de progresso:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Helper para verificar se treinou em um dia específico (para o calendário semanal)
  const checkTreinoDia = (dateOffset: number) => {
    const d = new Date()
    d.setDate(d.getDate() - dateOffset) // Hoje, Ontem, etc.
    const dateStr = d.toISOString().split('T')[0]
    return historicoTreinos.some(t => t.data_treino === dateStr)
  }

  // Gerar dias da semana atual para o gráfico
  const diasSemana = []
  const hoje = new Date()
  const diaSemana = hoje.getDay() // 0 = Dom, 1 = Seg...
  
  // Começar do Domingo da semana atual
  const inicioSemana = new Date(hoje)
  inicioSemana.setDate(hoje.getDate() - diaSemana)

  for (let i = 0; i < 7; i++) {
    const d = new Date(inicioSemana)
    d.setDate(inicioSemana.getDate() + i)
    diasSemana.push({
      nome: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
      data: d.toISOString().split('T')[0],
      treinou: historicoTreinos.some(t => t.data_treino === d.toISOString().split('T')[0])
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seu Progresso</h1>
              <p className="text-gray-600">Acompanhe sua evolução no FIT450</p>
            </div>
            <div className="flex gap-2">
              {periodos.map((periodo) => (
                <Button
                  key={periodo.id}
                  variant={periodoSelecionado === periodo.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriodoSelecionado(periodo.id)}
                >
                  {periodo.nome}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards principais de progresso */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Dias Consecutivos</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.diasConsecutivos}</div>
              <p className="text-xs text-blue-700">dias seguidos</p>
              <Progress value={Math.min(100, (stats.diasConsecutivos / 30) * 100)} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Total de Treinos</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{stats.totalTreinos}</div>
              <p className="text-xs text-green-700">treinos completos</p>
              <Progress value={Math.min(100, (stats.totalTreinos / 50) * 100)} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Tempo Total</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{Math.floor(stats.tempoTotal / 60)}h</div>
              <p className="text-xs text-purple-700">{stats.tempoTotal % 60} minutos</p>
              <Progress value={Math.min(100, (stats.tempoTotal / 6000) * 100)} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">Nível Atual</CardTitle>
              <Award className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 truncate" title={stats.nivelAtual}>
                {stats.nivelAtual}
              </div>
              <p className="text-xs text-orange-700">
                {stats.diasNoNivel} / 3 dias para avançar
              </p>
              <Progress value={stats.progressoProximoNivel} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Evolução Corporal */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              Evolução Corporal
            </CardTitle>
            <CardDescription>Acompanhe seu histórico de peso</CardDescription>
          </CardHeader>
          <CardContent>
            {historicoPeso.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {historicoPeso.map((registro, index) => {
                  const anterior = index > 0 ? historicoPeso[index - 1].peso : registro.peso
                  const diff = registro.peso - anterior
                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        {new Date(registro.data_registro).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-gray-900">{registro.peso} kg</span>
                        {index > 0 && (
                          <span className={`text-sm mb-1 ${diff <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum registro de peso encontrado. Atualize seu perfil para acompanhar sua evolução.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metas e objetivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Suas Metas
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso das suas metas (Simulado)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMetas.map((meta) => (
                  <div key={meta.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{meta.titulo}</span>
                      <span className="text-gray-500">{meta.progresso}%</span>
                    </div>
                    <Progress value={meta.progresso} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas de exercícios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Exercícios do 5BX
              </CardTitle>
              <CardDescription>
                Seus exercícios (Frequência baseada em treinos completos)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockExercicios.map((exercicio, index) => (
                  <div key={exercicio.nome} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium">{exercicio.nome}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{stats.totalTreinos}x</div>
                      <div className="text-xs text-gray-500">treinos</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de progresso semanal */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Progresso Semanal
            </CardTitle>
            <CardDescription>
              Dias que você treinou nesta semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {diasSemana.map((dia) => (
                <div key={dia.nome} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{dia.nome}</div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto ${
                    dia.treinou ? 'bg-green-500' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {dia.treinou ? '✓' : ''}
                  </div>
                  {/* <div className="text-[10px] text-gray-400 mt-1">{dia.data.split('-')[2]}/{dia.data.split('-')[1]}</div> */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
