# FIT450 - Sistema 5BX

Sistema de exercícios baseado no método 5BX (5 Basic Exercises) desenvolvido com Next.js, Supabase e TypeScript.

## 🚀 Tecnologias

- **Frontend:** Next.js 15 com App Router
- **Backend/Auth/DB:** Supabase
- **Estilização:** Tailwind CSS
- **Componentes UI:** Componentes customizados baseados em Radix UI
- **Deploy:** Vercel

## 📋 Funcionalidades

- ✅ Autenticação completa (login/cadastro)
- ✅ Dashboard personalizado
- ✅ Sistema de exercícios 5BX
- ✅ Progresso e estatísticas
- ✅ Interface em Português (Brasil)

## 🛠️ Configuração Local

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/fit450.git
cd fit450
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
```

### 4. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute a migration SQL em `supabase/migrations/20241219000000_initial_schema.sql`
3. Configure as políticas de segurança (RLS)
4. Obtenha as chaves de API e configure no `.env.local`

### 5. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Deploy na Vercel

### 1. Configure o repositório no GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/fit450.git
git push -u origin main
```

### 2. Configure na Vercel

1. Acesse [Vercel](https://vercel.com)
2. Importe seu repositório do GitHub
3. Configure as variáveis de ambiente
4. Faça o deploy

## 🎯 Sistema 5BX

O FIT450 implementa o sistema 5BX com 5 exercícios básicos:

1. **Polichinelos** - Aquecimento cardiovascular
2. **Abdominais** - Fortalecimento do core
3. **Flexões** - Fortalecimento superior
4. **Agachamentos** - Fortalecimento inferior
5. **Corrida estacionária** - Cardiovascular final

## 📁 Estrutura do Projeto

```
fit450/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Páginas do dashboard
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   └── ui/               # Componentes UI
├── hooks/                # Custom hooks
│   └── use-auth.ts       # Hook de autenticação
├── lib/                  # Utilitários e configurações
│   ├── supabase.ts       # Configuração do Supabase
│   └── utils.ts          # Utilitários
├── middleware.ts         # Middleware de autenticação
├── supabase/             # Configurações do Supabase
│   └── migrations/       # Migrations SQL
└── vercel.json           # Configuração do Vercel
```

## 🔒 Segurança

- Row Level Security (RLS) configurado
- Autenticação via Supabase Auth
- Proteção de rotas com middleware
- Variáveis de ambiente seguras

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autor

- **FIT450 Team** - Desenvolvimento inicial

## 🙏 Agradecimentos

- Sistema 5BX original
- Comunidade Supabase
- Next.js e Vercel