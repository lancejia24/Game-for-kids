import React,{useEffect,useRef,useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import {useAudioPlayer,useAudioPlayerStatus} from 'expo-audio';
import {getSpeechEntry} from '@wordpath/core';
import {humanVoiceClip} from './catalog';

const WEB_BASE=(process.env.EXPO_PUBLIC_WORDPATH_WEB_URL||'https://game-for-kids-seven.vercel.app').replace(/\/$/,'');
/**
 * Human audio is preferred whenever an approved clip exists.
 * Synthetic SSML is only used after explicit in-app opt-in.
 */
export function HumanAudioButton({clipId,label,allowSynthetic=false,autoPlay=false}:{
 clipId:string;label:string;allowSynthetic?:boolean;autoPlay?:boolean;
}){
 const human=humanVoiceClip(clipId);
 const synthetic=allowSynthetic&&!human&&!!getSpeechEntry(clipId);
 const source=human?.source??(synthetic?{uri:WEB_BASE+'/api/narration?id='+encodeURIComponent(clipId)}:null);
 const player=useAudioPlayer(source);
 const status=useAudioPlayerStatus(player);
 const played=useRef('');
 const [error,setError]=useState('');
 const available=!!source;
 const play=async()=>{
  if(!available)return;
  setError('');
  try{await player.seekTo(0);player.play();}
  catch{setError('Audio could not play. Please read the on-screen text.');}
 };
 useEffect(()=>{
  if(!autoPlay||!available||!status.isLoaded||played.current===clipId)return;
  played.current=clipId;
  void play();
  // play is intentionally not a dependency. It only acts on the current player
  // at the moment the source finishes loading.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[autoPlay,available,status.isLoaded,clipId]);
 return <View style={styles.wrapper}>
  <Pressable accessibilityRole="button"
   accessibilityLabel={available?label:label+', spoken audio unavailable'}
   accessibilityState={{disabled:!available}} disabled={!available} onPress={play}
   style={[styles.button,!available&&styles.disabled]}>
   <Text style={styles.buttonText}>{available?'▶ '+label:allowSynthetic?'🔇 SSML narration unavailable':'🔇 Human recording pending'}</Text>
  </Pressable>
  {synthetic?<Text style={styles.synthetic}>Synthetic SSML / IPA voice. Not a recording of a person. Requires Internet and a configured Azure Speech service.</Text>:null}
  {!available?<Text style={styles.explanation}>No playable audio for this activity. Read the on-screen instructions for now.</Text>:null}
  {error?<Text style={styles.error}>{error}</Text>:null}
 </View>;
}
const styles=StyleSheet.create({
 wrapper:{width:'100%',alignItems:'center',gap:4},
 button:{backgroundColor:'#1761bc',paddingVertical:13,paddingHorizontal:12,borderRadius:14,minHeight:48,justifyContent:'center'},
 disabled:{backgroundColor:'#63778e'},
 buttonText:{color:'white',fontSize:16,fontWeight:'700',textAlign:'center'},
 explanation:{fontSize:13,textAlign:'center',color:'#5d6880'},
 synthetic:{fontSize:12,color:'#6b526e',textAlign:'center'},
 error:{fontSize:13,textAlign:'center',color:'#a44336'}
});
