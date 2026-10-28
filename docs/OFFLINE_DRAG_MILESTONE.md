# Milestone 2: drag and local offline session storage

This milestone extends the merged Phase 0/1 starter with PanResponder touch dragging and SQLite-backed local guest session persistence. It does **not** complete Phase 1 or the admin/content publishing system.

## Try it
1. Install Node 22 and npm, run `npm install` at repository root.
2. Run `npm test` to verify the state engine plus drop-resolution/session tests.
3. From root run `npm run start -w @wordpath/mobile` with an Expo SDK 54-compatible Expo Go or development client. Test on an iPhone/iPad and Android phone/tablet.
4. In the spelling screen: drag a tray tile into a slot; drag between slots to swap; drag back onto the tray to unplace. For accessibility, tap tile then slot; undo, reset, hint and check are supported.
5. Close and reopen the app during the word-building exercise. The guest lesson state should reload from on-device SQLite.

## Platform compatibility
Pinned to Expo SDK 54 (React Native 0.81, React 19.1) for continuity with the previous PR. Expo SQLite `~16.0.9` is within the SDK 54 line. Before running a build use `npx expo install --check` then `npx expo-doctor` and resolve any Expo version warnings.

## Verified
- 8 Node unit tests passed locally on Node 22.16.0.
- `tsc --noEmit -p packages/core/tsconfig.json` passed with globally installed TypeScript 5.8.3.
- GitHub file/branch commits were verified.

## Not yet verified
Native installs, Android/iOS gestures, SQLite behavior on device, mobile typecheck/Metro, audio/graphics review or accessibility QA. These require dependencies and physical/emulated devices.

## Still required
- Reviewed original phonics audio, illustrations, and a 30–50-word starter lesson bank. Current device TTS and emoji are **development-only**, and TTS instruction audio must not be treated as approved phoneme exemplars.
- Offline packaged/updated lesson assets (SQLite session alone does not cache network lesson packs).
- Supabase schema/RLS, cloud sync, admin review/publish interface and adult-controlled profiles.
- A real accessibility/device test matrix: 2–10 tiles, duplicates, wrap, interruptions, rotation, iOS, Android and tablets.
- Child privacy/legal review and production store compliance.

This demo is local-only: no user account or remote child data is transmitted.