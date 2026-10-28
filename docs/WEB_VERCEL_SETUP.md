# WordPath web preview and draft-word admin setup

Target Vercel domain supplied by owner: `https://game-for-kids-seven.vercel.app`

## What's implemented

- `apps/web` is a Next.js app in the existing npm-workspaces monorepo. Routes:
  - `/`: public WordPath landing page
  - `/play`: working 4-word browser demo using `@wordpath/core`. Supports tap-to-place, HTML drag/drop and pointer-based touch dragging, swapping repeated letters, hints, word checking, presentation modes and local-only progress in browser storage.
  - `/privacy`: provisional guest-demo and parent information (not a final legal policy)
  - `/admin/login`: adult admin sign-in via Supabase Auth
  - `/admin`: server-guarded draft-word library with create/edit/archive
  - `/admin/setup`: setup directions. Never expose database secrets here.
- No child account, remote child-progress uploads, advertisements, AI narration, TTS, or unreviewed published words.
- **Only four developer examples** are available in the browser preview. All narration is unavailable pending human-recorded and educator-reviewed assets.

## Configure Vercel deployment

The repository currently also contains the Expo mobile app. Verify which repo and Root Directory your **existing** Vercel project actually uses before changing any production settings.

1. In Vercel, open the existing project that owns `game-for-kids-seven.vercel.app`.
2. Confirm GitHub repository is `lancejia24/Game-for-kids` and production branch `main`.
3. **If Root Directory is the repository root:** leave it as root. The new root `vercel.json` specifies Next.js, installs npm workspaces, runs `npm run build:web`, and outputs `apps/web/.next`. Ensure project Build/Output overrides don't conflict with the file.
4. **If using Root Directory `apps/web`:** Next.js can be auto-detected. Leave build `next build` and default output `.next`. If it cannot resolve sibling workspace packages, return root to repository root and use the root `vercel.json`.
5. Deploy only after the PR is merged and green build checks have run. The exact Vercel project settings and deployment status are not independently verified without Vercel account access.
6. Browser routes `/` and `/play` work without Supabase; `/admin` remains unavailable until configured.

## Secure admin configuration

1. Use an existing or new Supabase project and apply `supabase/migrations/20261028010000_wordpath_web_admin.sql` in SQL Editor.
2. Create a **trusted adult** admin account via Supabase Auth user management.
3. As the Supabase SQL operator, add that user by UUID (do not paste passwords or keys into code):
   `INSERT INTO public.wordpath_admins (user_id) VALUES ('REPLACE_WITH_AUTH_USER_UUID') ON CONFLICT DO NOTHING;`
4. In Vercel add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for each intended deployment environment. Use only the public Supabase anon/publishable key, never the service-role key in a `NEXT_PUBLIC_` variable.
5. Visit `/admin/login`, authenticate and create/edit/archive a draft. Verify a regular authenticated user cannot access `/admin` or mutate words through the API.
6. The migration locks `published` status with a database CHECK constraint. No fake media publishing path is provided. A later migration must implement human-audio asset review, versioned releases and secure public read.

## Local development

Requires Node 22 and npm:
```sh
npm install
npm test
npm run typecheck -w @wordpath/web
npm run build:web
npm run dev:web
```
Then visit `http://localhost:3000/play`.

## Release checklist

- Confirm local mobile and web builds are green; GitHub Actions is an independent verification path.
- Test web drag/touch/keyboard interactions in mobile Safari, Chrome Android, and desktop browsers.
- Complete accurate reviewed human voice audio for *every* phonics instruction and word, no synthetic fallback.
- Have qualified educator approve phoneme/grapheme data; add media rights and image assets.
- Add real review/publish workflow, versioned lesson releases, locally cached lesson packs, and secure synced app downloads.
- Complete legal child-privacy review before production release.
