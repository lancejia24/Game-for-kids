'use client';
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {DEMO_SEGMENTS} from '@wordpath/core';

/** Development-only spoken cues. They are not approved isolated phoneme audio. */
const CUES:Record<string,string>={
 C:'kuh',A:'a',T:'tuh',F:'fff',I:'ih',SH:'shhh',
 B:'buh',N:'nnn',S:'sss',R:'rrr',W:'wuh',E:'eh',Y:'ee',H:'hhh'
};
type Segment={grapheme:string;cue:string};
function segmentsFor(word:string):Segment[]{
 const authored=DEMO_SEGMENTS.find(x=>x.word===word);
 if(authored)return authored.segments.map(x=>({grapheme:x.grapheme,cue:CUES[x.grapheme]??x.grapheme.toLowerCase()}));
 // Other sample words: letter-by-letter demo cues, NOT accurate GPC transcription.
 return [...word].map(grapheme=>({grapheme,cue:CUES[grapheme]??grapheme.toLowerCase()}));
}
export function SwipeBlend({word,enabled}:{word:string;enabled:boolean}){
 const segments=segmentsFor(word);
 const [active,setActive]=useState(-1);
 const [visited,setVisited]=useState<number[]>([]);
 const swipe=useRef<{pointerId:number;visited:Set<number>;last:number}|null>(null);
 const speak=useCallback((text:string,rate=0.75)=>{
  if(!enabled||typeof window==='undefined'||!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  const line=new SpeechSynthesisUtterance(text);
  line.lang='en-US';line.rate=rate;
  window.speechSynthesis.speak(line);
 },[enabled]);
 const announce=useCallback((index:number)=>{
  setActive(index);
  speak(segments[index]?.cue??'',0.72);
 },[segments, speak]);
 useEffect(()=>()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();},[]);
 useEffect(()=>{setActive(-1);setVisited([]);swipe.current=null;},[word]);
 const indexAt=(x:number,y:number):number=>{
  const target=document.elementFromPoint(x,y);
  const segment=target?.closest('[data-blend-index]');
  if(!segment)return -1;
  const index=Number(segment.getAttribute('data-blend-index'));
  return Number.isInteger(index)&&index>=0&&index<segments.length?index:-1;
 };
 const step=(index:number)=>{
  const current=swipe.current;
  if(!current||index<0||index===current.last)return;
  // Only move forward to adjacent sounds. Reverse sweeps reset gracefully.
  if(current.last>=0&&index!==current.last+1)return;
  current.last=index;current.visited.add(index);
  setVisited([...current.visited]);announce(index);
 };
 const end=()=>{
  const current=swipe.current;swipe.current=null;
  if(!current)return;
  if(current.visited.size===segments.length&&current.last===segments.length-1){
   setActive(-1);
   speak(word.toLowerCase(),0.68);
  }else setActive(-1);
 };
 return <section className="blend-lab" aria-label={'Listen and blend '+word}>
  <h3>👆 Touch each sound, then slide across!</h3>
  <p>Tap a sound to hear it. Swipe left to right without lifting your finger to hear the sounds followed by the whole word.</p>
  <div className="blend-track" role="group" aria-label={'Sounds for '+word}
   onPointerDown={e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    const index=indexAt(e.clientX,e.clientY);
    if(index<0)return;
    e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);
    swipe.current={pointerId:e.pointerId,visited:new Set(),last:-1};step(index);
   }}
   onPointerMove={e=>{if(swipe.current?.pointerId!==e.pointerId)return;step(indexAt(e.clientX,e.clientY));}}
   onPointerUp={e=>{if(swipe.current?.pointerId===e.pointerId)end();}}
   onPointerCancel={end}
  >{segments.map((segment,index)=><button type="button" key={index} data-blend-index={index}
    className={'blend-sound'+(active===index?' sounding':'')+(visited.includes(index)?' heard':'')}
    aria-label={'Hear sound '+(index+1)+' '+segment.grapheme} onClick={()=>{if(!swipe.current)announce(index);}}>
    {segment.grapheme}
   </button>)}</div>
  <button type="button" className="blend-replay" onClick={()=>speak(word.toLowerCase(),0.7)} disabled={!enabled}>🔊 Hear {word}</button>
  <p className="tiny-caption">{enabled?'Temporary device voice: approximated sound cues, not educator-reviewed phonemes.':'Enable saved audio / device voice above to hear sounds.'} Real reviewed phoneme recordings will replace these cues.</p>
 </section>;
}
