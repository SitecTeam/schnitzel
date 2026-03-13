# Deployment Guide (Cloudflare)

This repository deploys as two Cloudflare Workers:

- web worker: Astro app in apps/web
- cms worker: Payload + Next/OpenNext app in apps/cms

Production topology is a single domain:

- /admin/\* -> cms worker
- /api/\* -> cms worker
- /\* -> web worker

## 1) Prerequisites

- Cloudflare account with access to the configured account_id
- D1 database created and bound in apps/cms/wrangler.json
- R2 bucket created and bound in apps/cms/wrangler.json
- PAYLOAD_SECRET stored as a Cloudflare secret (not in git)

## 2) Workers Builds Setup

Create two Workers Build projects from the same Git repository.

### 2.1 web project

- Root directory: apps/web
- Build command: bun install --frozen-lockfile && bun run build
- Deploy command: bun run deploy

### 2.2 cms project

- Root directory: apps/cms
- Build command: bun install --frozen-lockfile && bun run build
- Deploy command: bun run deploy

Important:

- If the build environment needs non-public variables for SSG/build-time behavior, set them in Workers Builds -> Build Variables and secrets.
- Keep runtime secrets in Cloudflare Secrets.

## 3) Route Configuration

Configure routes/custom domains so specific routes map to cms worker first.

- example.com/admin/\* -> cms worker
- example.com/api/\* -> cms worker
- example.com/\* -> web worker

Path specificity should ensure /admin and /api resolve to cms while all other paths resolve to web.

## 4) Release Workflow (Manual Migration Gate)

Use this release order for production:

1. Verify migrations state:
   - cd apps/cms
   - bun run db:migrate:status:remote
2. Apply pending migrations:
   - bun run db:migrate:remote
3. Deploy cms worker.
4. Deploy web worker.
5. Run smoke tests.

If migration fails, stop release and do not deploy cms.

## 5) Smoke Test Checklist

- GET / returns web homepage
- GET /episodes (or main content route) returns web content
- GET /admin loads Payload admin
- GET /api endpoint returns CMS API response
- Upload media in admin and verify it is retrievable from site/API
- Check worker logs for both projects

## 6) Local Safety Notes

- apps/cms dev defaults to remote bindings by script design.
- Use local-only CMS mode when needed:
  - cd apps/cms
  - bun run dev:local

## 7) Rollback Notes

- If cms deploy is faulty but schema is unchanged, redeploy previous known-good worker version.
- If schema migration caused issues, pause deploys and resolve forward with a corrective migration.
- Avoid destructive local-to-remote data sync scripts in production operations.
