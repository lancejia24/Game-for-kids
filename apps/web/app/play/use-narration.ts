'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {approvedAsset,getSpeechEntry} from '@wordpath/core';

/**
 * Free, opt-in browser narration: licensed static MP3 first, then local device TTS.
 * Browser speech is synthetic, not a human recording. No Azure or paid API.
 */
export function useNarration(){
 const [enabled,setEnabled]=useState(false);
 const [error,setError]=useState('');
 const current=useRef<HTMLAudioElement|null>(null);
 const stop=useCallback(()=>{
  if(current.current){current.current.pause();current.current.removeAttribute('src');current.current.load();current.current=null;}
  if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();
 },[]);
 const play=useCallback((id:string)=>{
  const entry=getSpeechEntry(id);
  if(!entry)return;
  stop();setError('');
  const asset=approvedAsset(id,'human-recorded')??approvedAsset(id,'local-open-source');
  if(asset){
   const audio=new Audio(asset.path);
   current.current=audio;
   audio.onerror=()=>{if(current.current===audio)setError('Saved recording could not load. Check the approved MP3 file.');};
   void audio.play().catch(()=>{if(current.current===audio)setError('Sound did not start. Tap Replay to try again.');});
   return;
  }
  if(typeof window==='undefined'||!('speechSynthesis' in window)){
   setError('This browser does not support device narration and no approved recording is available.');
   return;
  }
  const utterance=new SpeechSynthesisUtterance(entry.text);
  utterance.lang='en-US';utterance.rate=0.85;utterance.pitch=1;
  utterance.onerror=(event)=>{if(event.error!=='canceled'&&event.error!=='interrupted')setError('Device voice unavailable. Try tapping Replay or enable a system voice.');};
  window.speechSynthesis.speak(utterance);
 },[stop]);
 useEffect(()=>stop,[stop]);
 const toggle=useCallback(()=>setEnabled(value=>{if(value)stop();return !value;}),[stop]);
 return {enabled,toggle,play,stop,error};
}
