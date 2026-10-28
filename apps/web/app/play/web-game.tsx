'use client';
import React,{useEffect,useRef,useState} from 'react';
import {apply,isCorrect,nextHint,newSession,restoreSession,resolveDrop,serializeSession,startWord,type SavedSession,type Tile,type Place,type Rectangle} from '@wordpath/core';
import './play.css';
import {InteractiveCharacter} from './interactive-character';
type Lesson={word:string;picture:string;question:string;sound:string;choices:readonly string[];phonics:string;meaning:string};
const LESSONS:readonly Lesson[]=[
 {word:'CAT',picture:'🐈',question:'Which letter spells the first /k/ sound in cat?',sound:'C',choices:['C','M','T'],phonics:'C spells the /k/ sound at the start of CAT.',meaning:'A small animal that often lives with people.'},
 {word:'FISH',picture:'🐟',question:'Which letters spell the last /sh/ sound in fish?',sound:'SH',choices:['TH','CH','SH'],phonics:'S and H together spell one /sh/ sound. Use separate S and H tiles to spell FISH.',meaning:'An animal that swims in water.'},
 {word:'BANANA',picture:'🍌',question:'Which letter spells the first /b/ sound in banana?',sound:'B',choices:['D','B','P'],phonics:'B spells the /b/ sound at the start of BANANA.',meaning:'A long fruit with a yellow peel.'},
 {word:'STRAWBERRY',picture:'🍓',question:'Which two letters form the first blend in strawberry?',sound:'ST',choices:['ST','SH','CH'],phonics:'ST blends /s/ and /t/ sounds together at the beginning of STRAWBERRY.',meaning:'A sweet red fruit with little seeds.'},
];
const WORDS=LESSONS.map(x=>x.word);
const STORAGE='wordpath:web:guest:v1';
function rect(el:HTMLElement|null):Rectangle|null{if(!el)return null;const r=el.getBoundingClientRect();return {x:r.left,y:r.top,width:r.width,height:r.height};}
type DraggableProps={tile:Tile;selected:boolean;onChoose:(id:string)=>void;onMove:(id:string,x:number,y:number)=>void};
function Draggable({tile,selected,onChoose,onMove}:DraggableProps){
 const [offset,setOffset]=useState({x:0,y:0});
 const pointer=useRef<{id:number;x:number;y:number;moved:boolean}|null>(null);
 const suppress=useRef(false);
 return <button className={'letter-tile'+(pointer.current?.moved?' dragging':'')} type="button" draggable
  aria-label={'Letter '+tile.letter+'; select, drag, or move with keyboard'}
  aria-pressed={selected}
  style={{transform:offset.x||offset.y?`translate(${offset.x}px,${offset.y}px)`:undefined}}
  onClick={()=>{if(suppress.current){suppress.current=false;return;}onChoose(tile.id);}}
  onDragStart={e=>{e.dataTransfer.setData('text/plain',tile.id);e.dataTransfer.effectAllowed='move';}}
  onPointerDown={e=>{if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;pointer.current={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};e.currentTarget.setPointerCapture(e.pointerId);}}
  onPointerMove={e=>{const p=pointer.current;if(!p||p.id!==e.pointerId)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;if(Math.abs(dx)+Math.abs(dy)>12)p.moved=true;if(p.moved)setOffset({x:dx,y:dy});}}
  onPointerUp={e=>{const p=pointer.current;if(!p||p.id!==e.pointerId)return;if(p.moved){suppress.current=true;onMove(tile.id,e.clientX,e.clientY);}pointer.current=null;setOffset({x:0,y:0});}}
  onPointerCancel={()=>{pointer.current=null;setOffset({x:0,y:0});}}
 >{tile.letter}</button>;
}
export function WebGame(){
 const [session,setSession]=useState<SavedSession|null>(null);
 const [feedback,setFeedback]=useState('Choose the correct letters.');
 const [storageError,setStorageError]=useState(false);
 const slotsRef=useRef<(HTMLDivElement|null)[]>([]);
 const trayRef=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{try{const stored=window.localStorage.getItem(STORAGE);setSession(restoreSession(stored,WORDS)??newSession(WORDS));}catch{setStorageError(true);setSession(newSession(WORDS));}},[]);
 useEffect(()=>{if(session){try{window.localStorage.setItem(STORAGE,serializeSession(session));}catch{setStorageError(true);}}},[session]);
 if(!session)return <div className="play-loading">Opening your offline-friendly spelling demo…</div>;
 const {step,phase,state,mode,choice,completedWords}=session;
 const lesson=LESSONS[step];
 const patch=(value:Partial<SavedSession>)=>setSession(s=>s?{...s,...value}:s);
 const change=(action:Place)=>setSession(s=>s?{...s,state:apply(s.state,action)}:s);
 const pick=(id:string)=>setSession(s=>s?{...s,state:apply(s.state,{kind:'select',tileId:s.state.selected===id?null:id})}:s);
 const place=(index:number)=>{
  const chosen=state.selected;
  if(chosen){change({kind:'place',tileId:chosen,slot:index});}
  else if(state.slots[index])pick(state.slots[index]!);
 };
 const moveDrop=(id:string,x:number,y:number)=>{
  const drop=resolveDrop(x,y,state.slots.map((_,i)=>rect(slotsRef.current[i])),rect(trayRef.current));
  if(drop?.kind==='slot')change({kind:'place',tileId:id,slot:drop.index});
  else if(drop?.kind==='tray')change({kind:'return',tileId:id});
 };
 const onDropSlot=(e:React.DragEvent<HTMLDivElement>,index:number)=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(state.tiles.some(tile=>tile.id===id))change({kind:'place',tileId:id,slot:index});};
 const onDropTray=(e:React.DragEvent<HTMLDivElement>)=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(state.tiles.some(tile=>tile.id===id))change({kind:'return',tileId:id});};
 const tileNode=(id:string)=>{const tile=state.tiles.find(t=>t.id===id)!;return <Draggable key={tile.id} tile={tile} selected={state.selected===id} onChoose={pick} onMove={moveDrop}/>;};
 const next=()=>{
  if(step===LESSONS.length-1){patch({phase:'done'});return;}
  const nextStep=step+1;patch({step:nextStep,phase:'sound',choice:null,state:startWord(WORDS[nextStep])});
  setFeedback('Choose the correct letters.');
 };
 const check=()=>{
  if(isCorrect(state)){
   setSession(s=>s?{...s,phase:'meaning',state:apply(s.state,{kind:'check'}),completedWords:s.completedWords.includes(lesson.word)?s.completedWords:[...s.completedWords,lesson.word]}:s);
  }else{
   change({kind:'check'});setFeedback('Not quite. Try moving or swapping a letter.');
  }
 };
 const resetProgress=()=>{const replacement=newSession(WORDS);patch({...replacement,mode});setFeedback('Your demo has been reset.');};
 const tileCount=state.slots.length;
 return <div className="play-shell">
  <div className="play-heading"><p className="eyebrow">A PLAYABLE DEVELOPMENT PREVIEW</p><h1>Build a word. Learn a sound.</h1><p>Four sample challenges. No login, no ads, and your practice stays in this browser.</p></div>
  <div className="play-controls" role="group" aria-label="Presentation style">
   {(['Kids','Teens','Adults'] as const).map(m=><button className="mode-pill" aria-pressed={mode===m} onClick={()=>patch({mode:m})} key={m}>{m}</button>)}
  </div>
  <div className="step-count">Word {step+1} of {LESSONS.length} · {mode} Mode</div>
  <div className="play-card">
  {phase==='sound'?<>
   <h2 className="play-title">1. Recognize the sound</h2>
   <p className="play-prompt">{lesson.question}</p>
   <div className="human-audio-note" role="status">🔇 Human-recorded audio is being prepared. The text prompt is available while verified recordings are added.</div>
   <div className="sound-choices">{lesson.choices.map(c=><button className="choice-tile" key={c} aria-pressed={choice===c} onClick={()=>{patch({choice:c});setFeedback(c===lesson.sound?lesson.phonics:'Try another answer. Look at the letters in the example word.');}}>{c}</button>)}</div>
   <div className="feedback" role="status">{feedback}</div>
   <div className="tool-actions"><button className="button primary" disabled={choice!==lesson.sound} onClick={()=>{patch({phase:'spell'});setFeedback('Tap a letter then a slot, or drag tiles to build the word.');}}>Continue to spelling</button></div>
  </>:null}
  {phase==='spell'?<>
   <h2 className="play-title">2. Build the word</h2>
   <InteractiveCharacter key={'clue-'+lesson.word} word={lesson.word} unlocked={false}/>
   <p className="play-prompt">Arrange the letters to spell this word.</p>
   <div className="slot-rows" role="group" aria-label="Answer slots">
    {Array.from({length:Math.ceil(tileCount/5)},(_,row)=><div className="slot-row" key={row}>{state.slots.slice(row*5,row*5+5).map((id,i)=>{
     const index=row*5+i;
     return <div key={index} className="answer-slot" ref={el=>{slotsRef.current[index]=el;}} role="group" aria-label={'Position '+(index+1)} onDragOver={e=>e.preventDefault()} onDrop={e=>onDropSlot(e,index)}>
      {id?tileNode(id):<button className="answer-slot" type="button" aria-label={'Place selected letter at position '+(index+1)} onClick={()=>place(index)}><span>_</span></button>}
     </div>;
    })}</div>)}
   </div>
   <p className="tray-caption">Drag tiles or select a tile and tap an empty slot. Select a placed tile to move or swap it.</p>
   <div className="letter-tray" ref={trayRef} onDragOver={e=>e.preventDefault()} onDrop={onDropTray} aria-label="Available letter tiles">
    {state.tiles.filter(t=>!state.slots.includes(t.id)).map(t=>tileNode(t.id))}
    {!state.tiles.some(t=>!state.slots.includes(t.id))?<span className="tray-caption">Drop a placed tile here to return it.</span>:null}
   </div>
   {state.selected&&state.slots.includes(state.selected)?<div className="tool-actions"><button className="tool-button" onClick={()=>change({kind:'return',tileId:state.selected!})}>Return selected letter</button></div>:null}
   <div className="feedback" role="status">{feedback}</div>
   <div className="tool-actions">
    <button className="tool-button" onClick={()=>{const text=state.hints===0?'The word begins with '+lesson.word[0]+'.':nextHint(state);setFeedback(text);change({kind:'hint'});}}>Hint</button>
    <button className="tool-button" disabled={!state.history.length} onClick={()=>change({kind:'undo'})}>Undo</button>
    <button className="tool-button" onClick={()=>change({kind:'reset'})}>Reset tiles</button>
    <button className="button primary" disabled={state.slots.some(slot=>slot===null)} onClick={check}>Check word</button>
   </div>
   <div className="human-audio-note">Human narration will be available after reviewed recordings are uploaded. No AI or synthesized voice is used.</div>
  </>:null}
  {phase==='meaning'?<div className="play-success" aria-live="polite">
   <InteractiveCharacter key={'success-'+lesson.word} word={lesson.word} unlocked/>
   <h2>Wonderful work! 🌟</h2><p className="reactor-unlock">Your character came to life. Tap it again to play!</p><div className="result-word">{lesson.word}</div>
   <p>{lesson.meaning}</p><p>{lesson.phonics}</p>
   <p className="tiny-caption">{state.hints>0?'Completed with help. Practice again for independent mastery.':'Completed without hints.'}</p>
   <button className="button primary" onClick={next}>{step===LESSONS.length-1?'Finish lesson':'Next word'}</button>
  </div>:null}
  {phase==='done'?<div className="play-success" aria-live="polite">
   <div className="play-emoji" aria-hidden="true">🌟</div><h2>Lesson complete!</h2>
   <p>You practiced {completedWords.length} words. Keep exploring letter sounds and spelling patterns.</p>
   <button className="button primary" onClick={resetProgress}>Play again</button>
  </div>:null}
  </div>
  <div className="tool-actions"><button className="tool-button" onClick={resetProgress}>Start this demo over</button></div>
  {storageError?<p className="play-warning" role="alert">Browser storage is unavailable, so this session might not be saved.</p>:null}
  <p className="tiny-caption">Sample words, interactive illustrations and written phonics prompts are development-only. Animal sounds are real recordings; spoken phonics will use only approved human voices.</p>
 </div>;
}
