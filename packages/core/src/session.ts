import {normalizeWord,startWord,type WordState} from './index.ts';
export type Presentation='Kids'|'Teens'|'Adults';
export type Phase='sound'|'spell'|'meaning'|'done';
export type SavedSession={schema:1;step:number;phase:Phase;mode:Presentation;choice:string|null;state:WordState;completedWords:string[]};
export function newSession(words:readonly string[]):SavedSession{
 if(!words.length)throw new Error('Lessons required');
 return {schema:1,step:0,phase:'sound',mode:'Kids',choice:null,state:startWord(words[0]),completedWords:[]};
}
export function restoreSession(raw:string|null,words:readonly string[]):SavedSession|null{
 if(!raw||!words.length)return null;
 try{
  const v:unknown=JSON.parse(raw);if(!v||typeof v!=='object')return null;
  const s=v as Partial<SavedSession>;
  if(s.schema!==1||!Number.isInteger(s.step)||(s.step as number)<0||(s.step as number)>=words.length)return null;
  if(!['sound','spell','meaning','done'].includes(s.phase as string)||!['Kids','Teens','Adults'].includes(s.mode as string))return null;
  if(s.choice!==null&&typeof s.choice!=='string')return null;
  const w=s.state;const answer=normalizeWord(words[s.step as number]);
  if(!w||w.answer!==answer||!Array.isArray(w.tiles)||!Array.isArray(w.slots)||w.tiles.length!==answer.length||w.slots.length!==answer.length)return null;
  if(!Number.isSafeInteger(w.hints)||w.hints<0||!Number.isSafeInteger(w.checks)||w.checks<0||typeof w.completed!=='boolean')return null;
  if(!Array.isArray(w.history)||w.history.length>200)return null;
  const validIds=new Set<string>();
  for(const t of w.tiles){
   if(!t||typeof t.id!=='string'||typeof t.letter!=='string'||!/^[A-Z]$/.test(t.letter)||validIds.has(t.id))return null;
   validIds.add(t.id);
  }
  if(w.tiles.map(t=>t.letter).sort().join('')!==answer.split('').sort().join(''))return null;
  const validSlots=(slots:unknown):slots is (string|null)[]=>Array.isArray(slots)&&slots.length===answer.length&&new Set(slots.filter(x=>x!==null)).size===slots.filter(x=>x!==null).length&&slots.every(id=>id===null||(typeof id==='string'&&validIds.has(id)));
  if(!validSlots(w.slots)||!w.history.every(validSlots)||(w.selected!==null&&!validIds.has(w.selected)))return null;
  if(!Array.isArray(s.completedWords)||s.completedWords.some(word=>typeof word!=='string'||!words.includes(word)))return null;
  return s as SavedSession;
 }catch{return null;}
}
export function serializeSession(s:SavedSession):string{return JSON.stringify({...s,state:{...s.state,history:s.state.history.slice(-200)}});}
