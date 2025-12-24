'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Zap,
  Award,
  Users,
  Star
} from 'lucide-react'

const atividadesRecentes = [
  {
    id: 1,
    tipo: 'treino_completado',
    titulo: 'Treino 5BX Completado!',
    descricao: 'Você completou todos os 5 exercícios do dia',
    hora: '2 horas atrás',
    icone: '🏆',
    cor: 'bg-green-100 text-green-800'
  },
  {
    id: 2,
    tipo: 'conquista',
    titulo: 'Nova Conquista Desbloqueada!',
    descricao: 'Semana Completa - 7 dias de treino consecutivos',
    hora: '1 dia atrás',
    icone: '⭐',
    cor: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 3,
    tipo: 'progresso',
    titulo: 'Progresso de Nível',
    descricao: 'Você está a 350 XP do próximo nível',
    hora: '2 dias atrás',
    icone: '📈',
    cor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 4,
    tipo: 'meta_alcancada',
    titulo: 'Meta Diária Alcançada',
    descricao: 'Você completou sua meta de 30 minutos de exercício',
    hora: '3 dias atrás',
    icone: '🎯',
    cor: 'bg-purple-100 text-purple-800'
  },
  {
    id: 5,
    tipo: 'lembrete',
    titulo: 'Hora do Treino!',
    descricao: 'Não esqueça de fazer seu treino 5BX de hoje',
    hora: '4 dias atrás',
    icone: '⏰',
    cor: 'bg-orange-100 text-orange-800'
  }
]

const desafiosAtivos = [
  {
    id: 1,
    titulo: 'Desafio de 30 Dias',
    descricao: 'Complete 30 treinos em 30 dias',
    progresso: 50,
    meta: 30,
    atual: 15,
    premio: '500 XP + Emblema Especial',
    icone: '🔥',
    cor: 'bg-red-500'
  },
  {
    id: 2,
    titulo: 'Maratona de Flexões',
    descricao: 'Realize 1000 flexões este mês',
    progresso: 35,
    meta: 1000,
    atual: 350,
    premio: '300 XP + Título de Guerreiro',
    icone: '💪',
    cor: 'bg-blue-500'
  },
  {
    id: 3,
    titulo: 'Consistência Diária',
    descricao: 'Treine por 14 dias consecutivos',
    progresso: 50,
    meta: 14,
    atual: 7,
    premio: '200 XP + Medalha de Consistência',
    icone: '📅',
    cor: 'bg-green-500'
  }
]

const rankings = [
  {
    posicao: 1,
    nome: 'Você',
    pontuacao: 2450,
    nivel: 'Iniciante',
    avatar: '🏆',
    ehUsuario: true
  },
  {
    posicao: 2,
    nome: 'Maria Silva',
    pontuacao: 2380,
    nivel: 'Iniciante',
    avatar: '👩‍💼',
    ehUsuario: false
  },
  {
    posicao: 3,
    nome: 'João Santos',
    pontuacao: 2150,
    nivel: 'Iniciante',
    avatar: '👨‍💻',
    ehUsuario: false
  },
  {
    posicao: 4,
    nome: 'Ana Costa',
    pontuacao: 1980,
    nivel: 'Iniciante',
    avatar: '👩‍🎨',
    ehUsuario: false
  },
  {
    posicao: 5,
    nome: 'Carlos Oliveira',
    pontuacao: 1850,
    nivel: 'Iniciante',
    avatar: '👨‍🔬',
    ehUsuario: false
  }
]

export default function Atividades() {
  const [abaAtiva, setAbaAtiva] = useState('atividades')

  const abas = [
    { id: 'atividades', nome: 'Atividades', icone: Activity },
    { id: 'desafios', nome: 'Desafios', icone: Target },
    { id: 'ranking', nome: 'Ranking', icone: Users }
  ]

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Atividades</h1>
          <p className="text-gray-600">Fique por dentro das novidades e participe de desafios</p>
        </div>

        {/* Navegação de abas */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {abas.map((aba) => {
            const Icone = aba.icone
            return (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  abaAtiva === aba.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icone className="h-4 w-4" />
                {aba.nome}
              </button>
            )
          })}
        </div>

        {/* Conteúdo da aba Atividades */}
        {abaAtiva === 'atividades' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription>
                  Suas últimas ações e conquistas no FIT450
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atividadesRecentes.map((atividade) => (
                    <div key={atividade.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${atividade.cor}`}>
                        <span className="text-lg">{atividade.icone}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{atividade.titulo}</h4>
                        <p className="text-sm text-gray-600">{atividade.descricao}</p>
                        <p className="text-xs text-gray-500 mt-1">{atividade.hora}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Conteúdo da aba Desafios */}
        {abaAtiva === 'desafios' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Desafios Ativos
                </CardTitle>
                <CardDescription>
                  Participe de desafios para ganhar XP e conquistas especiais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {desafiosAtivos.map((desafio) => (
                    <div key={desafio.id} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-full ${desafio.cor} text-white`}>
                          <span className="text-2xl">{desafio.icone}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{desafio.titulo}</h4>
                          <p className="text-sm text-gray-600 mb-2">{desafio.descricao}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Award className="h-4 w-4" />
                            <span>{desafio.premio}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span>{desafio.atual} / {desafio.meta}</span>
                        </div>
                        <Progress value={desafio.progresso} className="h-2" />
                        <div className="text-xs text-gray-500 text-right">
                          {desafio.progresso}% completo
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Conteúdo da aba Ranking */}
        {abaAtiva === 'ranking' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Ranking de Líderes
                </CardTitle>
                <CardDescription>
                  Veja como você se compara com outros usuários do FIT450
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rankings.map((usuario) => (
                    <div 
                      key={usuario.posicao}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        usuario.ehUsuario 
                          ? 'bg-orange-50 border-2 border-orange-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        usuario.posicao === 1 ? 'bg-yellow-100 text-yellow-800' :
                        usuario.posicao === 2 ? 'bg-gray-100 text-gray-800' :
                        usuario.posicao === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {usuario.posicao}
                      </div>
                      
                      <div className="text-2xl">{usuario.avatar}</div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {usuario.nome}
                          {usuario.ehUsuario && <span className="ml-2 text-orange-600">(Você)</span>}
                        </h4>
                        <p className="text-sm text-gray-500">{usuario.nivel}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{usuario.pontuacao} XP</div>
                        <div className="text-xs text-gray-500">pontos</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Suas Estatísticas no Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">1º</div>
                    <div className="text-sm text-gray-500">Sua Posição</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2450</div>
                    <div className="text-sm text-gray-500">Seus Pontos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+150</div>
                    <div className="text-sm text-gray-500">Esta Semana</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}