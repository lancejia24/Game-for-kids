'use client';
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {DEMO_SEGMENTS} from '@wordpath/core';

/**
 * We intentionally do NOT pronounce isolated phonemes with browser TTS.
 * Approximation syllables such as "kuh"/"tuh" add erroneous schwas and are
 * damaging phonics cues. Real, reviewed phoneme recordings are required.
 */
function soundGroups(word:string):string[]{
 const lesson=DEMO_SEGMENTS.find(x=>x.word===word);
 return lesson?lesson.segments.map(x=>x.grapheme):[...word];
}
export function SwipeBlend({word,enabled}:{word:string;enabled:boolean}){
 const groups=soundGroups(word);
 const [active,setActive]=useState(-1);
 const [visited,setVisited]=useState<number[]>([]);
 const gesture=useRef<{id:number;last:number;seen:Set<number>}|null>(null);
 const speakWord=useCallback(()=>{
  if(!enabled||typeof window==='undefined'||!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  const line=new SpeechSynthesisUtterance(word.toLowerCase());
  line.lang='en-US';line.rate=.8;
  window.speechSynthesis.speak(line);
 },[enabled,word]);
 useEffect(()=>{setActive(-1);setVisited([]);gesture.current=null;},[word]);
 useEffect(()=>()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();},[]);
 const indexAt=(x:number,y:number)=>{
  const el=document.elementFromPoint(x,y)?.closest('[data-blend-index]');
  const index=el?Number(el.getAttribute('data-blend-index')):-1;
  return Number.isInteger(index)&&index>=0&&index<groups.length?index:-1;
 };
 const step=(index:number)=>{
  const g=gesture.current;
  if(!g||index<0||index===g.last)return;
  if(g.last>=0&&index!==g.last+1)return;
  g.last=index;g.seen.add(index);setVisited([...g.seen]);setActive(index);
 };
 const end=()=>{
  const g=gesture.current;gesture.current=null;setActive(-1);
  if(g&&g.seen.size===groups.length&&g.last===groups.length-1)speakWord();
 };
 return <section className="blend-lab" aria-label={'Practice sounds and blend '+word}>
  <h3>👆 Trace across the sounds</h3>
  <p>Tap a letter group to highlight it. Slide from left to right to follow the word, then hear the whole word.</p>
  <div className="blend-track" role="group" aria-label={'Sound groups of '+word}
   onPointerDown={e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    const index=indexAt(e.clientX,e.clientY);
    if(index<0)return;
    e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current={id:e.pointerId,last:-1,seen:new Set()};step(index);
   }}
   onPointerMove={e=>{if(gesture.current?.id===e.pointerId)step(indexAt(e.clientX,e.clientY));}}
   onPointerUp={e=>{if(gesture.current?.id===e.pointerId)end();}}
   onPointerCancel={end}
  >{groups.map((group,index)=><button type="button" key={index} data-blend-index={index}
   className={'blend-sound'+(active===index?' sounding':'')+(visited.includes(index)?' heard':'')}
   aria-label={'Highlight sound group '+(index+1)+' '+group}
   onClick={e=>{if(e.detail===0){setActive(index);setVisited([index]);}}}>{group}</button>)}</div>
  <button type="button" className="blend-replay" onClick={speakWord} disabled={!enabled}>🔊 Hear {word}</button>
  <p className="tiny-caption">Individual sound audio is temporarily unavailable until verified phoneme recordings are added. The whole-word voice is synthetic and may vary by device. We will not teach incorrect “kuh” or “tuh” sounds.</p>
 </section>;
}
