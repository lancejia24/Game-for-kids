#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,sep} from 'node:path';
import {AUDIO_LIBRARY,isValidAsset} from '../packages/core/src/index.ts';
const ids=new Set();
for(const a of AUDIO_LIBRARY.assets){
 if(!isValidAsset(a))throw Error('Invalid/unfinished approved audio entry: '+a.id);
 if(ids.has(a.id+'|'+a.provenance))throw Error('Duplicate published entry: '+a.id);
 ids.add(a.id+'|'+a.provenance);
 const abs=resolve('apps/web/public',a.path.slice(1));
 const root=resolve('apps/web/public/audio')+sep;
 if(!abs.startsWith(root))throw Error('Audio asset path escapes public audio root');
 const bytes=await readFile(abs);
 if(!bytes.length||bytes.length>500000)throw Error('Audio size must be between 1 and 500000 bytes: '+a.id);
 const actual=createHash('sha256').update(bytes).digest('hex');
 if(actual!==a.sha256)throw Error('Hash mismatch: '+a.id);
 if(bytes.subarray(0,3).toString()!=='ID3'&&!(bytes[0]===0xff&&(bytes[1]&0xe0)===0xe0))throw Error('Not an MP3: '+a.id);
}
console.log('Verified '+AUDIO_LIBRARY.assets.length+' approved audio assets (empty until real reviewed media is committed).');
