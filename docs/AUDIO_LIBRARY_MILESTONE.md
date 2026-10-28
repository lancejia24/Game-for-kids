# Blueprint milestone: static versioned GitHub audio library

The owner chose to generate Azure SSML with IPA once, keep approved MP3s in the GitHub repository, and replay those files without paying for repeated speech synthesis. Authentic human-recorded audio may be added independently as a separate mode.

This PR adds the library **infrastructure**, not fabricated MP3s:
- `apps/web/public/audio/v1/` is the folder convention.
- Shared `AUDIO_LIBRARY` records exact lesson IDs, path, SHA-256, provenance, review status and rights.
- `/api/narration` redirects to a reviewed matching stored file if present. If absent, its optional Azure live generation remains available subject to operator config; production should disable live generation after the library is populated.
- Browser uses the same `/api/narration` URL and therefore automatically benefits from stored audio.
- Mobile uses the same backend endpoint for SSML and supports separately reviewed human recordings. Mobile cannot play offline until approved media is bundled or downloaded.

**No actual narration files or new audio-generation credentials are included in this change.** All example speech/IPA still needs educator review. The audio catalog starts empty intentionally. This prevents inaccurate '100% human' claims or forged recordings.

Next steps: add approved MP3s, add script to batch pre-generate only trusted lesson IDs with Azure SSML, verify SHA-256 in CI, teach admin to upload/review content, add offline signed pack downloads and child-safe content moderation.
