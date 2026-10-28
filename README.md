# WordPath: Phonics, Reading and Spelling

A cross-platform spelling and phonics product, with React Native/Expo mobile learning and a Next.js browser preview/admin foundation.

**Human voice requirement:** All spoken instruction and words must be authentic, editor-approved human recordings. No AI voices, voice cloning, or text-to-speech fallback. Real recordings are still needed and the demo currently displays written prompts.

## Live web project

The owner-designated website is `https://game-for-kids-seven.vercel.app/`. This is **not** a claim the current domain is already serving the new app. Configure its Vercel project using [web deployment and secure admin instructions](docs/WEB_VERCEL_SETUP.md), then merge and deploy the new code.

## Monorepo

- `apps/mobile` — Expo React Native mobile learning demo
- `apps/web` — Next.js homepage, /play browser game, /admin secure word draft management
- `packages/core` — shared spelling engine, game state, phonics/audio validation
- `supabase/migrations` — secure administrator membership and draft-only word library

## Developer quick start

```sh
npm install
npm test
npm run typecheck -w @wordpath/web
npm run build:web
npm run dev:web
```

The web demo requires no Supabase credentials. Admin login and draft management require the migration and public Supabase environment settings.

See [the Master Development Blueprint](Spelling_Phonics_App_AI_Development_Blueprint.md) for the complete product specification and [human audio policy](docs/HUMAN_VOICE_POLICY.md) for recording requirements.

## Project stage

The web demo currently contains four development sample words, placeholder emoji clues, and text phonics. This is *not* the full lesson pathway, not the final narrated curriculum, and not ready for App Store/Play Store release. The admin creates/edits/archives drafts but cannot publish content until reviewed real-human recordings and media are integrated.
