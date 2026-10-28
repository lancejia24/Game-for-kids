import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {isApprovedHumanClipMetadata} from '../src/index.ts';
const human={id:'FISH:phonics',word:'FISH',kind:'phonics',locale:'en-US',transcript:'S and H together make the sh sound.',provenance:'human-recorded',synthetic:false,narratorId:'speaker1',license:'owned',rightsConfirmed:true,reviewerId:'editor1',reviewedAt:'2026-10-28T00:00:00Z',approved:true};
test('genuinely reviewed metadata passes the human-only gate',()=>assert.equal(isApprovedHumanClipMetadata(human),true));
test('AI speech and TTS are never accepted for playback',()=>{
 assert.equal(isApprovedHumanClipMetadata({...human,provenance:'ai-generated'}),false);
 assert.equal(isApprovedHumanClipMetadata({...human,synthetic:true}),false);
});
test('unapproved or unlicensed clips are rejected',()=>{
 for(const patch of [{approved:false},{rightsConfirmed:false},{license:'unknown'},{reviewerId:''},{narratorId:''},{reviewedAt:'not a date'},{transcript:''},{id:'CAT:phonics'}]){
  assert.equal(isApprovedHumanClipMetadata({...human,...patch}),false);
 }
});
