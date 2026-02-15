# Clube (MVP)

Monorepo `pnpm` com nano-serviços (Node.js/TS + SQLite/Prisma) e frontend React/Tailwind.

## Requisitos
- Node.js 20+
- pnpm 9+

## Rodar
```bash
pnpm i
pnpm dev
```

Serviços:
- Gateway/BFF: http://localhost:3000
- Users: http://localhost:3001
- Books: http://localhost:3002
- Club (Livro do mes + chat + artefatos): http://localhost:3003
- Feed: http://localhost:3004
- Web: http://localhost:5173

## Testes
```bash
pnpm -r test
```

## Seeds
- Books: 3 livros iniciais
- Club: 1 "grupo" seed (legado interno), usado apenas como base do serviço

O setup roda automaticamente em `pnpm dev` via `pnpm -r db:setup`.

## Login com Google (opcional)
- Configure `services/gateway-api/.env` com `SESSION_SECRET` e `GOOGLE_*` (ver `services/gateway-api/.env.example`).
- No Google Cloud Console, adicione o redirect URI (dev): `http://localhost:5173/api/auth/google/callback`.
