# WordPath Open-Source Audio Pipeline — Version 1.1 Blueprint

## Current implementation
- **No paid cloud narration.** The browser and mobile clients request a fixed catalog ID from `/api/narration`, which serves ONLY a rights-cleared and reviewed MP3 registered in `packages/core/src/audioLibrary.ts`.
- Source recordings may be real human narration (preferred) or transparently labelled locally generated open-source audio. Never call local synthetic audio human-recorded.
- The asset manifest starts empty, so missing narration produces a clear unavailable response and written prompts stay accessible. No audio clips or IPA approvals are fabricated.
- GitHub hosts versioned `apps/web/public/audio/v1/*.mp3` files. This uses free project tooling but remains subject to free Vercel bandwidth/storage limits.
- **IPA helper:** `node scripts/generate-phonemes-espeak.mjs CAT` uses the locally installed free `espeak-ng` executable and prints an *unreviewed* US-English transcription. Run on a developer machine with eSpeak NG installed. Use explicit argument arrays, never shell commands assembled from user words.
- SSML text templates remain in source for historical review, but they are not synthesized or used for playback. eSpeak NG is not an SSML cloud speech service.

## Still to implement
1. Record/license and review individual phonemes and whole-word clips.
2. A grapheme-to-phoneme segment library and a real offline phoneme splicer, with careful attention to coarticulation, phoneme boundaries, and audio timing. eSpeak NG IPA output alone is NOT equivalent to accurate phonics teaching.
3. Signed/versioned offline audio packs stored in SQLite and bundled/downloaded for mobile.
4. Supabase schema for parent-owned learner profiles, review gates, and media metadata with comprehensive RLS. The new spec SQL is a proposal, not yet a deployed migration.
5. Move npm monorepo incrementally to pnpm/Turborepo with lockfile/CI/Vercel testing, rather than changing the package manager in a build-breaking one-step edit.
6. Accessibility, child safety, educator phonics validation, device testing and release readiness.

Do not mark blueprint checkboxes complete solely because they are checked in a document. Confirm code, tests, runtime and asset inventory.
