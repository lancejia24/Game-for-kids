# Repository-hosted WordPath audio

Store **real, verified MP3 files** in versioned folders, e.g.:

```text
apps/web/public/audio/v1/CAT_word.mp3
apps/web/public/audio/v1/CAT_prompt.mp3
apps/web/public/audio/v1/CAT_phonics.mp3
apps/web/public/audio/v1/CAT_meaning.mp3
```

Do not upload placeholder audio. No sound files are included yet.

When a recording has been made or SSML audio generated once:
1. Verify pronunciation, human-vs-synthetic provenance, license/distribution rights and quality.
2. Convert to appropriately compressed MP3, check size (prefer under 200 KB per short clip).
3. Compute SHA-256 and add an entry to `packages/core/src/audioLibrary.ts` with the exact ID, versioned path, hash, provenance, license and reviewed=true.
4. Add real audio files in the same PR. CI tests should verify files and hashes in a later milestone.
5. Only the matching human-recorded or Azure SSML mode will play the clip. Never relabel a synthetic voice as a human recording.

Paths under `public/audio/` serve at `/audio/`. GitHub stores source assets, Vercel deploys them. Mobile will load these URLs over HTTPS or bundle reviewed packs for offline playback later.

Git tracks large binary media poorly; monitor repository size and Vercel transfer quotas. Migrate to versioned object storage/CDN when catalog size grows.
