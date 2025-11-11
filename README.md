# Mini CRM - Sistema de Gestão de Leads

Sistema completo de CRM para gerenciamento de leads com pipeline de vendas estilo Kanban. Desenvolvido com React, TypeScript e Supabase.

## 🚀 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Pipeline Kanban com 7 estágios de vendas
- ✅ Cadastro e edição de leads
- ✅ Importação/exportação de leads via planilha CSV
- ✅ Filtros avançados (nome, estágio, data, origem)
- ✅ Histórico completo de interações
- ✅ Interface responsiva para mobile e desktop

## 🛠️ Tecnologias

- React 18
- TypeScript
- Vite
- Supabase (PostgreSQL)
- React Router
- Lucide Icons

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase (gratuita)

## 🔧 Instalação Local

1. Clone o repositório:

```bash
git clone https://github.com/denioliver/Mini-CRM---Sistema-de-Gest-o-de-Leads-.git
cd mini-crm
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
# Crie um arquivo .env na raiz do projeto
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Execute o schema do banco de dados no Supabase:

   - Acesse seu projeto no Supabase
   - Vá em SQL Editor
   - Execute o arquivo `database/schema.sql`
   - Execute o arquivo `database/disable-rls.sql`

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 🚀 Deploy em Produção

### Opção 1: Deploy no Vercel (Recomendado)

1. **Prepare o projeto:**

```bash
# Certifique-se de que está na branch main
git checkout main
git pull origin main
```

2. **Acesse o Vercel:**

   - Vá para [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em "Add New" → "Project"

3. **Importe o repositório:**

   - Selecione seu repositório `Mini-CRM---Sistema-de-Gest-o-de-Leads-`
   - Configure o projeto:
     - **Framework Preset**: Vite
     - **Root Directory**: `./`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

4. **Configure as variáveis de ambiente:**

   - Em "Environment Variables", adicione:
     - `VITE_SUPABASE_URL` = sua URL do Supabase
     - `VITE_SUPABASE_ANON_KEY` = sua chave anônima do Supabase

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build (2-3 minutos)
   - Seu app estará disponível em `https://seu-app.vercel.app`

### Opção 2: Deploy no Netlify

1. **Prepare o projeto:**

```bash
# Crie um arquivo netlify.toml na raiz
touch netlify.toml
```

2. **Configure o netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. **Faça commit:**

```bash
git add netlify.toml
git commit -m "Add Netlify configuration"
git push origin main
```

4. **Deploy no Netlify:**
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "Add new site" → "Import an existing project"
   - Conecte com GitHub e selecione seu repositório
   - Configure:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Adicione as variáveis de ambiente:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Clique em "Deploy"

### Opção 3: Deploy no Railway

1. **Acesse o Railway:**

   - Vá para [railway.app](https://railway.app)
   - Faça login com GitHub

2. **Crie um novo projeto:**

   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha seu repositório

3. **Configure:**
   - Railway detectará automaticamente que é um projeto Vite
   - Adicione as variáveis de ambiente no painel
   - O deploy será automático

### Opção 4: Deploy Manual (VPS/Servidor)

1. **Build do projeto:**

```bash
npm run build
```

2. **Configure o servidor (Nginx exemplo):**

```nginx
server {
    listen 80;
    server_name seudominio.com;

    root /var/www/mini-crm/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Upload dos arquivos:**

```bash
# Na sua máquina local
scp -r dist/* usuario@seu-servidor:/var/www/mini-crm/dist/
```

## 🔒 Configuração do Supabase para Produção

1. **Acesse seu projeto no Supabase**

2. **Configure as políticas RLS (Row Level Security):**

   - Se quiser habilitar segurança por usuário, execute `database/fix-rls-policies.sql`
   - Para ambiente de desenvolvimento, pode manter `disable-rls.sql`

3. **Adicione o domínio à lista de URLs permitidas:**

   - Vá em Authentication → URL Configuration
   - Adicione seu domínio de produção (ex: `https://seu-app.vercel.app`)

4. **Configure CORS se necessário:**
   - Em Project Settings → API
   - Adicione seu domínio em "Allowed origins"

## 📱 Acessando a aplicação

Após o deploy, você poderá:

1. Criar uma conta de usuário
2. Fazer login
3. Adicionar leads manualmente ou via importação CSV
4. Gerenciar o pipeline de vendas
5. Acompanhar interações e histórico

## 🆘 Troubleshooting

**Erro de CORS:**

- Verifique se adicionou o domínio nas configurações do Supabase

**Erro 404 ao navegar:**

- Configure o redirect para `index.html` (veja exemplos acima)

**Build falha:**

- Verifique se todas as variáveis de ambiente estão configuradas
- Execute `npm run build` localmente para testar

**Banco de dados vazio:**

- Execute os scripts SQL do diretório `database/` no Supabase

## 📝 Licença

MIT

## 👨‍💻 Autor

Desenvolvido por [denioliver](https://github.com/denioliver)
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
