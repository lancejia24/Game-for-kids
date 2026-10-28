# Vercel Next.js detection repair

## Why the deployment failed

WordPath is an npm-workspaces monorepo. Its Next.js application lives at `apps/web`, while the existing Vercel project has been configured at the repository root. Previously only `apps/web/package.json` declared a `next` dependency; the root `package.json` did not. Vercel's root-level framework detection could therefore produce:

```
No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies".
```

## Code fix

The root package.json now explicitly declares the exact same Next.js, React and React DOM versions used by `@wordpath/web` and provides a standard `build` script. No separate Next.js installation, new app, or change to Expo mobile source code is required. The root `vercel.json` continues to install dependencies from the monorepo root, run `npm run build:web`, and locate output at `apps/web/.next`.

## Correct Vercel project settings for this repository

Open your existing Vercel project for `game-for-kids-seven.vercel.app`, then **Settings → Build and Deployment**:

| Field | Set to |
| --- | --- |
| Git repository | `lancejia24/Game-for-kids` |
| Production Branch | `main` |
| Root Directory | **repository root** (clear the Root Directory field / default; **not** `apps/web`) |
| Framework Preset | `Next.js` |
| Install Command | `npm install --no-audit --no-fund` |
| Build Command | `npm run build:web` |
| Output Directory | `apps/web/.next` |

The three commands/directory values are in root `vercel.json`. Check that any dashboard overrides agree with them and do not point to `apps/mobile`. Setting Root Directory to `apps/web` would change which config and workspace dependencies Vercel sees, so choose **only the root setup above** for this project.

The root package declaration resolves the specific detection mismatch; a successful Vercel deployment still requires correct dashboard settings and a new deployment.

## Verify in GitHub / Vercel

1. After merging this fix, ensure the Vercel project is tracking `main`.
2. In Vercel, deploy the new `main` commit (redeploy without build cache if the old error persists).
3. Verify the build log shows the Next.js version and no detection warning.
4. Open `https://game-for-kids-seven.vercel.app/` and `/play`.
5. Only configure `/admin` after applying the Supabase migration and granting your adult admin membership. Do not put service-role keys in `NEXT_PUBLIC_*` environment variables.

The GitHub Actions web build validates npm installation, TypeScript, and `next build`, but **does not test Vercel's framework detection or live domain deployment**.

## Node test

Run `npm run build` locally with Node 22 and npm, or use the GitHub web checks workflow to verify the workspace builds.
