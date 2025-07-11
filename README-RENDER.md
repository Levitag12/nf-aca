# Deploy no Render - TaskMaster

Este guia explica como fazer o deploy da aplicação TaskMaster no Render.

## Pré-requisitos

1. Conta no [Render](https://render.com)
2. Repositório Git com o código da aplicação

## Passos para Deploy

### 1. Preparar o Repositório

1. Faça upload do código para um repositório Git (GitHub, GitLab, etc.)
2. Certifique-se de que o arquivo `render.yaml` está na raiz do projeto

### 2. Criar o Banco de Dados

1. No dashboard do Render, clique em "New +"
2. Selecione "PostgreSQL"
3. Configure:
   - **Name**: `taskmaster-db`
   - **Database**: `taskmaster`
   - **User**: `taskmaster_user`
   - **Plan**: Free
4. Clique em "Create Database"
5. Anote a **Internal Database URL** que será gerada

### 3. Criar o Web Service

1. No dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório Git
4. Configure:
   - **Name**: `taskmaster-app`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 4. Configurar Variáveis de Ambiente

No painel do Web Service, vá para "Environment" e adicione:

- **DATABASE_URL**: Cole a Internal Database URL do banco criado no passo 2
- **FRONTEND_URL**: `https://taskmaster-app.onrender.com` (substitua pelo nome do seu serviço)
- **NODE_ENV**: `production`

### 5. Deploy

1. Clique em "Create Web Service"
2. O Render fará automaticamente:
   - Build do frontend (React)
   - Build do backend (Node.js/TypeScript)
   - Deploy da aplicação

### 6. Inicializar o Banco de Dados

Após o deploy bem-sucedido:

1. Acesse: `https://seu-app.onrender.com/api/seed-database?secret=G147G147G147`
2. Isso criará o usuário admin inicial

## Credenciais Padrão

- **Usuário**: admin
- **Senha**: senha123

## Estrutura do Projeto

- `/client` - Frontend React com Vite
- `/server` - Backend Node.js com Express
- `/shared` - Schemas compartilhados (Drizzle ORM)

## Troubleshooting

### Build Falha
- Verifique se todas as dependências estão no `package.json`
- Confirme se o comando de build está correto

### Erro de Conexão com Banco
- Verifique se a `DATABASE_URL` está configurada corretamente
- Confirme se o banco PostgreSQL está rodando

### CORS Error
- Verifique se a `FRONTEND_URL` está configurada com a URL correta do Render

## Atualizações

Para atualizar a aplicação:
1. Faça push das alterações para o repositório Git
2. O Render fará automaticamente o redeploy

