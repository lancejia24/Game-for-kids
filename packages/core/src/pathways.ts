import {normalizeWord,type WordState,result} from './index.ts';
export type PathStage='early-sounds'|'digraphs'|'repeated-letters'|'longer-words';
export type LearningMode='Kids'|'Teens'|'Adults';
export type LessonPathItem={word:string;stage:PathStage;prerequisites:readonly string[];goal:string};
export const STARTER_PATH:readonly LessonPathItem[]=[
 {word:'CAT',stage:'early-sounds',prerequisites:[],goal:'Identify beginning consonant and short vowel sounds'},
 {word:'FISH',stage:'digraphs',prerequisites:['CAT'],goal:'Recognize the final sh digraph'},
 {word:'BANANA',stage:'repeated-letters',prerequisites:['FISH'],goal:'Arrange repeated letter instances'},
 {word:'STRAWBERRY',stage:'longer-words',prerequisites:['BANANA'],goal:'Sequence a ten-letter word with a consonant blend'}
];
export type MasteryRecord={word:string;independent:number;assisted:number;needsPractice:number;lastResult:'independent'|'assisted'|'incorrect'};
export type LearningProgress={schema:1;records:MasteryRecord[]};
export function blankProgress():LearningProgress{return {schema:1,records:[]};}
export function mastered(progress:LearningProgress,word:string):boolean{
 return (progress.records.find(r=>r.word===word)?.independent??0)>=2;
}
/** A single assisted or lucky attempt never unlocks the next phonics stage. */
export function recommendedLesson(progress:LearningProgress,path:readonly LessonPathItem[]=STARTER_PATH):LessonPathItem|null{
 for(const lesson of path){
  if(!lesson.prerequisites.every(word=>mastered(progress,word)))return path.find(x=>!mastered(progress,x.word)&&x.prerequisites.every(p=>mastered(progress,p)))??path[0]??null;
  if(!mastered(progress,lesson.word))return lesson;
 }
 return null;
}
export function recordAttempt(progress:LearningProgress,word:string,attempt:'independent'|'assisted'|'incorrect'):LearningProgress{
 const normalized=normalizeWord(word);
 const old=progress.records.find(r=>r.word===normalized);
 const row:MasteryRecord=old??{word:normalized,independent:0,assisted:0,needsPractice:0,lastResult:'incorrect'};
 const updated={...row,independent:row.independent+(attempt==='independent'?1:0),assisted:row.assisted+(attempt==='assisted'?1:0),needsPractice:row.needsPractice+(attempt==='incorrect'?1:0),lastResult:attempt};
 return {schema:1,records:[...progress.records.filter(r=>r.word!==normalized),updated]};
}
export function attemptFromState(state:WordState):'independent'|'assisted'|'incorrect'{
 const r=result(state);return !r.correct?'incorrect':r.independent?'independent':'assisted';
}
export function safeRestoreProgress(raw:string|null,allowedWords:readonly string[]):LearningProgress{
 if(!raw)return blankProgress();
 try{
  const p:unknown=JSON.parse(raw);if(!p||typeof p!=='object')return blankProgress();
  const v=p as Partial<LearningProgress>;
  if(v.schema!==1||!Array.isArray(v.records)||v.records.length>1000)return blankProgress();
  const known=new Set(allowedWords);const seen=new Set<string>();
  for(const r of v.records){
   if(!r||typeof r.word!=='string'||!known.has(r.word)||seen.has(r.word))return blankProgress();
   seen.add(r.word);
   if(!(['independent','assisted','incorrect'] as const).includes(r.lastResult))return blankProgress();
   if(![r.independent,r.assisted,r.needsPractice].every(n=>Number.isSafeInteger(n)&&n>=0&&n<=100000))return blankProgress();
  }
  return v as LearningProgress;
 }catch{return blankProgress();}
}
