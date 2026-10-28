'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {getSpeechEntry} from '@wordpath/core';

/** Browser playback of verified static audio. No cloud synthesis. No text is submitted by learners. */
export function useNarration(){
 const [enabled,setEnabled]=useState(false);
 const [error,setError]=useState('');
 const current=useRef<HTMLAudioElement|null>(null);
 const stop=useCallback(()=>{
  if(current.current){current.current.pause();current.current.removeAttribute('src');current.current.load();current.current=null;}
 },[]);
 const play=useCallback((id:string)=>{
  if(!getSpeechEntry(id))return;
  stop();setError('');
  const audio=new Audio('/api/narration?id='+encodeURIComponent(id));
  current.current=audio;
  audio.onerror=()=>{if(current.current===audio)setError('No approved recording is available for this lesson. Use written instructions.');};
  void audio.play().catch(()=>{if(current.current===audio)setError('Audio playback could not start. Tap Replay to try again.');});
 },[stop]);
 useEffect(()=>stop,[stop]);
 const toggle=useCallback(()=>setEnabled(value=>{if(value)stop();return !value;}),[stop]);
 return {enabled,toggle,play,stop,error};
}
