# Clube — Especificação do Produto (amigos)

## Visão
O **Clube** é um app privado para um **clube do livro entre amigos**, com foco em:
- Conversa (chat estilo WhatsApp)
- Conteúdo social (feed estilo Instagram)
- Ritual do clube (livro do mês, encontros e discussões)
- Experiência com spoilers sob controle

Nada de “MVP improvisado”: tudo deve ser implementado com qualidade de produção (sem texto de teste, sem placeholders em telas finais).

---

## Personas e contexto
- Grupo pequeno (amigos), alta confiança.
- Pessoas que gostam de interagir como em redes sociais.
- O produto deve parecer leve, divertido e “vivo”, mas bem organizado.

---

## Princípios de produto
1) **Clube primeiro**: tudo é sobre o grupo e o livro do mês.
2) **Conversas com contexto**: reply/threads e links entre chat ⇄ feed.
3) **Spoiler guard**: o app ajuda a evitar spoilers sem estragar a discussão.
4) **Baixo atrito**: login simples (Google), onboarding curto, tudo fácil de achar.
5) **Privado por padrão**: só entra com convite.

---

## Funcionalidades (alto nível)

### 1) Autenticação e acesso
- Login com **Google** (OAuth)
- Perfis: nome, foto, bio
- Clube privado: entrar somente via convite (link/código)
- Papéis: owner/mod/member

### 2) Clube / Grupo (core)
- Página do clube com:
  - descrição, regras, membros
  - livro do mês (atual) + histórico
  - agenda do próximo encontro
- Membros:
  - lista + papéis
  - ações de moderação (owner/mod)

### 3) Chat (estilo WhatsApp, mas organizado)
- Canal principal do clube: **#geral**
- Subcanais por ciclo:
  - **#livro-do-mes**
  - canal por livro (ex.: #dom-casmurro)
  - opcional: canal por encontro (ex.: #encontro-2026-03-01)
- Recursos do chat:
  - reply com quote
  - threads leves (respostas agrupadas)
  - @menções
  - reações em mensagens
  - fixar mensagens
  - anexos (imagem)

### 4) Discussão por livro com anti-spoiler
- Canais por marcos (configurável):
  - sem-spoiler
  - cap-1-3, cap-4-6, …
  - final
- Progresso do usuário (opcional) define o que aparece (filtro de spoilers).

### 5) Feed (estilo Instagram)
- Post com:
  - 1+ imagens
  - legenda
  - comentários com reply
  - @menções
- Cross-post:
  - botão “Compartilhar no chat” (publica card no canal escolhido)
  - do chat, abrir o post original

### 6) Stories / temporários (vibe social)
- Formato inicial: **Stories**
  - duração padrão: 24h
  - coleção do “livro do mês” (highlight do ciclo)
  - opcional: visualização única
- Reels (feed vertical) fica para fase posterior.

### 7) Livro do mês (ritual)
- Fluxo:
  - votação do próximo livro
  - definição do livro do mês e datas
  - metas semanais/check-ins
- Hub do livro do mês:
  - chat do livro
  - feed filtrado
  - stories do ciclo
  - perguntas do encontro

### 8) Encontros
- Agenda com:
  - data/hora/local/link
  - RSVP
  - lembretes
- Pauta do encontro:
  - cards de perguntas
  - votação/ordenação
- Resumo pós-encontro:
  - decisões, destaques, próximos passos

### 9) Notificações
- In-app (mínimo viável e bem feito):
  - mention
  - reply
  - novo comentário
  - novo story
  - convite/aceite
  - evento (encontro) chegando

---

## Requisitos não funcionais (mínimos)
- UX mobile-first
- Acessibilidade básica (aria/teclado)
- Logs e erros com mensagens humanas
- Privacidade: conteúdo só visível para membros

---

## Fora de escopo (por enquanto)
- Feed global público
- Monetização
- Reels completos com edição pesada

---

## Estrutura técnica atual (referência)
- Monorepo Node/TS
- Serviços: gateway-api, users, books, groups, feed
- App web: React + Vite + Tailwind

### Auth (decisões técnicas)
- A sessão do usuário é mantida no **gateway-api** via cookie **HttpOnly** (`clube_session`), e o gateway repassa o usuário para os serviços internos via header `x-username`.
- Login com Google usa **OAuth code flow** no gateway. O usuário é criado/atualizado no serviço `users` com `id` no formato `g_<google_sub>` (sem dados pessoais no identificador).
- O OAuth usa `state` assinado e um cookie temporário (`clube_oauth_state`) para evitar login CSRF/replay; o cookie expira rápido (10 min) e é apagado no callback.
- Variáveis de ambiente para habilitar o Google ficam documentadas em `services/gateway-api/.env.example`.

### Configuração do Google (dev/prod)
Para habilitar "Continuar com Google":
1) Crie um OAuth Client no Google Cloud Console (tipo **Web application**).
2) Em **Authorized JavaScript origins**:
   - Dev: `http://localhost:5173`
3) Em **Authorized redirect URIs**:
   - Dev (Vite proxy): `http://localhost:5173/api/auth/google/callback`
   - Prod (mesma origem do app): `https://SEU_DOMINIO/api/auth/google/callback`
4) Preencha `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REDIRECT_URI` no `services/gateway-api/.env` (use `services/gateway-api/.env.example` como base).

Obs.: a arquitetura pode evoluir (ex.: consolidar serviços) se simplificar a entrega e manutenção.
