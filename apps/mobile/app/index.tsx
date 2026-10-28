import React,{useState} from 'react';
import {View,Text,ScrollView,Pressable,StyleSheet,useWindowDimensions} from 'react-native';
import * as Speech from 'expo-speech';
import {apply,isCorrect,nextHint,startWord,type WordState} from '@wordpath/core';

const lessons=[
 {word:'CAT',icon:'🐈',meaning:'A small animal that often lives with people.',sound:'C',choices:['C','T','M'],phonics:'The letter C makes the /k/ sound at the start of CAT.'},
 {word:'FISH',icon:'🐟',meaning:'An animal that swims in water.',sound:'SH',choices:['CH','SH','TH'],phonics:'The letters S and H work together to make one /sh/ sound.'},
 {word:'BANANA',icon:'🍌',meaning:'A long yellow fruit.',sound:'B',choices:['D','B','P'],phonics:'The letter B makes the /b/ sound at the start of BANANA.'},
 {word:'STRAWBERRY',icon:'🍓',meaning:'A red fruit with tiny seeds.',sound:'ST',choices:['ST','SH','CH'],phonics:'ST is a blend. Hear /s/ and /t/ together at the start.'}
];

export default function Game(){
 const [mode,setMode]=useState<'Kids'|'Teens'|'Adults'>('Kids');
 const [step,setStep]=useState(0);
 const [phase,setPhase]=useState<'sound'|'spell'|'meaning'|'done'>('sound');
 const [choice,setChoice]=useState<string|null>(null);
 const [state,setState]=useState<WordState>(()=>startWord(lessons[0].word));
 const [message,setMessage]=useState('Choose the letters that match the sound.');
 const {width}=useWindowDimensions();
 const lesson=lessons[Math.min(step,lessons.length-1)];
 const say=(value:string)=>Speech.speak(value,{rate:0.82,language:'en-US'});
 const move=(id:string,slot:number)=>setState(s=>apply(s,{kind:'place',tileId:id,slot}));
 const pick=(id:string)=>setState(s=>apply(s,{kind:'select',tileId:s.selected===id?null:id}));
 const advance=()=>{
  if(step===lessons.length-1){setPhase('done');return;}
  const next=step+1;
  setStep(next);setState(startWord(lessons[next].word));
  setChoice(null);setPhase('sound');
  setMessage('Choose the letters that match the sound.');
 };
 const button=(label:string,action:()=>void,disabled=false)=><Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={action} style={[styles.button,disabled&&styles.disabled]}><Text style={styles.buttonText}>{label}</Text></Pressable>;
 return <ScrollView contentContainerStyle={styles.page}>
  <Text style={styles.brand}>WordPath</Text>
  <Text style={styles.sub}>Listen • Learn • Build</Text>
  <View style={styles.modes}>{(['Kids','Teens','Adults'] as const).map(item=><Pressable key={item} onPress={()=>setMode(item)} style={[styles.mode,mode===item&&styles.active]} accessibilityRole="button" accessibilityLabel={item+' mode'}><Text style={styles.modeText}>{item}</Text></Pressable>)}</View>
  <Text style={styles.progress}>Lesson {Math.min(step+1,lessons.length)} of {lessons.length} • {mode} Mode</Text>
  {phase==='sound'?<View style={styles.card}>
   <Text style={styles.heading}>Hear the sound</Text>
   <Text style={styles.prompt}>Find the letters you hear.</Text>
   {button('🔊 Play sound',()=>say(lesson.sound==='SH'?'sh':lesson.sound==='ST'?'s, t':lesson.sound.toLowerCase()))}
   <View style={styles.choices}>{lesson.choices.map(c=><Pressable accessibilityRole="button" accessibilityLabel={'Choose '+c} key={c} style={[styles.tile,choice===c&&styles.selected]} onPress={()=>{setChoice(c);if(c===lesson.sound){setMessage(lesson.phonics);say(lesson.phonics);}else{setMessage('Try again. Replay the sound.');}}}><Text style={styles.letter}>{c}</Text></Pressable>)}</View>
   <Text style={styles.info}>{message}</Text>
   {button('Continue to spelling',()=>{setPhase('spell');setMessage('Move each letter into a slot. Tap a tile, then a slot.');say(lesson.word);},choice!==lesson.sound)}
  </View>:null}
  {phase==='spell'?<View style={styles.card}>
   <Text style={styles.heading}>Build the word</Text>
   <Text style={styles.picture}>{lesson.icon}</Text>
   <Text style={styles.prompt}>What word is this?</Text>
   {button('🔊 Hear word again',()=>say(lesson.word))}
   <View style={styles.slots}>{state.slots.map((id,i)=><Pressable key={i} accessibilityRole="button" accessibilityLabel={'Answer position '+(i+1)+(id?', '+state.tiles.find(t=>t.id===id)?.letter:' empty')} style={[styles.slot,{width:width<380?52:57,height:57}]} onPress={()=>{if(state.selected){move(state.selected,i)}else if(id){pick(id)}}}><Text style={styles.letter}>{id?state.tiles.find(t=>t.id===id)?.letter:'_'}</Text></Pressable>)}</View>
   <Text style={styles.prompt}>Letter tray (tap a letter, then an answer slot)</Text>
   <View style={styles.slots}>{state.tiles.filter(t=>!state.slots.includes(t.id)).map(t=><Pressable key={t.id} accessibilityRole="button" accessibilityLabel={'Select letter '+t.letter} onPress={()=>pick(t.id)} style={[styles.tile,state.selected===t.id&&styles.selected]}><Text style={styles.letter}>{t.letter}</Text></Pressable>)}</View>
   <Text style={styles.info}>{message}</Text>
   <View style={styles.actions}>
    {button('Hint',()=>{setMessage(nextHint(state));setState(s=>apply(s,{kind:'hint'}));})}
    {button('Undo',()=>setState(s=>apply(s,{kind:'undo'})))}
    {button('Reset',()=>setState(s=>apply(s,{kind:'reset'})))}
   </View>
   {button('Check word',()=>{if(isCorrect(state)){setState(s=>apply(s,{kind:'check'}));setPhase('meaning');say('Excellent. '+lesson.word+'. '+lesson.meaning);}else{setMessage('Not quite. Listen and try rearranging the letters.');say(lesson.word);}},state.slots.some(s=>s===null))}
   <Text style={styles.note}>Accessibility fallback: tap a placed letter to select it, then tap another slot to move or swap. Full drag gestures are coming next.</Text>
  </View>:null}
  {phase==='meaning'?<View style={styles.card}>
   <Text style={styles.picture}>{lesson.icon}</Text>
   <Text style={styles.heading}>{lesson.word}</Text>
   <Text style={styles.prompt}>{lesson.meaning}</Text>
   <Text style={styles.info}>{lesson.phonics}</Text>
   {button('🔊 Replay',()=>say(lesson.word+'. '+lesson.meaning))}
   {button(step===lessons.length-1?'Finish lesson':'Next word',advance)}
  </View>:null}
  {phase==='done'?<View style={styles.card}>
   <Text style={styles.heading}>🌟 Lesson complete!</Text>
   <Text style={styles.prompt}>You practiced sounds and built four words.</Text>
   {button('Play again',()=>{setStep(0);setPhase('sound');setState(startWord(lessons[0].word));setChoice(null);})}
  </View>:null}
  <Text style={styles.note}>Development-only starter: synthesized device speech, emoji illustrations and temporary lesson data. Progress is not yet persisted or synchronized. No account is required.</Text>
 </ScrollView>;
}
const styles=StyleSheet.create({
 page:{alignItems:'center',padding:20,paddingTop:55,paddingBottom:80,backgroundColor:'#f4f8ff',minHeight:'100%'},
 brand:{fontSize:36,fontWeight:'800',color:'#163b77'},
 sub:{color:'#425a7b',fontSize:16,marginBottom:18},
 modes:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:8},
 mode:{padding:12,borderRadius:14,backgroundColor:'#d9e5f7'},
 active:{backgroundColor:'#88cbff'},
 modeText:{fontWeight:'700',color:'#162c4d'},
 progress:{marginVertical:18,fontSize:16,color:'#24374e'},
 card:{width:'100%',maxWidth:640,borderRadius:20,backgroundColor:'white',padding:18,alignItems:'center',gap:14},
 heading:{fontSize:26,fontWeight:'800',color:'#18345b',textAlign:'center'},
 prompt:{fontSize:18,textAlign:'center',color:'#253b5c'},
 picture:{fontSize:78},
 button:{backgroundColor:'#1761bc',paddingVertical:13,paddingHorizontal:18,borderRadius:14,minHeight:48,justifyContent:'center'},
 buttonText:{color:'white',fontSize:16,fontWeight:'700',textAlign:'center'},
 disabled:{opacity:0.4},
 choices:{flexDirection:'row',gap:12,justifyContent:'center',flexWrap:'wrap'},
 tile:{backgroundColor:'#d8ebff',borderWidth:2,borderColor:'#8db7e6',borderRadius:12,width:52,height:55,justifyContent:'center',alignItems:'center',margin:3},
 selected:{backgroundColor:'#ffdf87',borderColor:'#bc7c00'},
 slot:{backgroundColor:'#f6f8fc',borderColor:'#849cbd',borderWidth:2,borderRadius:10,alignItems:'center',justifyContent:'center',margin:2},
 slots:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',maxWidth:580},
 letter:{fontSize:23,fontWeight:'800',color:'#18345b'},
 info:{fontSize:16,color:'#264b78',textAlign:'center',minHeight:40},
 actions:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:7},
 note:{fontSize:12,color:'#68778a',textAlign:'center',maxWidth:630}
});
