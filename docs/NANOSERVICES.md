# Registro de Nano-Serviços (NANO-SERVIÇOS)

Regra: todo novo nano-serviço deve se registrar aqui com responsabilidade, interfaces HTTP/JSON, eventos e dependências.

## gateway-api (BFF)
- Responsabilidade: BFF para o app web; agrega respostas (ex: feed com perfis), faz proxy para nano-serviços e expõe um endpoint simples de publish de eventos (fanout).
- HTTP (porta `3000`):
  - `POST /api/login` (dev-only; legado) -> users
  - `GET /api/me`, `PUT /api/me` -> users
  - `GET /api/books`, `POST /api/books` -> books
  - `GET /api/groups`, `POST /api/groups` -> groups
  - `GET /api/groups/:id`, `POST /api/groups/:id/join` -> groups
  - `POST /api/groups/:id/invite`, `POST /api/groups/:id/invite/rotate` -> groups
  - `GET /api/groups/:id/members`, `GET /api/groups/:id/requests` -> groups
  - `POST /api/groups/:id/requests/:requestId/approve|reject` -> groups
  - `GET /api/invites/:inviteId`, `POST /api/invites/:inviteId/accept|decline` -> groups
  - `GET /api/feed` (agregado), `POST /api/posts`, `POST /api/posts/:id/like`, `POST /api/posts/:id/comments` -> feed
  - `POST /internal/events/publish` (dev) -> fanout para `EVENT_TARGETS`
- Eventos:
  - Publica: `*` (fanout do gateway; útil em dev)
  - Consome: nenhum
- Dependências: users, books, groups, feed (HTTP); `EVENT_TARGETS` para fanout.

## users
- Responsabilidade: identidade dev (login por username), perfil do usuário.
- HTTP (porta `3001`):
  - `POST /login` `{ username }` -> cria/retorna usuário
  - `GET /me` (auth via `x-username`)
  - `PUT /me` `{ name, bio, avatarUrl }` (auth via `x-username`)
  - `GET /users/:id` -> perfil público
- Eventos:
  - Publica: `user.created`, `user.updated`
  - Consome: nenhum
- Dependências: nenhuma (DB local).

## books
- Responsabilidade: base unificada de livros; cadastro e busca.
- HTTP (porta `3002`):
  - `GET /books?q=` -> busca por título/autor
  - `POST /books` `{ title, author }` (auth via `x-username`)
- Eventos:
  - Publica: `book.created`
  - Consome: nenhum
- Dependências: nenhuma (DB local).

## groups
- Responsabilidade: grupos de leitura; membros; pedidos de entrada; aprovar/rejeitar.
- HTTP (porta `3003`):
  - `GET /groups` (auth via `x-username`; lista apenas grupos do usuario)
  - `POST /groups` `{ name, description }` (auth via `x-username`)
  - `GET /groups/:id` (auth via `x-username`; apenas membro)
  - `POST /groups/:id/join` (auth via `x-username`)
  - `POST /groups/:id/invite`, `POST /groups/:id/invite/rotate` (auth via `x-username`, owner-only)
  - `GET /invites/:inviteId` (sem auth; resolve token -> grupo)
  - `POST /invites/:inviteId/accept|decline` (auth via `x-username`)
  - `GET /groups/:id/requests` (auth via `x-username`, owner-only)
  - `POST /groups/:id/requests/:requestId/approve|reject` (auth via `x-username`, owner-only)
  - `GET /groups/:id/members` (auth via `x-username`; apenas membro)
- Eventos:
  - Publica: `group.created`, `group.join_requested`, `group.join_approved`, `group.join_rejected`
  - Consome: nenhum
- Dependências: nenhuma (DB local).

## feed
- Responsabilidade: feed (posts), reações/curtidas, comentários.
- HTTP (porta `3004`):
  - `GET /feed`
  - `POST /posts` `{ text?, imageUrl? }` (auth via `x-username`)
  - `POST /posts/:id/like` (toggle) (auth via `x-username`)
  - `POST /posts/:id/react` `{ type: like|love|laugh|wow|sad|clap }` (toggle) (auth via `x-username`)
  - `POST /posts/:id/comments` `{ text }` (auth via `x-username`)
  - `GET /posts/:id`
  - `POST /events` (consumo dev) -> aceita eventos, no-op por enquanto
- Eventos:
  - Publica: `post.created`, `post.liked`, `post.unliked`, `post.reacted`, `post.unreacted`, `comment.created`
  - Consome: `user.updated` (futuro; hoje no-op)
- Dependências: nenhuma (DB local).
