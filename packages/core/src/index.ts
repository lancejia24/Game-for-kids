export type Tile = {id: string; letter: string};
export type WordState = {answer: string; tiles: Tile[]; slots: (string | null)[]; selected: string | null; hints: number; checks: number; completed: boolean; history: (string | null)[][]};
export type Place = {kind:'place'; tileId:string; slot:number} | {kind:'return';tileId:string} | {kind:'select';tileId:string|null} | {kind:'undo'} | {kind:'reset'} | {kind:'hint'} | {kind:'check'};
export function normalizeWord(word:string):string {const normalized=word.trim().toUpperCase();if(!/^[A-Z]{2,10}$/.test(normalized)) throw new Error('Word must contain 2 to 10 English letters');return normalized;}
export function shuffledIndexes(n:number, random:()=>number=Math.random):number[]{const values=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[values[i],values[j]]=[values[j],values[i]];}if(n>1&&values.every((v,i)=>v===i)){[values[0],values[1]]=[values[1],values[0]];}return values;}
export function startWord(word:string,random:()=>number=Math.random):WordState {const answer=normalizeWord(word);const tiles=shuffledIndexes(answer.length,random).map((index)=>({id:'tile-'+index,letter:answer[index]}));return {answer,tiles,slots:Array(answer.length).fill(null),selected:null,hints:0,checks:0,completed:false,history:[]};}
export function displaySlots(state:WordState):string{return state.slots.map(id=>state.tiles.find(tile=>tile.id===id)?.letter??'').join('');}
export function isCorrect(state:WordState):boolean{return state.slots.every(Boolean)&&displaySlots(state)===state.answer;}
export function apply(state:WordState,action:Place):WordState {
 if(action.kind==='reset')return {...state,slots:Array(state.answer.length).fill(null),selected:null,completed:false,history:[...state.history,state.slots]};
 if(action.kind==='undo'){if(!state.history.length)return state;const slots=state.history[state.history.length-1];return {...state,slots,history:state.history.slice(0,-1),completed:false,selected:null};}
 if(action.kind==='hint')return {...state,hints:state.hints+1};
 if(action.kind==='select')return {...state,selected:action.tileId};
 if(action.kind==='check')return {...state,checks:state.checks+1,completed:isCorrect(state)};
 if(state.completed)return state;
 if(!state.tiles.some(t=>t.id===action.tileId))return state;
 const slots=[...state.slots];const source=slots.indexOf(action.tileId);
 if(action.kind==='return') {if(source<0)return state;slots[source]=null;return {...state,slots,selected:null,history:[...state.history,state.slots]};}
 if(!Number.isInteger(action.slot)||action.slot<0||action.slot>=slots.length)return state;
 if(source===action.slot)return {...state,selected:null};
 const displaced=slots[action.slot];slots[action.slot]=action.tileId;
 if(source>=0)slots[source]=displaced;
 return {...state,slots,selected:null,history:[...state.history,state.slots]};
}
export function nextHint(state:WordState):string {const hints=['Replay the word and listen carefully.','Look at the first sound and letter.','Try the first letter shown below.','Study the full word, then try again.'];const n=Math.min(state.hints,hints.length-1);return n===2?'The word begins with '+state.answer[0]+'.':n===3?'The word is '+state.answer+'.':hints[n];}
export function result(state:WordState){return {correct:isCorrect(state),independent:isCorrect(state)&&state.hints===0&&state.checks<=1,hints:state.hints};}

export {contains,resolveDrop} from './geometry.ts';
export type {Rectangle,DropTarget} from './geometry.ts';
export {newSession,restoreSession,serializeSession} from './session.ts';
export type {SavedSession,Phase,Presentation} from './session.ts';

export {isApprovedHumanClipMetadata} from './humanAudio.ts';
export type {HumanClipKind,HumanClipMetadata} from './humanAudio.ts';

export {allSpeechIds,getSpeechEntry,xmlEscape,buildSsml} from './speech.ts';
export type {SpeechPiece,SpeechEntry} from './speech.ts';

export {AUDIO_LIBRARY,isValidAsset,approvedAsset} from './audioLibrary.ts';
export type {AudioAsset,AudioManifest,AudioProvenance} from './audioLibrary.ts';

export {STARTER_PATH,blankProgress,mastered,recommendedLesson,recordAttempt,attemptFromState,safeRestoreProgress} from './pathways.ts';
export type {PathStage,LearningMode,LessonPathItem,MasteryRecord,LearningProgress} from './pathways.ts';

export {CURRICULUM_CANDIDATES,getCurriculumCandidate} from './curriculumCandidates.ts';
export type {CurriculumCandidate} from './curriculumCandidates.ts';

export {DEMO_SEGMENTS,validateLesson,gapForMode,planPhonemePlayback,playPhonemes} from './phonemeBlending.ts';
export type {PhonemeSegment,PhonemeLesson,PhonemePlaybackPlan,PlaybackAdapter,PlaybackUnit} from './phonemeBlending.ts';

export {STARTER_AUDIO_PACKS,validateAudioPack,isValidInstalledPack,safeReadInstalledPacks} from './offlineAudioPacks.ts';
export type {AudioPackFile,AudioPackManifest,InstalledAudioPack} from './offlineAudioPacks.ts';
