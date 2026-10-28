# WordPath narration recovery (web)
The approved static narration MP3 catalog is currently empty; the `/api/narration` endpoint intentionally returns 404 for IDs without verified files. The original web audio button tried this endpoint unconditionally, so users heard nothing.

This patch makes the web game use a reviewed, licensed static MP3 from the manifest whenever one exists. Otherwise it uses the built-in browser `speechSynthesis` voice for the trusted, pre-authored narration script after the user enables audio. All speech is local to browser speech facilities; no Azure key or paid API is required. It is **synthetic**, never claimed to be human-recorded. Speech availability and voice accent vary by device; Safari and mobile browsers may require a direct user gesture. Tap Replay if autoplay is blocked.

The shared audio manifest and 404 API semantics remain unchanged; no invented human recordings or prerecorded assets are added. Mobile native Expo currently lacks a device speech fallback and still needs real audio assets or an explicitly supported free device TTS implementation.
