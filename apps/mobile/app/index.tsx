import React,{useEffect,useRef,useState} from 'react';
import {View,Text,ScrollView,Pressable,StyleSheet,useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HumanAudioButton} from '../src/audio/HumanAudioButton';
import {apply,isCorrect,newSession,nextHint,resolveDrop,startWord,type Rectangle,type SavedSession} from '@wordpath/core';
import {DraggableTile} from '../src/components/DraggableTile';
import {STARTER_LESSONS,STARTER_WORDS} from '../src/data/starterLessons';
import {loadSession,saveSession} from '../src/offline/session';

function measure(view:View|null):Promise<Rectangle|null>{
 return new Promise(resolve=>{
  if(!view){resolve(null);return;}
  view.measureInWindow((x,y,width,height)=>resolve(width>0&&height>0?{x,y,width,height}:null));
 });
}
export default function Game(){
 const [session,setSession]=useState<SavedSession>(()=>newSession(STARTER_WORDS));
 const [ready,setReady]=useState(false);
 const [storageWarning,setStorageWarning]=useState(false);
 const [message,setMessage]=useState('Choose the letters that match the sound.');
 const [ssmlNarration,setSsmlNarration]=useState(false);
 const [announcement,setAnnouncement]=useState<string|null>(null);
 const slotRefs=useRef<(View|null)[]>([]);
 const trayRef=useRef<View|null>(null);
 const {width}=useWindowDimensions();
 const tileSize=width<360?44:width<430?49:57;
 const perRow=width<320?4:5;
 const {step,phase,state,mode,choice,completedWords}=session;
 const lesson=STARTER_LESSONS[Math.min(step,STARTER_LESSONS.length-1)];
 const update=(patch:Partial<SavedSession>)=>setSession(current=>({...current,...patch}));
 useEffect(()=>{
  let mounted=true;
  loadSession().then(saved=>{if(mounted&&saved){setSession(saved);setMessage('Your offline lesson has been restored.');}})
   .catch(()=>{if(mounted)setStorageWarning(true);})
   .finally(()=>{if(mounted)setReady(true);});
  return ()=>{mounted=false;};
 },[]);
 useEffect(()=>{if(ready){saveSession(session).catch(()=>setStorageWarning(true));}},[ready,session]);
 const changeState=(action:Parameters<typeof apply>[1])=>setSession(current=>({...current,state:apply(current.state,action)}));
 const move=(id:string,slot:number)=>changeState({kind:'place',tileId:id,slot});
 const pick=(id:string)=>setSession(current=>({...current,state:apply(current.state,{kind:'select',tileId:current.state.selected===id?null:id})}));
 const tapTile=(id:string,slot:number|null)=>{
  if(slot!==null&&state.selected&&state.selected!==id)move(state.selected,slot);
  else pick(id);
 };
 const drop=async(id:string,x:number,y:number)=>{
  const slots=await Promise.all(state.slots.map((_,i)=>measure(slotRefs.current[i]??null)));
  const tray=await measure(trayRef.current);
  const target=resolveDrop(x,y,slots,tray);
  if(target?.kind==='slot')move(id,target.index);
  if(target?.kind==='tray')changeState({kind:'return',tileId:id});
 };
 const advance=()=>{
  if(step===STARTER_LESSONS.length-1){update({phase:'done'});return;}
  const next=step+1;
  update({step:next,phase:'sound',choice:null,state:startWord(STARTER_LESSONS[next].word)});
  setMessage('Choose the letters that match the sound.');
  setAnnouncement(null);
 };
 const check=()=>{
  if(!isCorrect(state)){
   changeState({kind:'check'});
   setMessage('Not quite. Review the word and rearrange the letters.');
   setAnnouncement('game:retry');
   return;
  }
  setSession(current=>({
   ...current,phase:'meaning',state:apply(current.state,{kind:'check'}),
   completedWords:current.completedWords.includes(lesson.word)?current.completedWords:[...current.completedWords,lesson.word]
  }));
 };
 const button=(label:string,action:()=>void,disabled=false)=><Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={action} style={[styles.button,disabled&&styles.disabled]}><Text style={styles.buttonText}>{label}</Text></Pressable>;
 const slotRows=[];
 for(let offset=0;offset<state.slots.length;offset+=perRow){
  slotRows.push(<View style={styles.slots} key={offset}>{state.slots.slice(offset,offset+perRow).map((id,i)=>{
   const index=offset+i;
   const tile=state.tiles.find(t=>t.id===id);
   return <View key={index} ref={view=>{slotRefs.current[index]=view;}} collapsable={false} style={[styles.slot,{width:tileSize+4,height:tileSize+4}]}>
    {tile?<DraggableTile tileId={tile.id} letter={tile.letter} selected={state.selected===tile.id} size={tileSize} onTap={item=>tapTile(item,index)} onDrop={drop}/>:
     <Pressable accessibilityRole="button" accessibilityLabel={'Empty letter position '+(index+1)} onPress={()=>{if(state.selected)move(state.selected,index);}} style={styles.emptySlot}><Text style={styles.slotText}>_</Text></Pressable>}
   </View>;
  })}</View>);
 }
 return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="always">
  <Text style={styles.brand}>WordPath</Text><Text style={styles.sub}>Listen • Learn • Build</Text>
  <View style={styles.modes}>{(['Kids','Teens','Adults'] as const).map(item=><Pressable key={item} accessibilityRole="button" accessibilityState={{selected:mode===item}} onPress={()=>update({mode:item})} style={[styles.mode,mode===item&&styles.active]}><Text style={styles.modeText}>{item}</Text></Pressable>)}</View>
  <Text style={styles.progress}>Lesson {step+1} of {STARTER_LESSONS.length} • {mode} Mode</Text>
  {button(ssmlNarration?'SSML narration ON (synthetic)':'Enable SSML + IPA narration',()=>{setSsmlNarration(x=>!x);setAnnouncement(null);})}
  <Text style={styles.note}>SSML voices are synthesized. Approved human recordings are used first when available. Audio requires Internet until verified recordings are bundled.</Text>
  {!ready?<Text accessibilityRole="text">Loading your offline lesson…</Text>:null}
  {ready&&phase==='sound'?<View style={styles.card}>
   <Text style={styles.heading}>Hear the sound</Text>
   <Text style={styles.prompt}>{lesson.prompt}</Text>
   <HumanAudioButton key={lesson.word+':prompt:'+ssmlNarration} clipId={lesson.word+':prompt'} label="Replay spoken phonics prompt" allowSynthetic={ssmlNarration} autoPlay={ssmlNarration}/>
   <View style={styles.choices}>{lesson.choices.map(c=><Pressable accessibilityRole="button" accessibilityLabel={'Choose '+c} key={c} style={[styles.choice,choice===c&&styles.selected]} onPress={()=>{
    update({choice:c});if(c===lesson.sound){setMessage(lesson.phonics);setAnnouncement(null);}else{setMessage('Try again. Review the instruction.');setAnnouncement('game:retry');}
   }}><Text style={styles.letter}>{c}</Text></Pressable>)}</View>
   <Text style={styles.info}>{message}</Text>
   {choice===lesson.sound?<HumanAudioButton key={lesson.word+':phonics:'+ssmlNarration} clipId={lesson.word+':phonics'} label="Hear sound explanation" allowSynthetic={ssmlNarration} autoPlay={ssmlNarration}/>:null}
   {button('Continue to spelling',()=>{update({phase:'spell'});setAnnouncement(null);setMessage('Tap a letter and then a slot, or drag it to the slot.');},choice!==lesson.sound)}
  </View>:null}
  {ready&&phase==='spell'?<View style={styles.card}>
   <Text style={styles.heading}>Build the word</Text><Text style={styles.picture}>{lesson.icon}</Text>
   <Text style={styles.prompt}>What word is this?</Text>
   <HumanAudioButton key={lesson.word+':spell:'+ssmlNarration} clipId={lesson.word+':spell'} label="Hear spelling instructions" allowSynthetic={ssmlNarration} autoPlay={ssmlNarration}/>
   <HumanAudioButton key={lesson.word+':word:'+ssmlNarration} clipId={lesson.word+':word'} label="Replay word pronunciation with IPA" allowSynthetic={ssmlNarration}/>
   <View style={styles.answer}>{slotRows}</View>
   <Text style={styles.prompt}>Move the letter tiles into the answer slots</Text>
   <View ref={view=>{trayRef.current=view;}} collapsable={false} style={styles.tray}>
    {state.tiles.filter(t=>!state.slots.includes(t.id)).map(t=><DraggableTile key={t.id} tileId={t.id} letter={t.letter} selected={state.selected===t.id} size={tileSize} onTap={pick} onDrop={drop}/>)}
    {state.tiles.every(t=>state.slots.includes(t.id))?<Text style={styles.note}>Drag a letter back here to return it.</Text>:null}
   </View>
   {state.selected&&state.slots.includes(state.selected)?button('Return selected letter to tray',()=>changeState({kind:'return',tileId:state.selected!})):null}
   <Text style={styles.info}>{message}</Text>
   {ssmlNarration&&announcement?<HumanAudioButton key={announcement+':'+state.hints+':'+state.checks} clipId={announcement} label="Replay feedback or hint" allowSynthetic autoPlay/>:null}
   <View style={styles.actions}>
    {button('Hint',()=>{setMessage(nextHint(state));setAnnouncement(lesson.word+':hint:'+Math.min(state.hints,3));changeState({kind:'hint'});})}
    {button('Undo',()=>changeState({kind:'undo'}),state.history.length===0)}
    {button('Reset',()=>changeState({kind:'reset'}))}
   </View>
   {button('Check word',check,state.slots.some(s=>s===null))}
   <Text style={styles.note}>Tap a tile, then a slot. You can also drag tiles between slots, swap them, or drag a letter back to the tray.</Text>
  </View>:null}
  {ready&&phase==='meaning'?<View style={styles.card}>
   <Text style={styles.picture}>{lesson.icon}</Text><Text style={styles.heading}>{lesson.word}</Text>
   <Text style={styles.prompt}>{lesson.meaning}</Text><Text style={styles.info}>{lesson.phonics}</Text>
   <Text style={styles.note}>{state.hints>0?'Completed with help. Keep practicing for independent mastery!':'Completed without hints.'}</Text>
   <HumanAudioButton key={lesson.word+':meaning:'+ssmlNarration} clipId={lesson.word+':meaning'} label="Hear definition" allowSynthetic={ssmlNarration} autoPlay={ssmlNarration}/>
   <HumanAudioButton key={lesson.word+':word-result:'+ssmlNarration} clipId={lesson.word+':word'} label="Replay IPA word pronunciation" allowSynthetic={ssmlNarration}/>
   {button(step===STARTER_LESSONS.length-1?'Finish lesson':'Next word',advance)}
  </View>:null}
  {ready&&phase==='done'?<View style={styles.card}>
   <Text style={styles.heading}>🌟 Lesson complete!</Text>
   <Text style={styles.prompt}>You practiced sounds and spelled {completedWords.length} words.</Text>
   <HumanAudioButton key={'game:complete:'+ssmlNarration} clipId="game:complete" label="Hear lesson celebration" allowSynthetic={ssmlNarration} autoPlay={ssmlNarration}/>
   {button('Play again',()=>{const fresh=newSession(STARTER_WORDS);update({...fresh,mode});setMessage('Choose the letters that match the sound.');setAnnouncement(null);})}
  </View>:null}
  {storageWarning?<Text style={styles.warning}>Unable to access local lesson storage. You can still play, but this session might not be saved.</Text>:null}
  <Text style={styles.note}>Offline guest demo. Optional synthetic SSML narration with sample IPA is clearly labelled; it does not meet the 100% human-recorded preference. IPA and emoji remain development-only.</Text>
 </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#f4f8ff'},page:{alignItems:'center',paddingHorizontal:12,paddingTop:18,paddingBottom:80,flexGrow:1},
 brand:{fontSize:34,fontWeight:'800',color:'#163b77'},sub:{color:'#425a7b',fontSize:16,marginBottom:16},
 modes:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:8},
 mode:{padding:12,minHeight:46,borderRadius:14,backgroundColor:'#d9e5f7'},active:{backgroundColor:'#88cbff'},
 modeText:{fontWeight:'700',color:'#162c4d'},progress:{marginVertical:16,fontSize:16,color:'#24374e'},
 card:{width:'100%',maxWidth:640,borderRadius:20,backgroundColor:'white',padding:14,alignItems:'center',gap:14},
 heading:{fontSize:26,fontWeight:'800',color:'#18345b',textAlign:'center'},prompt:{fontSize:17,textAlign:'center',color:'#253b5c'},picture:{fontSize:78},
 button:{backgroundColor:'#1761bc',paddingVertical:13,paddingHorizontal:12,borderRadius:14,minHeight:48,justifyContent:'center'},
 buttonText:{color:'white',fontSize:16,fontWeight:'700',textAlign:'center'},disabled:{opacity:0.4},
 choices:{flexDirection:'row',gap:12,justifyContent:'center',flexWrap:'wrap'},
 choice:{backgroundColor:'#d8ebff',borderWidth:2,borderColor:'#8db7e6',borderRadius:12,minWidth:55,minHeight:55,justifyContent:'center',alignItems:'center'},
 selected:{backgroundColor:'#ffdf87',borderColor:'#bc7c00'},
 answer:{width:'100%',alignItems:'center',gap:4},slots:{flexDirection:'row',justifyContent:'center'},
 slot:{margin:2,borderColor:'#849cbd',borderWidth:2,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:'#f6f8fc'},
 emptySlot:{flex:1,alignItems:'center',justifyContent:'center',minHeight:44},slotText:{fontSize:22,color:'#18345b'},
 tray:{width:'100%',minHeight:75,borderWidth:2,borderColor:'#a7bfd5',borderRadius:12,flexDirection:'row',flexWrap:'wrap',justifyContent:'center',alignItems:'center',padding:6,backgroundColor:'#edf5fc'},
 letter:{fontSize:23,fontWeight:'800',color:'#18345b'},info:{fontSize:16,color:'#264b78',textAlign:'center',minHeight:42},
 actions:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:7},
 note:{fontSize:12,color:'#68778a',textAlign:'center',maxWidth:630},warning:{fontSize:13,color:'#944222',textAlign:'center',margin:12}
});
