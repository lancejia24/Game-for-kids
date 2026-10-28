# WordPath: human-recorded voice policy

**Owner requirement: Every spoken audio clip MUST be a recording of a real human voice.** No synthesized device text-to-speech, generative AI voices, voice cloning, or automatic spoken fallbacks are allowed.

## Current implementation and status
- The previous `expo-speech` playback has been removed from the mobile screen and package. The app now uses `expo-audio` with a manifest that accepts **only reviewed/rights-cleared human recording metadata**.
- The manifest is intentionally empty. There are **no actual human recordings in this commit**, and the learner-facing UI clearly states when audio is unavailable. The existing on-screen text remains, but the spoken phonics acceptance criteria are blocked until recordings are added.
- The metadata validator rejects entries marked generated, unreviewed, rights-unconfirmed or without narrator/reviewer attribution.
- A metadata assertion does **not** automatically prove that the underlying audio was recorded by a real person. An editor must listen to each file, check its provenance and usage authorization, and approve its transcript/pronunciation.
- Once the reviewed source files exist, they can be bundled with the offline starter pack using static `require()` links, or distributed later through a secure reviewed-and-versioned asset manifest from the admin.

## Recording plan
1. Hire or use one or more **actual human voice actors** with written recording and app-distribution rights.
2. Record clean, well-paced US English audio, with a consistent narrator for each pathway. Keep uncompressed WAV masters (44.1 or 48 kHz), then export mobile-friendly M4A/AAC or MP3 files. Do not run voice-clone or TTS transformations.
3. Record **separately** for each word: a spoken word, complete lesson instruction, educator-reviewed phonics explanation, and definition/meaning. Curate individual phonemes and blends with a reading specialist, especially stops and digraphs (e.g., SH is one sound despite separate S/H spelling tiles). Do not use the letter name as a substitute for the phoneme.
4. Include transcript, locale, narrator identity, record date, proof of license, reviewer, approved timestamp and sound pattern tags. Publish only after human editorial review.
5. For every clip, place the real `.m4a` file in `apps/mobile/assets/audio/human/` and explicitly reference it from `apps/mobile/src/audio/catalog.ts`, with completed metadata. **Do not commit audio with unconfirmed rights.**
6. In the future, the admin must support recording upload, provenance attestation, rights review, listen/preview, revision control and publishing. All offline packs must bundle their approved audio before being offered as complete.

## Example clip IDs
- `CAT:prompt`: actual narrator speaking the sound recognition instruction
- `CAT:word`: actual narrator speaking “cat”
- `CAT:phonics`: actual narrator teaching the /k/ letter-spelling mapping
- `CAT:meaning`: actual narrator explaining the definition

Repeat the same four categories for FISH, BANANA and STRAWBERRY, expanding to 30–50 educator-reviewed words later.

## Verification still required
- No authentic human recordings have been supplied, played or verified yet.
- Mobile `expo-audio` load/replay/interruptions, file bundling, 2–10 letter layouts and iOS/Android real-device playback remain to be tested.
- Future published downloads must be local/offline-capable and verify checksums and editorial approval. Do not silently fall back to AI speech.
