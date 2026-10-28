import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {resolveDrop,newSession,restoreSession,serializeSession,apply} from '../src/index.ts';
const WORDS=['CAT','FISH','BANANA','STRAWBERRY'];
test('resolve drop to matching slot, tray or no target',()=>{
 const slots=[{x:10,y:10,width:44,height:48},{x:56,y:10,width:44,height:48}];
 const tray={x:0,y:100,width:300,height:70};
 assert.deepEqual(resolveDrop(99,34,slots,tray),{kind:'slot',index:1});
 assert.deepEqual(resolveDrop(101,130,slots,tray),{kind:'tray'});
 assert.equal(resolveDrop(999,999,slots,tray),null);
 assert.equal(resolveDrop(Number.NaN,40,slots,tray),null);
});
test('restore a valid unfinished session with repeated tiles',()=>{
 const s=newSession(WORDS);s.step=3;s.state=apply(newSession(['STRAWBERRY']).state,{kind:'place',tileId:'tile-0',slot:0});
 s.phase='spell';s.mode='Adults';assert.deepEqual(restoreSession(serializeSession(s),WORDS),s);
});
test('reject bad, wrong version, changed content and duplicate state IDs',()=>{
 const s=newSession(WORDS);assert.equal(restoreSession('{bad',WORDS),null);
 assert.equal(restoreSession(JSON.stringify({...s,schema:2}),WORDS),null);
 assert.equal(restoreSession(serializeSession(s),['DOG',...WORDS.slice(1)]),null);
 const invalid=JSON.parse(serializeSession(s));invalid.state.tiles[0].id=invalid.state.tiles[1].id;
 assert.equal(restoreSession(JSON.stringify(invalid),WORDS),null);
});
test('validate ten-letter slot state after serialization',()=>{
 let s=newSession(['STRAWBERRY']);const w=s.state;
 for(let i=0;i<w.answer.length;i++){
  const id=w.tiles.find(t=>t.letter===w.answer[i]&&!s.state.slots.includes(t.id))?.id;
  assert.ok(id);s.state=apply(s.state,{kind:'place',tileId:id,slot:i});
 }
 assert.equal(restoreSession(serializeSession(s),['STRAWBERRY'])?.state.slots.length,10);
});
