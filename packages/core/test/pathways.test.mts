import {test} from 'node:test';import {strict as assert} from 'node:assert';
import {STARTER_PATH,blankProgress,recordAttempt,mastered,recommendedLesson,safeRestoreProgress,attemptFromState,startWord,apply} from '../src/index.ts';
test('stage order and prerequisites are explicit and 2 to 10 letters',()=>{
 assert.deepEqual(STARTER_PATH.map(x=>x.word),['CAT','FISH','BANANA','STRAWBERRY']);
 assert.ok(STARTER_PATH.every(x=>x.word.length>=2&&x.word.length<=10));
 assert.equal(recommendedLesson(blankProgress())?.word,'CAT');
});
test('mastery requires two independent successful attempts; hints never count',()=>{
 let p=blankProgress();p=recordAttempt(p,'CAT','assisted');
 assert.equal(recommendedLesson(p)?.word,'CAT');
 p=recordAttempt(p,'CAT','independent');
 assert.equal(mastered(p,'CAT'),false);
 p=recordAttempt(p,'CAT','independent');
 assert.equal(mastered(p,'CAT'),true);
 assert.equal(recommendedLesson(p)?.word,'FISH');
});
test('incorrect attempt does not unlock progression and does not reset earlier mastery',()=>{
 let p=recordAttempt(blankProgress(),'CAT','independent');p=recordAttempt(p,'CAT','incorrect');
 assert.equal(recommendedLesson(p)?.word,'CAT');p=recordAttempt(p,'CAT','independent');
 assert.equal(mastered(p,'CAT'),true);assert.equal(recommendedLesson(p)?.word,'FISH');
});
test('finished word state computes independent versus assisted result',()=>{
 let s=startWord('CAT',()=>0);
 for(let i=0;i<3;i++){const tile=s.tiles.find(t=>t.letter==='CAT'[i]);assert.ok(tile);s=apply(s,{kind:'place',tileId:tile.id,slot:i});}
 s=apply(s,{kind:'check'});assert.equal(attemptFromState(s),'independent');
 assert.equal(attemptFromState(apply(s,{kind:'hint'})),'assisted');
});
test('restore invalid progress safely without granting mastery',()=>{
 const words=STARTER_PATH.map(x=>x.word);
 assert.deepEqual(safeRestoreProgress('{bad',words),blankProgress());
 const forged={schema:1,records:[{word:'CAT',independent:-1,assisted:0,needsPractice:0,lastResult:'independent'}]};
 assert.deepEqual(safeRestoreProgress(JSON.stringify(forged),words),blankProgress());
 assert.deepEqual(safeRestoreProgress(JSON.stringify(recordAttempt(blankProgress(),'CAT','assisted')),words).records[0].assisted,1);
});
