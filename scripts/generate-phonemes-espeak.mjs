#!/usr/bin/env node
/**
 * Safe, local-only IPA transcription helper. Requires installed eSpeak NG.
 * No cloud service, shell interpolation, or automatic approval.
 * Usage: node scripts/generate-phonemes-espeak.mjs CAT
 */
import {spawnSync} from 'node:child_process';
const word=(process.argv[2]??'').trim().toUpperCase();
if(process.argv.length!==3||!/^[A-Z]{2,10}$/.test(word)){
 console.error('Supply one 2–10 letter English word, e.g. CAT.');
 process.exit(2);
}
const result=spawnSync('espeak-ng',['-q','--ipa=3','-v','en-us',word],{encoding:'utf8',timeout:10000,maxBuffer:10000,shell:false});
if(result.error||result.status!==0){
 console.error('eSpeak NG is not installed or failed. Install the free local tool, then retry.');
 process.exit(1);
}
const ipa=result.stdout.trim();
if(!ipa){console.error('eSpeak NG returned no transcription.');process.exit(1);}
console.log(JSON.stringify({word,ipa,source:'espeak-ng',status:'unreviewed'},null,2));
