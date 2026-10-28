# Tap-to-sound and swipe-to-blend experiment
On the web spelling stage the learner can tap the sound tiles to hear temporary device-voice sound cues, or slide left-to-right across the sound track. The UI highlights each visited sound and, after covering every segment in order, reads the whole word. Replay is available. This is a **development preview**, not authentic continuous acoustic crossfading.

- CAT and FISH use their unreviewed demo grapheme boundaries (FISH ends in one SH segment).
- Other demonstration words use provisional individual-letter cues, not approved phoneme parsing. Some English spellings cannot be pronounced correctly by reading letters individually.
- The built-in browser speechSynthesis only approximates these sound cues. It may add schwa, pronounce them inconsistently, pause between items or be blocked by mobile browsers.
- Save approved phoneme audio assets and integrate the verified offline adapter for accurate articulation and continuous blending. The gesture is built separately from drag-and-drop letter placement and works by pointer movement through the sound track.
- No cloud speech or paid API.
