import React,{useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import {useAudioPlayer,useAudioPlayerStatus} from 'expo-audio';
import {humanVoiceClip} from './catalog';

/** Never synthesizes speech. Missing/unreviewed clips are visibly unavailable. */
export function HumanAudioButton({clipId,label}:{clipId:string;label:string}){
 const clip=humanVoiceClip(clipId);
 const player=useAudioPlayer(clip?.source??null);
 const status=useAudioPlayerStatus(player);
 const [error,setError]=useState('');
 const available=!!clip&&!status.error;
 const play=async()=>{
  if(!available)return;
  setError('');
  try{await player.seekTo(0);player.play();}catch{setError('Recording could not play. Please use the written text.');}
 };
 return <View style={styles.wrapper}>
  <Pressable accessibilityRole="button" accessibilityLabel={available?label:label+', human recording not yet available'} accessibilityState={{disabled:!available}} disabled={!available} onPress={play} style={[styles.button,!available&&styles.disabled]}>
   <Text style={styles.buttonText}>{available?'▶ '+label:'🔇 Human recording pending'}</Text>
  </Pressable>
  {!available?<Text style={styles.explanation}>Human narration has not been approved and uploaded for this activity. Read the on-screen instructions for now.</Text>:null}
  {status.error||error?<Text style={styles.error}>{error||'Recording failed to load. Please use the written text.'}</Text>:null}
 </View>;
}
const styles=StyleSheet.create({
 wrapper:{width:'100%',alignItems:'center',gap:4},
 button:{backgroundColor:'#1761bc',paddingVertical:13,paddingHorizontal:12,borderRadius:14,minHeight:48,justifyContent:'center'},
 disabled:{backgroundColor:'#63778e'},
 buttonText:{color:'white',fontSize:16,fontWeight:'700',textAlign:'center'},
 explanation:{fontSize:13,textAlign:'center',color:'#5d6880'},
 error:{fontSize:13,textAlign:'center',color:'#a44336'}
});
