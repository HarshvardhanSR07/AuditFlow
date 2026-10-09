# AuditFlow

Code audits as structured forensics. Architecture decoded deterministically.

## Architecture Structure

- **`packages/ir`**: @auditflow/ir — single source of truth Zod schema
- **`apps/web`**: @auditflow/web — Next.js frontend + API
- **`apps/worker`**: @auditflow/worker — analysis pipeline

## Prerequisites

- PostgreSQL (update `DATABASE_URL` in `.env`)
- Redis (update `REDIS_URL` in `.env`)
- Anthropic API Key (update `ANTHROPIC_API_KEY` in `.env`)

## Installation

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

## Running the app

```bash
npm run dev:web
npm run dev:worker
```
