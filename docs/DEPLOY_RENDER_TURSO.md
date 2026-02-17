# Deploy grátis (Render + Turso)

## O que já foi preparado no código
- `render.yaml` criado (Blueprint do Render).
- API monolítica agora também serve o frontend buildado.
- `DATABASE_URL` foi movida para env (`services/api/prisma/schema.prisma`).
- Suporte a Turso no Prisma Client (`@prisma/adapter-libsql` + `TURSO_AUTH_TOKEN`).

## Passo a passo (o que você precisa fazer)

### 1) Criar banco no Turso
1. Acesse https://turso.tech e crie/login.
2. Crie um DB (ex.: `clube-prod`).
3. Gere um token de acesso.
4. Guarde:
   - `DATABASE_URL` (formato `libsql://...`)
   - `TURSO_AUTH_TOKEN`

### 2) Subir no Render com Blueprint
1. Acesse https://render.com
2. New + → **Blueprint**
3. Selecione o repositório `felipevasc/clube`
4. O Render vai ler o `render.yaml` automaticamente.
5. Preencha os env vars obrigatórios:
   - `DATABASE_URL` (Turso)
   - `TURSO_AUTH_TOKEN` (Turso)
   - `SESSION_SECRET` (string forte)
   - `GEMINI_API_KEY` (se usar IA)
   - `GEMINI_API_KEY2` (opcional)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` (se usar login Google)

### 3) URL de callback Google (se usar OAuth)
Depois que o Render gerar URL (ex.: `https://clube.onrender.com`), configure no Google Console:
- Redirect URI: `https://clube.onrender.com/api/auth/google/callback`

## Observações
- Plano free do Render hiberna quando sem uso (primeira requisição demora um pouco).
- O frontend está sendo servido pelo mesmo serviço da API (mais simples e barato).
- O start roda `db:migrate` e `db:seed` automaticamente.
