import {createAudioPlayer} from 'expo-audio';
import type {PlaybackAdapter} from '@wordpath/core';
/**
 * Explicit Expo audio adapter. Only use absolute file:// paths to *verified*
 * audio pack files, never network URLs or arbitrary Supabase paths.
 */
export function createOfflinePhonemeAdapter():PlaybackAdapter{
 return {
  playToEnd(uri,signal){
   if(!uri.startsWith('file://'))return Promise.reject(new Error('Unverified audio path'));
   if(signal?.aborted)return Promise.reject(new Error('Playback cancelled'));
   return new Promise<void>((resolve,reject)=>{
    const player=createAudioPlayer({uri});
    let done=false;
    let listener:{remove():void}|undefined;
    const cleanup=()=>{listener?.remove();signal?.removeEventListener('abort',cancel);player.release();};
    const finish=(error?:Error)=>{if(done)return;done=true;cleanup();if(error)reject(error);else resolve();};
    const cancel=()=>finish(new Error('Playback cancelled'));
    signal?.addEventListener('abort',cancel,{once:true});
    listener=player.addListener('playbackStatusUpdate',status=>{
     if(status.didJustFinish)finish();
    });
    try{player.play();}catch{finish(new Error('Audio playback failed'));}
   });
  },
  pause(ms,signal){
   return new Promise<void>((resolve,reject)=>{
    if(signal?.aborted){reject(new Error('Playback cancelled'));return;}
    let finished=false;
    const done=(cancelled:boolean)=>{if(finished)return;finished=true;clearTimeout(timer);signal?.removeEventListener('abort',abort);cancelled?reject(new Error('Playback cancelled')):resolve();};
    const abort=()=>done(true);
    const timer=setTimeout(()=>done(false),ms);
    signal?.addEventListener('abort',abort,{once:true});
   });
  }
 };
}
