# WordPath SSML and IPA narration

## Requested capability

Provide optional SSML-driven speech for the existing four demo words and every stage of gameplay: instructions, word pronunciations, sound explanations, hints, definitions, feedback and completion. Both the website and mobile app use the **shared, fixed ID catalog** in `packages/core/src/speech.ts`.

## Important distinction

- **SSML** instructs a text-to-speech engine how to speak, pause and emphasize. It produces **synthetic speech**. It cannot produce a genuinely human-recorded voice.
- **IPA** in SSML via `<phoneme alphabet="ipa" ph="...">...` helps the synthesizer pronounce approved words and sounds precisely; different engines/voices can vary.
- The previous owner preference for **100% real human recordings** is retained as a separate mode. Human recordings may remain the primary curriculum audio. SSML synthesis is **explicitly labelled** and is off until an operator configures the provider and the learner chooses it.
- The CAT, FISH, BANANA and STRAWBERRY IPA strings are **demonstration values**, not educator-reviewed or validated in Azure. Any phoneme teaching needs a reading-specialist review and listening tests before publication.

## Server setup

Microsoft Azure AI Speech REST SSML is used because it supports IPA `<phoneme>` and a server-side API key. Azure is a **paid/usage-billed service**, with any free limits subject to the selected Azure plan; do not assume unlimited free synthesis.

In the Vercel project environment add:

```text
WORDPATH_ENABLE_SYNTHETIC_NARRATION=true
AZURE_SPEECH_REGION=eastus
AZURE_SPEECH_VOICE=en-US-JennyNeural
AZURE_SPEECH_KEY=<server-side-secret>
```

Choose the Azure region matching the speech resource. Use a non-HD en-US neural voice supporting IPA; some HD/new voice families don't support phonemes. **Never prefix the Azure key with NEXT_PUBLIC_** or place it in an Expo bundle.

The server endpoint `GET /api/narration?id=CAT%3Aword` validates a fixed content ID, constructs SSML from reviewed *schema* entries and calls Azure server-to-server. It sends no learner/profile data, does not accept arbitrary text or raw XML, and returns cacheable MP3 audio. Unknown IDs return 404; disabled/unconfigured service returns 503; errors do not expose Azure credentials. Browser clients and the native app only request the fixed ID.

The endpoint is exposed publicly for demo content, so production needs effective CDN pre-generation/caching, billing budget alerts, monitoring, abuse/rate limiting, quotas and an authenticated admin publishing workflow before enabling at scale. For child privacy, do not send child metadata in narration requests.

## Example

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
 <voice name="en-US-JennyNeural">
  <prosody rate="-10%">
   <phoneme alphabet="ipa" ph="kæt">cat</phoneme>
  </prosody>
 </voice>
</speak>
```

A browser/mobile user can explicitly opt in to synthetic narration and replay the fixed clips. If a provider fails, text remains available. Nothing switches to synthesized speech without an explicit choice. Previously recorded human audio stays supported and is not overwritten.

## Validation and release

- Run `npm test` to verify ID allowlisting, SSML IPA rendering and XML escaping.
- Run `npm run build` to verify TypeScript and Next.js compilation.
- Test the service with real Azure credentials and an approved SSML-compatible voice. This environment has no Azure key, so live speech accuracy and actual playback are **not verified**.
- Review IPA and each sound/grapheme alignment with an educator. Never use TTS as sole evidence of correct phonemic pedagogy.
- Before production, generate a versioned offline audio pack from approved SSML clips or bundle rights-cleared human recordings. Network speech does not meet the offline-first acceptance criterion on its own.

Official Azure docs: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation
and https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech
