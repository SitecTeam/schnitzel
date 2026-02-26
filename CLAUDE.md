# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install              # Install all workspace dependencies
bun run dev              # Start all apps in dev mode (turbo)
bun run dev:web          # Start Astro frontend at localhost:4321
bun run dev:cms          # Start Payload CMS at localhost:3000/admin (uses remote D1 + R2 by default)
bun run build            # Build all apps (turbo)
bun run lint             # Lint all apps
bun run format           # Format all files with Prettier
```

## Architecture

This is a **bun monorepo** managed with **Turborepo**, containing two apps and a shared package.

### Monorepo Structure

```
schnitzel/
├── apps/
│   ├── web/              # Astro 5 frontend (Cloudflare Workers)
│   └── cms/              # Payload CMS 3.x on Next.js (Cloudflare Workers + D1 + R2)
├── packages/
│   └── shared/           # Shared TS types, utils (@schnitzel/shared)
├── package.json          # Root: workspaces, husky, lint-staged, eslint
├── turbo.json            # Turborepo task orchestration
├── eslint.config.js      # ESLint flat config with unused-imports
├── .prettierrc           # Prettier config
└── lint-staged.config.js # Pre-commit lint/format
```

### apps/web — Astro Frontend

- **Framework**: Astro 5 with React integration
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives
- **Animations**: motion (Framer Motion)
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react
- **SVGs**: vite-plugin-svgr (import SVGs as React components with `?react` suffix)
- **Deployment**: Cloudflare Workers via `@astrojs/cloudflare` adapter

### apps/cms — Payload CMS

- **Framework**: Payload CMS 3.x on Next.js
- **Database**: Cloudflare D1 (SQLite) via `@payloadcms/db-d1-sqlite`
- **Storage**: Cloudflare R2 via `@payloadcms/storage-r2`
- **Rich Text**: Lexical editor via `@payloadcms/richtext-lexical`
- **Deployment**: Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`)
- **Admin**: Available at `/admin`
- **REST API**: Available at `/api`

### packages/shared

- Shared TypeScript types (mirrors Payload collections)
- Utility functions (date formatting, URL building, slugify)
- Imported as `@schnitzel/shared` via workspace dependency

## Key Patterns

**Component Hydration**: All React components use `client:load` directive in Astro pages.

**SVG Imports**: `import Logo from "../svgs/logo.svg?react";`

**Styling**: Use `cn()` from `@/lib/utils` for conditional classes.

**Path Aliases**: `@/*` maps to `./src/*` in both apps.

**Payload API Client**: `apps/web/src/lib/payload.ts` wraps fetch calls to the Payload REST API.

## Formatting

Prettier configured with:

- Double quotes, semicolons, 2-space tabs
- `prettier-plugin-astro` and `prettier-plugin-tailwindcss`
- Tailwind class sorting for `cn()` and `clsx()`

## Pre-commit Hooks

Husky + lint-staged runs on every commit:

- `*.{ts,tsx,js,jsx,astro}` → ESLint autofix + Prettier
- `*.{json,md,mdx,css,html}` → Prettier

## Deployment (Cloudflare)

**Same-domain routing** via Cloudflare Workers Routes:

- `domain.com/*` → Astro (apps/web)
- `domain.com/admin/*` → Payload (apps/cms)
- `domain.com/api/*` → Payload (apps/cms)

**Environment setup**:

1. Create D1 database: `wrangler d1 create schnitzel-db`
2. Create R2 bucket: `wrangler r2 bucket create schnitzel-media`
3. Update `apps/cms/wrangler.json` with D1 database ID
4. Set `PAYLOAD_SECRET`: `wrangler secret put PAYLOAD_SECRET` (for production)
5. Generate types after changing wrangler bindings: `cd apps/cms && npx wrangler types`
6. Generate import map after changing Payload config: `cd apps/cms && npx payload generate:importmap`
7. Create migrations: `cd apps/cms && npx payload migrate:create <name>`
8. Deploy web: `bun run deploy:web`
9. Deploy CMS: `bun run deploy:cms`

**CI/CD**: GitHub Actions runs lint + type check on PRs. Cloudflare Workers Builds handles deployment on push to main (configure in Cloudflare Dashboard).

## DB Workflow (Payload + D1)

- Use Payload migrations for schema changes (collections/fields), not Drizzle.
- Local migration status: `cd apps/cms && bun run db:migrate:status`
- Remote migration status: `cd apps/cms && bun run db:migrate:status:remote`
- Create migration after schema changes: `cd apps/cms && bun run db:migrate:create <name>`
- Apply locally: `cd apps/cms && bun run db:migrate`
- Apply to remote D1: `cd apps/cms && bun run db:migrate:remote`
- One-off local content copy to remote (data only): `cd apps/cms && bun run db:sync:data:local-to-remote`

## Local Dev Seed Data

Each developer has their own isolated local D1 SQLite database (managed by wrangler). It starts empty on a fresh clone.

**First-time setup for a new developer:**

```bash
cd apps/cms
bun run db:migrate   # apply all schema migrations
bun run db:seed      # insert sample episodes (src/db/seed.sql)
```

To add seed entries, edit `apps/cms/src/db/seed.sql`.
To share your full local DB with a colleague: `bun run db:export:local` → sends `local-d1-full.sql`, colleague runs `bun run db:import:local`.

**Sync real data from remote to local (Option A — safe):**

```bash
cd apps/cms
bun run db:sync:data:remote-to-local   # pulls remote D1 data into your local DB
```

Note: R2 images won't be available locally this way — cover images will 404 but episode data
and text will work fine.

**Use remote D1 + R2 in local dev (default):**

`bun run dev:cms` (or `bun run dev`) already uses remote D1 + R2 by default (`CLOUDFLARE_REMOTE_BINDINGS=true`).
Images work and data is live. **Any writes in the CMS admin will affect the remote database.**

**Use local D1 only (Option B — fully isolated):**

```bash
cd apps/cms
bun run dev:local   # runs next dev against local SQLite only, no remote bindings
```
