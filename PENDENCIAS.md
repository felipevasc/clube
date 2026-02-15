# Clube — Plano de Produção (fila de execução)

Regra: este arquivo é a **fonte da verdade** do trabalho.
- Sem texto de teste, sem “gambiarra”, sem placeholder em produção.
- Itens entram aqui e saem daqui (marcar [~] quando iniciar; [x] quando finalizar).
- Se um item for grande, quebrar em subtarefas.

Legenda:
- [ ] planejado
- [~] em implementação
- [x] implementado

---

## Prioridade 0 — UX + funcionalidades (retorno pro usuário)

### Epic A — Grupos (core do produto)
- [x] A1. Grupos: página do grupo (membros + descrição + ações claras)
  - [x] A1.1 Web: rota /groups/:id com layout base (header + descrição) + lista de membros
  - [x] A1.2 API: endpoint para detalhes do grupo + membros (se faltar)
  - [x] A1.3 Web: ações claras (entrar/sair/convite) + empty states
- [x] A2. Grupos: convite por link + aceitar/recusar
  - [x] API: gerar/rotacionar link de convite (token) por grupo + resolver token + aceitar/recusar
  - [x] Web: owner copia/rotaciona link no detalhe do grupo
  - [x] Web: rota /invite/:token com aceitar/recusar (recusa chama API) + redirecionar pro grupo
- [ ] A3. Grupos: papéis básicos (owner/mod/member) + aprovar/rejeitar mais fluido

### Epic B — Livros (conteúdo do clube)
- [ ] B1. Livros: capa + busca decente (Open Library)
- [ ] B2. Livro (detalhe): sinopse/tags + layout caprichado
- [x] B3. Estante do grupo: “livro do mês” + histórico
  - [x] API (groups): definir livro do mês + histórico por grupo
  - [x] API (books): GET /books/:id para resolver detalhes por ID
  - [x] Web: seção “Livro do mês” em /groups/:id com definir/trocar (a partir dos livros cadastrados) + histórico

### Epic C — Feed (secundário, mas deixa mais vivo)
- [ ] C1. Feed: paginação + “carregar mais” + skeletons + empty states realmente bons
- [ ] C2. Posts: editar/excluir (com confirmação) + compartilhar link do post
- [ ] C3. Curtidas/comentários: lista de quem curtiu + comentários em modal/página dedicada

### Complementos (depois das epics)
- [ ] Perfil: avatar (Google) + bio + contagem (posts, grupos)
- [ ] Onboarding: tour curto + “o que fazer agora” (entrar no clube / ir no livro do mês / postar no feed)
- [ ] Notificações in-app: mention/reply/comentário/story/convite/encontro

### Epic D — Social (Chat + Feed + Stories)
- [x] D0. Auth: login com Google (OAuth) + sessão segura + logout
  - [x] Gateway: sessão por cookie HttpOnly (`clube_session`) + /api/logout
  - [x] Gateway: endpoints OAuth Google (start/callback) + criação/atualização de perfil no serviço users
  - [x] Web: botão “Continuar com Google” + auth via sessão (sem localStorage)
  - [x] Documentar setup do Google Cloud (client id/secret + redirect URI) e endurecer o fluxo (state + cookie temporário anti-CSRF)
- [ ] D1. Chat do clube (#geral): mensagens, reply/quote, reações, @menções
- [ ] D2. Subcanais por livro do mês (e por livro): criar/entrar + organização anti-spoiler
- [ ] D3. Feed com fotos: post (imagem+legenda), comentários com reply, marcar pessoas
- [ ] D4. Cross-post: compartilhar post no chat (card) e abrir post a partir do chat
- [ ] D5. Stories: 24h + highlight do livro do mês + visualização única opcional

## Prioridade 1 — Qualidade de produto (sem gambiarra, mas user-facing)
- [ ] Padrão de erros: mensagens humanas + toasts + retry (frontend)
- [ ] Performance percebida: cache no client (React Query) + debounce + optimistic UI
- [ ] Acessibilidade e polish: teclado, aria, responsivo, micro-interações

## Prioridade 2 — Base técnica mínima pra sustentar as features
- [ ] Auth real (sessions/JWT com refresh) + RBAC (owner/mod/user) (necessário p/ features sociais)
- [ ] Rate limiting + validação de input + tratamento de erros padronizado (API)
- [ ] Logging estruturado (requestId) e health/readiness

## Prioridade 3 — Dados e produção (quando as features estiverem redondas)
- [ ] Migrar SQLite → Postgres (Prisma) com migrações versionadas
- [ ] CI (lint/typecheck/test/build) + audit
- [ ] Docker + edge (Caddy/Nginx) + TLS + deploy

---

## Concluídos
- [x] Monorepo subindo local (gateway + serviços + web)
- [x] Prisma client isolado por serviço (evita conflito no monorepo)
