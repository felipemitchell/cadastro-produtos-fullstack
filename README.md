# Cadastro de Produtos — Full Stack

CRUD de produtos com React, Express e MongoDB Atlas.

## Rodar localmente

1. Crie um cluster gratuito no MongoDB Atlas, um usuário de banco e libere o IP de desenvolvimento em Network Access.
2. Copie `backend/.env.example` para `backend/.env` e configure `MONGODB_URI` (não publique sua senha).
3. Em um terminal: `cd backend && npm install && npm run dev`.
4. Em outro terminal: `cd frontend && npm install && npm run dev`.
5. Abra http://localhost:5173.

## Rotas
- `GET /api/health` — saúde da API
- `GET /api/produtos` — listar
- `POST /api/produtos` — criar
- `PUT /api/produtos/:id` — atualizar
- `DELETE /api/produtos/:id` — excluir

Exemplo de corpo JSON: `{"nome":"Mouse","descricao":"Sem fio","preco":89.9,"quantidade":10}`.

## Deploy

### Backend no Render
- Publique o código em um repositório GitHub (pode ser monorepo).
- New > Web Service > conecte o repositório.
- Root Directory: `backend`.
- Build Command: `npm install`.
- Start Command: `npm start`.
- Environment Variables: `MONGODB_URI` com a conexão do Atlas; `FRONTEND_URL` com a URL pública do Netlify.
- Configure Network Access no Atlas para permitir conexões do serviço Render. Para ambientes de estudo pode ser necessário liberar `0.0.0.0/0`; mantenha credenciais fortes e privilégios mínimos.
- Verifique `https://SEU-BACKEND.onrender.com/api/health`.

### Frontend no Netlify
- New site > Import from Git > conecte o repositório.
- Base directory: `frontend`.
- Build command: `npm run build`.
- Publish directory: `frontend/dist` se a base for a raiz do repositório, ou `dist` se a base for `frontend`.
- Environment variable: `VITE_API_URL=https://SEU-BACKEND.onrender.com` (sem `/api/produtos`).
- Faça novo deploy após configurar variáveis.
- Atualize `FRONTEND_URL` no Render para o domínio Netlify e reinicie o serviço.

## Teste final
Criar produto, atualizar nome/preço, excluir e recarregar a página para confirmar persistência no Atlas.

**Segurança:** não commitar `.env`, não expor `MONGODB_URI` no frontend. O projeto é didático e não inclui autenticação; não utilize para dados sensíveis em produção.
