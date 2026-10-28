# WordPath free phoneme blending foundation

Phoneme planning is now pure TypeScript in `packages/core/src/phonemeBlending.ts`. It maps contiguous grapheme spans to IPA and **verified local MP3 paths**, distinguishes isolated (300ms between finished clips) and blended (65ms) teaching modes, and supports cancellation.

### Safety and honesty
- CAT and FISH segment breakdowns are **development candidates only**, not published or educator-approved phonics.
- **No phoneme recordings were created or invented.** Playback plans are unavailable until every segment has a local approved recording.
- The timing is a gap **after each clip finishes**, not true sample mixing, overlap, or crossfade. An Expo/native playback adapter and real acoustic blending still need development and testing.
- Code never infers IPA from a typed word at runtime, uses paid APIs, or sends child data over the network.
- Actual recordings need provenance, redistribution rights, educator review, codec verification and verified pack hashes before marking a full lesson approved.

### Next stages
1. Add the owned/approved 44-phoneme asset pack. Educators must review grapheme context because one letter can represent multiple sounds.
2. Implement local offline playback adapter and react to exact playback completion events on Android/iOS.
3. Build signed/versioned downloadable offline SQLite packs and integrate with admin approval.
