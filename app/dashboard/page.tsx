'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Calendar, TrendingUp, Trophy, Clock, Target } from 'lucide-react'
import DashboardLayout from '@/components/dashboard-layout'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getLevelByIndex } from '@/lib/5bx-logic'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [treinosHoje, setTreinosHoje] = useState(0)
  const [streakDias, setStreakDias] = useState(0)
  const [nivelAtualLabel, setNivelAtualLabel] = useState('Iniciante')
  const [tempoTotalMin, setTempoTotalMin] = useState(0)

  const hojeStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        const [{ data: profile }, { data: treinosData }] = await Promise.all([
          supabase
            .from('user_profiles')
            .select('nivel_atual_index, dias_no_nivel')
            .eq('id', user.id)
            .maybeSingle(),
          supabase
            .from('treinos')
            .select('data_treino, tempo_total_segundos, completado')
            .eq('user_id', user.id)
            .eq('completado', true)
            .order('data_treino', { ascending: false })
        ])

        if (profile) {
          const levelConfig = getLevelByIndex(profile.nivel_atual_index || 0)
          setNivelAtualLabel(`Chart ${levelConfig.chart} - ${levelConfig.level}${levelConfig.subLevel}`)
        } else {
          setNivelAtualLabel('Iniciante')
        }

        const treinos = (treinosData as Array<{ data_treino: string, tempo_total_segundos: number | null, completado: boolean | null }>) || []

        setTreinosHoje(treinos.filter(t => t.data_treino === hojeStr).length)

        const totalSegundos = treinos.reduce((acc, t) => acc + (t.tempo_total_segundos || 0), 0)
        setTempoTotalMin(Math.floor(totalSegundos / 60))

        let streak = 0
        if (treinos.length > 0) {
          const uniqueDates = Array.from(new Set(treinos.map(t => t.data_treino))).sort().reverse()
          const today = hojeStr
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

          if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
            streak = 1
            for (let i = 0; i < uniqueDates.length - 1; i++) {
              const d1 = new Date(uniqueDates[i] + 'T12:00:00')
              const d2 = new Date(uniqueDates[i + 1] + 'T12:00:00')
              const diffTime = Math.abs(d1.getTime() - d2.getTime())
              const diffDays = Math.ceil(diffTime / 86400000)

              if (diffDays === 1) {
                streak++
              } else {
                break
              }
            }
          }
        }
        setStreakDias(streak)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [router, hojeStr])

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Acompanhe seus progressos nos exercícios 5BX</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Treinos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{loading ? '...' : treinosHoje}</div>
              <p className="text-xs text-blue-700">Complete seu treino diário</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Sequência</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{loading ? '...' : `${streakDias} dias`}</div>
              <p className="text-xs text-green-700">Mantenha a consistência</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Nível Atual</CardTitle>
              <Trophy className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{loading ? '...' : nivelAtualLabel}</div>
              <p className="text-xs text-purple-700">Comece sua jornada</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">Tempo Total</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{loading ? '...' : `${tempoTotalMin} min`}</div>
              <p className="text-xs text-orange-700">Tempo de exercício</p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de ação rápida */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-orange-600" />
                Iniciar Treino
              </CardTitle>
              <CardDescription>
                Comece seu treino diário de 5BX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/treinar" className="w-full">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  Começar Agora
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Definir Meta
              </CardTitle>
              <CardDescription>
                Estabeleça seus objetivos de fitness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Configurar Metas
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>O Sistema 5BX oficial</CardTitle>
            <CardDescription>
              Cinco exercícios: quatro de calistenia e um aeróbico, em 11 minutos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                <h3 className="font-semibold text-blue-900 mb-1">Flexão de tronco</h3>
                <p className="text-sm text-blue-700">Alongamento em pé tocando os pés</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-2">2</div>
                <h3 className="font-semibold text-green-900 mb-1">Abdominais</h3>
                <p className="text-sm text-green-700">Fortalecimento do core</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                <h3 className="font-semibold text-purple-900 mb-1">Extensão lombar</h3>
                <p className="text-sm text-purple-700">Elevação do tronco em decúbito ventral</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
                <div className="text-2xl font-bold text-orange-600 mb-2">4</div>
                <h3 className="font-semibold text-orange-900 mb-1">Flexões de braço</h3>
                <p className="text-sm text-orange-700">Fortalecimento de peito e braços</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                <div className="text-2xl font-bold text-red-600 mb-2">5</div>
                <h3 className="font-semibold text-red-900 mb-1">Corrida no lugar</h3>
                <p className="text-sm text-red-700">Aeróbico para capacidade cardiorrespiratória</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
