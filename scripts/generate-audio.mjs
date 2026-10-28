#!/usr/bin/env node
/**
 * Deprecated cloud generator. The updated zero-cost architecture forbids
 * Azure TTS. Use scripts/generate-phonemes-espeak.mjs for local unreviewed IPA
 * and upload approved MP3 recordings separately.
 */
console.error('Paid cloud generation is disabled by the WordPath free/open-source blueprint. Use scripts/generate-phonemes-espeak.mjs for local IPA.');
process.exitCode=1;
