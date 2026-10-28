import {test} from 'node:test';import {strict as assert} from 'node:assert';
import {DEMO_SEGMENTS,validateLesson,gapForMode,planPhonemePlayback,playPhonemes} from '../src/index.ts';
const approved={...DEMO_SEGMENTS[0],status:'approved' as const,segments:DEMO_SEGMENTS[0].segments.map((s,i)=>({...s,reviewed:true,audioPath:'/audio/phonemes/v1/sound'+i+'.mp3'}))};
test('development candidate segments are valid but unplayable until approved and recorded',()=>{
 assert.ok(DEMO_SEGMENTS.every(validateLesson));
 assert.equal(planPhonemePlayback(DEMO_SEGMENTS[0],'blended'),null);
 assert.equal(planPhonemePlayback(approved,'isolated')?.units.length,3);
});
test('reject gaps, overlapping graphemes, missing approved files and path traversal',()=>{
 assert.equal(validateLesson({...approved,segments:[{...approved.segments[0],end:3},...approved.segments.slice(1)]}),false);
 assert.equal(validateLesson({...approved,segments:[{...approved.segments[0],audioPath:'../bad.mp3'},...approved.segments.slice(1)]}),false);
 assert.equal(validateLesson({...approved,segments:[{...approved.segments[0],reviewed:false},...approved.segments.slice(1)]}),false);
});
test('isolated and blended timings are bounded',()=>{
 assert.equal(gapForMode('isolated'),300);assert.equal(gapForMode('blended'),65);
 assert.equal(gapForMode('blended',-100),20);
 assert.equal(gapForMode('blended',4000),1000);
 assert.throws(()=>gapForMode('blended',NaN));
});
test('audio sequence waits until each clip finishes, with gaps only between clips',async()=>{
 const plan=planPhonemePlayback(approved,'blended');assert.ok(plan);
 const calls:string[]=[];
 await playPhonemes(plan!,{async playToEnd(uri){calls.push(uri)},async pause(ms){calls.push('pause:'+ms)}});
 assert.deepEqual(calls,['/audio/phonemes/v1/sound0.mp3','pause:65','/audio/phonemes/v1/sound1.mp3','pause:65','/audio/phonemes/v1/sound2.mp3']);
});
test('cancelled playback cannot continue through later clips',async()=>{
 const plan=planPhonemePlayback(approved,'blended');assert.ok(plan);
 const controller=new AbortController();let count=0;
 await assert.rejects(playPhonemes(plan!,{async playToEnd(){count++;controller.abort()},async pause(){}},controller.signal),/cancelled/);
 assert.equal(count,1);
});
