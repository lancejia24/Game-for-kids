# WordPath development starter

This initial development branch delivers a basic Expo learning flow and a reusable, tested tile-state engine. It is **not** the complete Phase 0 or Phase 1 acceptance criteria.

## Quick start

1. Install Node 22 and npm. Run `npm install` from the repository root with network access.
2. Run `npm test` to execute core state-machine unit tests.
3. Run `npm run start -w @wordpath/mobile`, then scan with a compatible Expo Go build, or run on a local iOS/Android development simulator. Expo SDK version must match your Expo Go/dev client.

## What is implemented

- Four-step mobile demonstration with sound-choice exercise, spoken device text, large letter tiles, picture cue, phonics explanation and word meaning.
- Tap a tile, then tap an answer slot. Tapping a placed letter lets you move/swap it. Reset, undo, hint, completion, and repeat-letter logic in a pure core package.
- Supported lengths: 2–10 A-Z characters; unique tile-instance identities; seeded Fisher-Yates shuffle.
- Four automated Node tests for length, duplicates, swaps/undo and assisted completion. Tests executed locally on Node 22. Native builds and Expo package installation **have not been verified**.

## Missing and needed before claiming blueprint acceptance

- Real cross-platform drag/pan gestures, reliable drop collision, and returning tiles to tray. The current touch alternative is functional; drag is not yet implemented.
- Bundled licensed audio and reviewed picture assets, with offline playback instead of device synth speech. The emoji and speech are development-only and pronunciation of individual phonemes via TTS is not educator-reviewed.
- Offline SQLite state/progress and idempotent sync; 30–50 reviewed word pack; phonics segment review and mastery/pathway logic.
- Secure admin and Supabase schema/RLS, publish/version/sync, rights validation, downloadable media.
- Parent protections, legal review, real-device accessibility and App Store / Google Play release work.

## Security and safety

No analytics, advertising, microphone, chat or child sign-in added. No Supabase service secret is stored in client code.
