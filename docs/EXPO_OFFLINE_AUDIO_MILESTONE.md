# WordPath Expo offline audio milestone

This builds on PR #14's shared phoneme sequence planner. It adds:
- A shared pack manifest validator with exact relative paths, SHA-256 and byte lengths.
- SQLite-backed installed-pack inventory reader, which **does not** trust or play files merely because inventory metadata says they are installed.
- A native Expo Audio playback adapter that plays local file:// URIs only, awaits didJustFinish events, supports cancellation, and releases its player.
- No new paid dependencies or cloud speech APIs.

## Explicitly incomplete
No approved phoneme recordings or pack manifests exist. No download manager, file hashing/verification installer, pack storage creation, installed-to-file URI resolver, or gameplay UI hookup is included. The Expo adapter accepts file:// URIs, while the shared planner currently produces /audio/phonemes/... manifest paths; a future verified pack installer/resolver must translate these paths into the approved sandbox local files before playback. Mobile device tests and interrupted-audio tests are still necessary.

Do not mark this feature as fully offline-capable until the release includes verified bundled/downloaded audio recordings and the resolver/installer.
