# Interactive character reactions

The web spelling demo now includes small, original animated characters. After spelling a word correctly, the learner reaches an interactive celebration screen:
- **CAT:** Original SVG cat jumps, blinks and wags its tail. Tap or keyboard-activate the cat to hear a real cat meow. The sound never plays automatically, avoiding unwanted noise.
- **FISH:** Original SVG fish swims and blows animated bubbles.
- **BANANA:** Playful banana bounces and tilts.
- **STRAWBERRY:** Playful strawberry wiggles and celebrates.
- Small stars celebrate completion, without timers, pressure or penalties.

The pictures also respond visually when tapped during the spelling task; the natural cat meow unlocks only on correct completion. Reactions are accessible by keyboard or touch, with visible focus indicators, descriptions and `prefers-reduced-motion` animation suppression.

## Real cat sound

Source: https://opengameart.org/content/cat-purr-meow

Recorded by **Kerzoven**, author says they recorded their own real cat. The original file `cat_mewfood.wav` is published **Creative Commons Zero (CC0)**. The audio is animal sound effect, **not an imitation, AI voice, or a replacement for the app's real human-recorded phonics narration**.

The web app serves the meow through `GET /api/animal-sounds/cat` which reads the publicly available WAV from the source host server-side, caches it, and validates RIFF/WAVE bytes. This is a **network-dependent sound** until a source-controlled copy can be securely added. If unavailable, the character still moves with a text notice. No real audio file is bundled in this PR and playback needs live Vercel/browser testing. For true offline playback, obtain/verify and bundle a licensed copy of the original WAV or an approved offline asset pack.

No letters, phonemes, definitions or words use TTS. Voice instruction remains silent pending actual licensed human recordings.

## Future work

- Add more original illustrated characters and real licensed environmental sound effects (not made-up/synthetic imitations).
- Separate kids/teens/adults graphic intensity while sharing learning content.
- Test keyboard/pointer/touch interactions, Safari and Android Chrome, sound latency, optional mute preferences and captioning on real devices.
- Bundle media with explicit source/rights references and offline support.
