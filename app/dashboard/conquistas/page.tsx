'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Award, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  Lock,
  BarChart3
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getLevelByIndex } from '@/lib/5bx-logic'

type Conquista = {
  id: number
  titulo: string
  descricao: string
  icone: string
  desbloqueada: boolean
  progresso: number
  meta?: number
  atual?: number
  dataDesbloqueio?: string
}

const initialConquistas: Conquista[] = [
  {
    id: 1,
    titulo: 'Primeiro Treino',
    descricao: 'Complete seu primeiro treino 5BX',
    icone: '🎯',
    desbloqueada: false,
    progresso: 0,
    meta: 1,
    atual: 0
  },
  {
    id: 2,
    titulo: 'Semana Completa',
    descricao: 'Treine por 7 dias consecutivos',
    icone: '🏆',
    desbloqueada: false,
    progresso: 0,
    meta: 7,
    atual: 0
  },
  {
    id: 3,
    titulo: 'Mestre dos 5BX',
    descricao: 'Complete 30 treinos no total',
    icone: '⭐',
    desbloqueada: false,
    progresso: 0,
    meta: 30,
    atual: 0
  },
  {
    id: 4,
    titulo: 'Maratonista',
    descricao: 'Acumule 10 horas de exercícios',
    icone: '⏰',
    desbloqueada: false,
    progresso: 0,
    meta: 600, // 10 horas em minutos
    atual: 0
  },
  {
    id: 5,
    titulo: 'Perseverante',
    descricao: 'Mantenha uma sequência de 14 dias',
    icone: '🔥',
    desbloqueada: false,
    progresso: 0,
    meta: 14,
    atual: 0
  },
  {
    id: 6,
    titulo: 'Especialista em Flexões',
    descricao: 'Realize 500 flexões no total',
    icone: '💪',
    desbloqueada: false,
    progresso: 0,
    meta: 500,
    atual: 0 // Ainda não temos contagem de exercícios individuais, então ficará 0
  }
]

const niveisBase = [
  {
    id: 1,
    nome: 'Iniciante',
    descricao: 'Começando sua jornada fitness (Chart 1)',
    cor: 'bg-green-500',
    icone: '🌱',
    minChart: 1
  },
  {
    id: 2,
    nome: 'Intermediário',
    descricao: 'Já tem prática com exercícios (Chart 2)',
    cor: 'bg-blue-500',
    icone: '🚀',
    minChart: 2
  },
  {
    id: 3,
    nome: 'Avançado',
    descricao: 'Domina os exercícios 5BX (Chart 3)',
    cor: 'bg-purple-500',
    icone: '⭐',
    minChart: 3
  },
  {
    id: 4,
    nome: 'Especialista',
    descricao: 'Expert em fitness e saúde (Chart 4)',
    cor: 'bg-orange-500',
    icone: '🔥',
    minChart: 4
  },
  {
    id: 5,
    nome: 'Mestre 5BX',
    descricao: 'Mestre absoluto do sistema 5BX (Chart 5+)',
    cor: 'bg-red-500',
    icone: '👑',
    minChart: 5
  }
]

export default function Conquistas() {
  const [conquistas, setConquistas] = useState<Conquista[]>(initialConquistas)
  const [nivelAtualIndex, setNivelAtualIndex] = useState(0) // Index do 5BX (0-based)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Carregar Perfil (para saber o nível atual)
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('nivel_atual_index')
          .eq('id', user.id)
          .maybeSingle()

        if (profile) {
          setNivelAtualIndex(profile.nivel_atual_index || 0)
        }

        // 2. Carregar Treinos (para calcular conquistas)
        const { data: treinos } = await supabase
          .from('treinos')
          .select('data_treino, tempo_total_segundos, completado')
          .eq('user_id', user.id)
          .eq('completado', true)
          .order('data_treino', { ascending: false }) // Mais recente primeiro

        if (treinos) {
          const totalTreinos = treinos.length
          const totalMinutos = Math.floor(treinos.reduce((acc, t) => acc + (t.tempo_total_segundos || 0), 0) / 60)
          
          // Calcular Sequência (Streak)
          let currentStreak = 0
          if (treinos.length > 0) {
            // Usar Set para datas únicas
            const uniqueDates = Array.from(new Set(treinos.map(t => t.data_treino.split('T')[0]))).sort().reverse()
            
            const hoje = new Date().toISOString().split('T')[0]
            const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0]
            
            // Se o treino mais recente for hoje ou ontem, a sequência está ativa
            if (uniqueDates[0] === hoje || uniqueDates[0] === ontem) {
              currentStreak = 1
              for (let i = 0; i < uniqueDates.length - 1; i++) {
                const d1 = new Date(uniqueDates[i])
                const d2 = new Date(uniqueDates[i+1])
                const diffTime = Math.abs(d1.getTime() - d2.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                
                if (diffDays === 1) {
                  currentStreak++
                } else {
                  break
                }
              }
            }
          }

          // Atualizar Conquistas
          setConquistas(prev => prev.map(c => {
            let novoAtual = 0
            let desbloqueada = false
            let dataDesbloqueio = c.dataDesbloqueio

            switch(c.id) {
              case 1: // Primeiro Treino
                novoAtual = totalTreinos
                desbloqueada = totalTreinos >= 1
                break
              case 2: // Semana Completa (7 dias seguidos)
                novoAtual = currentStreak
                desbloqueada = currentStreak >= 7
                break
              case 3: // Mestre dos 5BX (30 treinos)
                novoAtual = totalTreinos
                desbloqueada = totalTreinos >= 30
                break
              case 4: // Maratonista (600 min)
                novoAtual = totalMinutos
                desbloqueada = totalMinutos >= 600
                break
              case 5: // Perseverante (14 dias seguidos)
                novoAtual = currentStreak
                desbloqueada = currentStreak >= 14
                break
              case 6: // Flexões (Placeholder)
                novoAtual = 0 
                desbloqueada = false
                break
            }

            // Preservar data se já estava desbloqueada
            if (desbloqueada && !c.desbloqueada) {
              dataDesbloqueio = new Date().toISOString().split('T')[0]
            }

            const meta = c.meta || 1
            const progresso = Math.min(100, (novoAtual / meta) * 100)

            return {
              ...c,
              atual: novoAtual,
              desbloqueada,
              progresso,
              dataDesbloqueio
            }
          }))
        }

      } catch (err) {
        console.error('Erro ao carregar conquistas:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Determinar nível gamificado baseado no Chart atual
  const chartInfo = getLevelByIndex(nivelAtualIndex)
  const currentChart = chartInfo.chart
  
  // Encontrar o nível gamificado correspondente
  // Iniciante (Chart 1) -> index 0
  // Intermediário (Chart 2) -> index 1
  // ...
  // Se chart > 5, usa o último (Mestre)
  const gamifiedLevelIndex = Math.min(currentChart - 1, niveisBase.length - 1)
  const nivelAtual = niveisBase[gamifiedLevelIndex]
  const proximoNivel = niveisBase[Math.min(gamifiedLevelIndex + 1, niveisBase.length - 1)]
  
  // Calcular progresso dentro do nível gamificado
  // Simplificação: vamos considerar que cada "Nível Gamificado" dura 1 Chart inteiro.
  // O progresso é baseado em quão longe estamos dentro do Chart atual (A, B, C, D...)
  // Chart 1 tem 12 subníveis (D-, D, D+ ... A+)
  // nivelAtualIndex é o indice global.
  // Precisamos saber onde começa o Chart atual e onde termina.
  
  // Mas para simplificar visualmente, vamos fixar em 50% se estiver no meio, ou usar uma lógica simples
  // Se já estamos no último nível, progresso 100%
  const isMaxLevel = gamifiedLevelIndex === niveisBase.length - 1
  const progressoNivel = isMaxLevel ? 100 : 50 // Placeholder visual simples por enquanto

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conquistas e Níveis</h1>
          <p className="text-gray-600">Acompanhe suas conquistas e evolução no FIT450</p>
        </div>

        {/* Seção de Nível Atual */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-6 w-6 text-orange-600" />
              Seu Nível Atual: {chartInfo.level}{chartInfo.subLevel} (Chart {chartInfo.chart})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 ${nivelAtual.cor} rounded-full flex items-center justify-center text-2xl`}>
                {nivelAtual.icone}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{nivelAtual.nome}</h3>
                <p className="text-gray-600">{nivelAtual.descricao}</p>
              </div>
            </div>
            
            {!isMaxLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rumo ao nível {proximoNivel.nome}</span>
                  {/* <span>{progressoNivel}%</span> */}
                </div>
                <Progress 
                  value={progressoNivel} 
                  className="h-3" 
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seção de Conquistas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Suas Conquistas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
               <div className="col-span-3 text-center py-12">Carregando conquistas...</div>
            ) : conquistas.map((conquista) => (
              <Card 
                key={conquista.id} 
                className={conquista.desbloqueada 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50 opacity-75'
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{conquista.icone}</div>
                    {conquista.desbloqueada ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Desbloqueada
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Lock className="h-3 w-3 mr-1" />
                        Bloqueada
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{conquista.titulo}</CardTitle>
                  <CardDescription>{conquista.descricao}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  {!conquista.desbloqueada && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>
                          {conquista.atual} / {conquista.meta}
                        </span>
                      </div>
                      <Progress value={conquista.progresso} className="h-2" />
                    </div>
                  )}
                  
                  {conquista.desbloqueada && conquista.dataDesbloqueio && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Calendar className="h-4 w-4" />
                      <span>Desbloqueado em {conquista.dataDesbloqueio}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Seção de Próximos Níveis */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Próximos Níveis
          </h2>
          
          <div className="space-y-4">
            {niveisBase.map((nivel, idx) => {
              if (idx <= gamifiedLevelIndex) return null // Mostrar apenas próximos
              
              return (
                <Card key={nivel.id} className="border-gray-200">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`w-12 h-12 ${nivel.cor} rounded-full flex items-center justify-center text-xl opacity-50`}>
                      {nivel.icone}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{nivel.nome}</h3>
                      <p className="text-sm text-gray-600">{nivel.descricao}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-500">
                          Requer alcançar Chart {nivel.minChart}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Bloqueado</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {isMaxLevel && (
              <p className="text-gray-500 italic">Você alcançou o nível máximo! Continue treinando para manter sua forma.</p>
            )}
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Estatísticas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {conquistas.filter(c => c.desbloqueada).length}
                </div>
                <div className="text-sm text-gray-500">Conquistas Desbloqueadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {conquistas.filter(c => !c.desbloqueada).length}
                </div>
                <div className="text-sm text-gray-500">Conquistas Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {nivelAtual.nome}
                </div>
                <div className="text-sm text-gray-500">Nível Atual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {chartInfo.chart}
                </div>
                <div className="text-sm text-gray-500">Chart Atual</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
