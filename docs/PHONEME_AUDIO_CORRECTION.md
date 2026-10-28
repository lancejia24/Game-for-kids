# Fix: inaccurate isolated phoneme speech
The old swipe board sent TTS approximations such as “kuh” and “tuh” to browser speechSynthesis. These are not clean /k/ or /t/ phonemes and introduce false vowel sounds. Browser TTS does not reliably pronounce isolated IPA phonemes, nor seamlessly crossfade them.

This patch removes those misleading letter-audio cues. Tapping highlights graphemes; completing a left-to-right trace plays the entire word using the device voice (if enabled). The interface explicitly explains that accurate isolated phoneme audio is not available yet. The shared phoneme planner remains unmodified and cannot play until reviewed phoneme assets are added.

To fulfill the user's exact behavior safely: record or license rights-cleared phonemes with correct allophones, verify educator-approved word segmentation, register recordings in versioned offline packs, and implement low-latency contiguous playback/crossfades on web and mobile. No recordings have been fabricated.
