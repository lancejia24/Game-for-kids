/**
 * Offline-first phoneme sequence planning. This does NOT synthesize speech:
 * every segment must point to an educator-reviewed, licensed local recording.
 * No external service is called, and nothing about IPA is inferred from spelling.
 */
export type PhonemeSegment={
 grapheme:string;ipa:string;start:number;end:number;
 audioPath:string|null;reviewed:boolean;
};
export type PhonemeLesson={
 word:string;locale:'en-US';status:'development'|'approved';
 segments:readonly PhonemeSegment[];
};
export type PlaybackUnit={grapheme:string;ipa:string;uri:string};
export type PhonemePlaybackPlan={units:readonly PlaybackUnit[];gapMs:number};
const PATH=/^\/audio\/phonemes\/v[1-9]\d*\/[A-Za-z0-9_-]+\.mp3$/;
export function validateLesson(lesson:PhonemeLesson):boolean{
 if(!/^[A-Z]{2,10}$/.test(lesson.word)||lesson.locale!=='en-US'||!lesson.segments.length)return false;
 let next=0;let joined='';
 for(const segment of lesson.segments){
  if(!segment.grapheme||!/^[A-Z]+$/.test(segment.grapheme)||!segment.ipa.trim())return false;
  if(segment.start!==next||segment.end!==next+segment.grapheme.length)return false;
  next=segment.end;joined+=segment.grapheme;
  if(segment.audioPath!==null&&!PATH.test(segment.audioPath))return false;
  if(lesson.status==='approved'&&(!segment.reviewed||!segment.audioPath))return false;
 }
 return joined===lesson.word;
}
/** Clamps pauses; zero gaps can clip sounds, so at least 20ms is used. */
export function gapForMode(mode:'isolated'|'blended',customMs?:number):number{
 const value=customMs??(mode==='isolated'?300:65);
 if(!Number.isFinite(value))throw new Error('Invalid phoneme timing');
 return Math.max(20,Math.min(1000,Math.round(value)));
}
export function planPhonemePlayback(lesson:PhonemeLesson,mode:'isolated'|'blended'):PhonemePlaybackPlan|null{
 if(!validateLesson(lesson)||lesson.status!=='approved')return null;
 const units=lesson.segments.map(segment=>({grapheme:segment.grapheme,ipa:segment.ipa,uri:segment.audioPath!}));
 return {units,gapMs:gapForMode(mode)};
}
export interface PlaybackAdapter{
 /** Resolves only once the sound has actually finished, not when playback starts. */
 playToEnd(uri:string,signal?:AbortSignal):Promise<void>;
 pause(ms:number,signal?:AbortSignal):Promise<void>;
}
export async function playPhonemes(plan:PhonemePlaybackPlan,adapter:PlaybackAdapter,signal?:AbortSignal):Promise<void>{
 if(plan.units.length===0)return;
 for(let i=0;i<plan.units.length;i++){
  if(signal?.aborted)throw new Error('Playback cancelled');
  await adapter.playToEnd(plan.units[i].uri,signal);
  if(i!==plan.units.length-1){
   if(signal?.aborted)throw new Error('Playback cancelled');
   await adapter.pause(plan.gapMs,signal);
  }
 }
}
/** Unapproved candidate segmentation. IPA/audio mapping must be reviewed. */
export const DEMO_SEGMENTS:readonly PhonemeLesson[]=[
 {word:'CAT',locale:'en-US',status:'development',segments:[
  {grapheme:'C',ipa:'k',start:0,end:1,audioPath:null,reviewed:false},
  {grapheme:'A',ipa:'æ',start:1,end:2,audioPath:null,reviewed:false},
  {grapheme:'T',ipa:'t',start:2,end:3,audioPath:null,reviewed:false}
 ]},
 {word:'FISH',locale:'en-US',status:'development',segments:[
  {grapheme:'F',ipa:'f',start:0,end:1,audioPath:null,reviewed:false},
  {grapheme:'I',ipa:'ɪ',start:1,end:2,audioPath:null,reviewed:false},
  {grapheme:'SH',ipa:'ʃ',start:2,end:4,audioPath:null,reviewed:false}
 ]}
];
