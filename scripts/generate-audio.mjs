#!/usr/bin/env node
/**
 * Owner-only command: synthesize a fixed, authored lesson narration ONCE.
 * Writes a local MP3 under the GitHub-tracked versioned folder, not to a child session.
 * Editor must review content, pronunciation, rights and provenance before registration.
 *
 * Usage: AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=... node scripts/generate-audio.mjs CAT:word
 */
import {mkdir,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {getSpeechEntry,buildSsml} from '../packages/core/src/index.ts';
const id=process.argv[2];
if(!id||process.argv.length!==3||!getSpeechEntry(id)){
 console.error('Specify one existing catalog ID, such as CAT:word. Arbitrary text is not accepted.');
 process.exit(2);
}
const key=process.env.AZURE_SPEECH_KEY;
const region=process.env.AZURE_SPEECH_REGION??'';
const voice=process.env.AZURE_SPEECH_VOICE??'en-US-JennyNeural';
if(!key||!/^[a-z0-9-]{2,32}$/.test(region)){
 console.error('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION only in your local environment. Never commit credentials.');
 process.exit(2);
}
let ssml;
try{ssml=buildSsml(getSpeechEntry(id),voice);}catch{console.error('Voice is not allowlisted.');process.exit(2);}
const outputDir=resolve('apps/web/public/audio/v1');
const target=resolve(outputDir,id.replace(/:/g,'_')+'.mp3');
await mkdir(outputDir,{recursive:true});
try{await stat(target);console.error('Audio already exists. File not overwritten: '+target);process.exit(2);}catch(error){if(error.code!=='ENOENT')throw error;}
const response=await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,{
 method:'POST',
 headers:{'Ocp-Apim-Subscription-Key':key,'Content-Type':'application/ssml+xml','X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3','User-Agent':'WordPath-Editor'},
 body:ssml,signal:AbortSignal.timeout(15000)
});
if(!response.ok){console.error('Azure synthesis failed (HTTP '+response.status+').');process.exit(1);}
const buffer=Buffer.from(await response.arrayBuffer());
if(buffer.length<50||buffer.length>500000){console.error('Unexpected file size; no file written.');process.exit(1);}
await writeFile(target,buffer,{flag:'wx'});
console.log('Saved (NOT approved): '+target);
console.log('SHA-256: '+createHash('sha256').update(buffer).digest('hex'));
console.log('Cost note: Azure synthesis may be billed. Listen, verify IPA, confirm terms, and register ONLY after human editorial approval.');
