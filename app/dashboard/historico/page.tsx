'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award, 
  CheckCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

type ExercicioHistorico = {
  nome: string
  repeticoes: number
  duracao: number
}

type TreinoHistorico = {
  id: number
  data: string
  duracao: number
  nivel: string
  completado: boolean
  exercicios: ExercicioHistorico[]
}

export default function Historico() {
  const [loading, setLoading] = useState(true)
  const [historico, setHistorico] = useState<TreinoHistorico[]>([])
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth())
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear())
  const [filtroStatus, setFiltroStatus] = useState('todos')

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const statusFiltros = [
    { id: 'todos', nome: 'Todos' },
    { id: 'completados', nome: 'Completados' },
    { id: 'pendentes', nome: 'Pendentes' }
  ]

  useEffect(() => {
    async function loadTreinos() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: treinosData, error } = await supabase
          .from('treinos')
          .select('*')
          .eq('user_id', user.id)
          .order('data_treino', { ascending: false })

        if (error) throw error

        if (treinosData) {
          const formattedTreinos: TreinoHistorico[] = treinosData.map(t => ({
            id: t.id,
            data: t.data_treino,
            duracao: Math.round((t.tempo_total_segundos || 0) / 60),
            nivel: 'Geral', // Como não salvamos o nível histórico ainda, usamos um placeholder
            completado: t.completado,
            exercicios: [] // Não temos detalhes dos exercícios por enquanto
          }))
          setHistorico(formattedTreinos)
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTreinos()
  }, [])

  const treinosFiltrados = historico.filter(treino => {
    // Ajuste para lidar com timezone se necessário, mas string YYYY-MM-DD funciona bem com split
    const [ano, mes, dia] = treino.data.split('-').map(Number)
    // Nota: data_treino vem como YYYY-MM-DD. O mês no JS é 0-indexado (0=Jan).
    // O split retorna o mês "humano" (1=Jan). Então subtraímos 1.
    
    const mesCorreto = (mes - 1) === mesSelecionado
    const anoCorreto = ano === anoSelecionado
    
    if (!mesCorreto || !anoCorreto) return false
    
    if (filtroStatus === 'completados') return treino.completado
    if (filtroStatus === 'pendentes') return !treino.completado
    
    return true
  })

  const formatarData = (dataString: string) => {
    // Adiciona T12:00:00 para evitar problemas de fuso horário ao converter string de data pura
    const data = new Date(dataString + 'T12:00:00')
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    if (direcao === 'anterior') {
      if (mesSelecionado === 0) {
        setMesSelecionado(11)
        setAnoSelecionado(anoSelecionado - 1)
      } else {
        setMesSelecionado(mesSelecionado - 1)
      }
    } else {
      if (mesSelecionado === 11) {
        setMesSelecionado(0)
        setAnoSelecionado(anoSelecionado + 1)
      } else {
        setMesSelecionado(mesSelecionado + 1)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Treinos</h1>
          <p className="text-gray-600">Visualize todos os seus treinos anteriores</p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Navegação de mês */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navegarMes('anterior')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <div className="font-medium">{meses[mesSelecionado]}</div>
                  <div className="text-sm text-gray-500">{anoSelecionado}</div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navegarMes('proximo')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Filtro por status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex gap-2">
                  {statusFiltros.map((status) => (
                    <Button
                      key={status.id}
                      variant={filtroStatus === status.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFiltroStatus(status.id)}
                    >
                      {status.nome}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Estatísticas rápidas */}
              <div className="text-right">
                <div className="text-sm text-gray-500">Treinos neste mês</div>
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : treinosFiltrados.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de treinos */}
        <div className="space-y-4">
          {loading ? (
             <div className="text-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-gray-500">Carregando histórico...</p>
             </div>
          ) : treinosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum treino encontrado
                </h3>
                <p className="text-gray-500">
                  {filtroStatus === 'pendentes' 
                    ? 'Nenhum treino pendente neste período'
                    : 'Nenhum treino realizado neste período'}
                </p>
              </CardContent>
            </Card>
          ) : (
            treinosFiltrados.map((treino) => (
              <Card key={treino.id} className={treino.completado ? 'border-green-200' : 'border-red-200'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        treino.completado ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {treino.completado ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Calendar className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {formatarData(treino.data)}
                        </CardTitle>
                        <CardDescription>
                          {treino.completado ? 'Treino completado' : 'Treino não realizado'}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={treino.completado ? 'default' : 'secondary'}>
                      {treino.completado ? 'Completado' : 'Pendente'}
                    </Badge>
                  </div>
                </CardHeader>
                
                {treino.completado && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {treino.duracao} minutos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Nível {treino.nivel}
                        </span>
                      </div>
                      {/* Ocultando contagem de exercícios pois ainda não rastreamos detalhes */}
                      {treino.exercicios.length > 0 && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {treino.exercicios.length} exercícios
                          </span>
                        </div>
                      )}
                    </div>

                    {treino.exercicios.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Exercícios realizados:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {treino.exercicios.map((exercicio, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm font-medium">{exercicio.nome}</span>
                              <div className="text-right">
                                <div className="text-sm font-semibold">{exercicio.repeticoes}x</div>
                                <div className="text-xs text-gray-500">{exercicio.duracao}s</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Resumo mensal */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumo de {meses[mesSelecionado]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {treinosFiltrados.filter(t => t.completado).length}
                </div>
                <div className="text-sm text-gray-500">Treinos Completos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {treinosFiltrados.filter(t => !t.completado).length}
                </div>
                <div className="text-sm text-gray-500">Treinos Perdidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {treinosFiltrados.reduce((acc, t) => acc + (t.duracao || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Minutos Totais</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {treinosFiltrados.length > 0 
                    ? Math.round((treinosFiltrados.filter(t => t.completado).length / treinosFiltrados.length) * 100) 
                    : 0}%
                </div>
                <div className="text-sm text-gray-500">Taxa de Conclusão</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
