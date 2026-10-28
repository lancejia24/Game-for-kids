import {test} from 'node:test';import {strict as assert} from 'node:assert';
import {AUDIO_LIBRARY,approvedAsset,isValidAsset} from '../src/index.ts';
const base={id:'CAT:word',path:'/audio/v1/CAT_word.mp3',sha256:'a'.repeat(64),provenance:'azure-ssml' as const,locale:'en-US' as const,reviewed:true,license:'Azure Speech usage rights verified',version:1};
test('a reviewed, licensed, versioned, exact clip can be registered',()=>assert.equal(isValidAsset(base),true));
test('unreviewed and unknown catalog items cannot be served',()=>{
 for(const a of [{...base,reviewed:false},{...base,id:'PERSONAL_INPUT:word'},{...base,path:'https://evil.example/audio.mp3'},{...base,path:'/audio/../../secret.mp3'},{...base,sha256:'123'},{...base,license:''}]){
  assert.equal(isValidAsset(a),false);
 }
});
test('repository starts without fictitious human or generated files',()=>{
 assert.equal(AUDIO_LIBRARY.assets.length,0);
 assert.equal(approvedAsset('CAT:word','human-recorded'),null);
 assert.equal(approvedAsset('CAT:word','azure-ssml'),null);
});
