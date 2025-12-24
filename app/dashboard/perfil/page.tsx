'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Save, Scale, Ruler, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Perfil() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dados, setDados] = useState({
    nome: '',
    dataNascimento: '',
    peso: 0,
    altura: 0
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (error) throw error

        if (profile) {
          setDados({
            nome: profile.nome || '',
            dataNascimento: profile.data_nascimento || '',
            peso: profile.peso || 0,
            altura: profile.altura || 0
          })
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDados(prev => ({
      ...prev,
      [name]: name === 'peso' || name === 'altura' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // 1. Atualizar perfil
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          nome: dados.nome,
          data_nascimento: dados.dataNascimento || null,
          peso: dados.peso,
          altura: dados.altura,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // 2. Registrar histórico (evolução)
      // Só registra se tiver peso e altura válidos
      if (dados.peso > 0 && dados.altura > 0) {
        const { error: progressError } = await supabase
          .from('progresso_usuario')
          .insert({
            user_id: user.id,
            data_registro: new Date().toISOString().split('T')[0],
            peso: dados.peso,
            altura: dados.altura,
            medidas: {
              imc: parseFloat(calcularIMC(dados.peso, dados.altura))
            }
          })

        if (progressError) console.error('Erro ao salvar histórico:', progressError)
      }
      
      alert('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  // Calcular idade
  const calcularIdade = (dataNasc: string) => {
    if (!dataNasc) return 0
    const hoje = new Date()
    const nasc = new Date(dataNasc)
    let idade = hoje.getFullYear() - nasc.getFullYear()
    const m = hoje.getMonth() - nasc.getMonth()
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--
    }
    return idade
  }

  const calcularIMC = (peso: number, altura: number) => {
    if (!peso || !altura || altura <= 0) return '0.0'
    const alturaMetros = altura / 100
    return (peso / (alturaMetros * alturaMetros)).toFixed(1)
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e medidas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda - Resumo */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle>{dados.nome}</CardTitle>
                <CardDescription>Membro desde Dez 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-semibold">Idade</div>
                    <div className="text-xl font-bold text-gray-900">{calcularIdade(dados.dataNascimento)} anos</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-semibold">IMC</div>
                    <div className="text-xl font-bold text-gray-900">{calcularIMC(dados.peso, dados.altura)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium">Peso</span>
                  </div>
                  <span className="font-bold">{dados.peso} kg</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Ruler className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Altura</span>
                  </div>
                  <span className="font-bold">{dados.altura} cm</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Direita - Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações para manter seu acompanhamento preciso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="nome"
                          name="nome"
                          value={dados.nome}
                          onChange={handleChange}
                          className="pl-9"
                          placeholder="Seu nome"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="dataNascimento"
                          name="dataNascimento"
                          type="date"
                          value={dados.dataNascimento}
                          onChange={handleChange}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="peso">Peso (kg)</Label>
                      <div className="relative">
                        <Scale className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="peso"
                          name="peso"
                          type="number"
                          step="0.1"
                          value={dados.peso}
                          onChange={handleChange}
                          className="pl-9"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="altura">Altura (cm)</Label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="altura"
                          name="altura"
                          type="number"
                          step="1"
                          value={dados.altura}
                          onChange={handleChange}
                          className="pl-9"
                          placeholder="175"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                    <Calendar className="h-5 w-5 flex-shrink-0" />
                    <p>
                      Ao salvar suas novas medidas, um registro histórico será criado automaticamente para acompanhar sua evolução.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving} className="w-full md:w-auto">
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          Salvando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Salvar Alterações
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
