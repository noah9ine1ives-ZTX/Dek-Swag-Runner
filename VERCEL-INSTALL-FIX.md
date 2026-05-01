# Vercel install fix

This project bypasses the npm install bug by using pnpm through Corepack.

Vercel should show:

corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm install --no-frozen-lockfile

If Vercel still uses npm, set this manually:

Project Settings > Build & Development Settings > Install Command

corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm install --no-frozen-lockfile

Build Command:

corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm run build
