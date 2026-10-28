'use client';
import {useEffect,useRef,useState} from 'react';
import './character-reactions.css';

type Word='CAT'|'FISH'|'BANANA'|'STRAWBERRY';
type Props={word:string;unlocked:boolean};

/** Original vector characters. Their reactions work with keyboard, touch and pointer input. */
function CatCharacter(){
 return <svg className="reactor-cat" viewBox="0 0 240 230" role="img" aria-label="Smiling illustrated orange cat with a wagging tail">
  <ellipse cx="119" cy="207" rx="72" ry="10" fill="#a7b3cd" opacity=".26"/>
  <path className="cat-tail" d="M173 178 C222 186 232 154 205 144" fill="none" stroke="#dc8946" strokeWidth="17" strokeLinecap="round"/>
  <ellipse cx="124" cy="152" rx="69" ry="62" fill="#f5af67" stroke="#b97843" strokeWidth="4"/>
  <path d="M63 91 L67 35 Q67 27 76 34 L103 57 M144 57 L176 32 Q183 26 186 36 L188 91" fill="#f5af67" stroke="#b97843" strokeWidth="5" strokeLinejoin="round"/>
  <path d="M76 52 L88 64 L75 76 Z M164 64 L178 51 L178 76 Z" fill="#e88b9d"/>
  <ellipse cx="125" cy="96" rx="68" ry="61" fill="#f5af67" stroke="#b97843" strokeWidth="4"/>
  <ellipse cx="124" cy="128" rx="37" ry="24" fill="#fff1db"/>
  <g className="cat-eyes"><ellipse cx="96" cy="95" rx="8" ry="12" fill="#2b3851"/><ellipse cx="154" cy="95" rx="8" ry="12" fill="#2b3851"/><circle cx="99" cy="90" r="2.3" fill="white"/><circle cx="157" cy="90" r="2.3" fill="white"/></g>
  <path d="M116 118 Q125 127 134 118 L125 114 Z" fill="#e6788a"/>
  <path d="M125 125 Q120 139 110 132 M125 125 Q130 139 140 132" fill="none" stroke="#7d563f" strokeWidth="2.5" strokeLinecap="round"/>
  <path d="M85 122 L51 115 M85 132 L48 135 M164 122 L198 115 M164 132 L202 135" stroke="#8c6248" strokeWidth="2" strokeLinecap="round"/>
  <path d="M86 187 L91 203 M157 187 L154 203" stroke="#b97843" strokeWidth="4" strokeLinecap="round"/>
  <ellipse cx="97" cy="200" rx="22" ry="11" fill="#ffcb91" stroke="#b97843" strokeWidth="3"/>
  <ellipse cx="150" cy="200" rx="22" ry="11" fill="#ffcb91" stroke="#b97843" strokeWidth="3"/>
  <path d="M106 167 Q124 176 141 167" fill="none" stroke="#d58241" strokeWidth="4" strokeLinecap="round"/>
  <ellipse cx="86" cy="115" rx="9" ry="5" fill="#f58c94" opacity=".65"/>
  <ellipse cx="163" cy="115" rx="9" ry="5" fill="#f58c94" opacity=".65"/>
 </svg>;
}
function FishCharacter(){
 return <svg className="reactor-fish" viewBox="0 0 240 220" role="img" aria-label="Smiling colorful fish swimming with bubbles">
  <ellipse cx="120" cy="191" rx="91" ry="9" fill="#afcfdf" opacity=".28"/>
  <g className="fish-bubbles" stroke="#74b7d9" strokeWidth="3" fill="none"><circle cx="59" cy="43" r="8"/><circle cx="41" cy="70" r="4"/><circle cx="200" cy="31" r="6"/></g>
  <g className="fish-body">
   <path className="fish-tail" d="M76 109 L34 72 Q24 106 33 145 Z" fill="#eb9e68" stroke="#b77559" strokeWidth="3"/>
   <ellipse cx="131" cy="111" rx="80" ry="58" fill="#68c7d4" stroke="#408da5" strokeWidth="4"/>
   <path d="M104 59 Q124 23 149 56" fill="#2eacbc"/>
   <path d="M114 163 L145 187 L155 160" fill="#2eacbc"/>
   <path d="M65 128 Q125 171 194 116" fill="none" stroke="#b8eeeb" strokeWidth="8" strokeLinecap="round"/>
   <circle cx="172" cy="93" r="13" fill="white"/><circle cx="175" cy="93" r="6" fill="#234e6f"/><circle cx="177" cy="90" r="2" fill="white"/>
   <path d="M189 121 Q179 132 169 121" fill="none" stroke="#31778a" strokeWidth="3" strokeLinecap="round"/>
   <path d="M110 74 Q117 93 109 111 M129 75 Q135 93 128 110" stroke="#329eac" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </g>
 </svg>;
}
const other:Record<string,{emoji:string;hint:string}>={BANANA:{emoji:'🍌',hint:'Watch the banana do a happy dance!'},STRAWBERRY:{emoji:'🍓',hint:'Watch the strawberry twirl!'}};

export function InteractiveCharacter({word,unlocked}:Props){
 const [reaction,setReaction]=useState(0);
 const [soundError,setSoundError]=useState(false);
 const audioRef=useRef<HTMLAudioElement|null>(null);
 const animating=reaction>0;
 useEffect(()=>()=>{const audio=audioRef.current;if(audio){audio.pause();audio.src='';audioRef.current=null;}},[]);
 const react=()=>{
  setReaction(n=>n+1);
  if(word==='CAT'&&unlocked){
   setSoundError(false);
   const clip=audioRef.current??new Audio('/api/animal-sounds/cat');
   audioRef.current=clip;
   clip.currentTime=0;
   void clip.play().catch(()=>setSoundError(true));
  }
 };
 const name=word==='CAT'?'cat':word==='FISH'?'fish':word==='BANANA'?'banana':'strawberry';
 const caption=word==='CAT'
  ?unlocked?'Pet the cat! Tap for a real meow.':'Tap the cat to make it wiggle. Spell CAT to unlock its meow!'
  :word==='FISH'?'Tap the fish to make it swim and blow bubbles.'
  :other[word]?.hint??'Tap the character to make it celebrate.';
 return <div className="character-wrap">
  <button type="button" className={`character-button character-${name}${unlocked?' is-unlocked':''}`}
    onClick={react} aria-label={caption}>
   <span className="character-stage" key={reaction}>
    {word==='CAT'?<CatCharacter/>:word==='FISH'?<FishCharacter/>:<span className="fruit-sprite" role="img" aria-label={word.toLowerCase()}>{other[word]?.emoji??'✨'}</span>}
    {unlocked?<span className="celebrate-stars" aria-hidden="true"><i>✨</i><i>⭐</i><i>✨</i><i>⭐</i></span>:null}
    {unlocked&&word==='CAT'&&animating?<span className="meow-bubble" aria-hidden="true">Meow!</span>:null}
   </span>
  </button>
  <p className="character-caption">{caption}</p>
  {soundError?<p className="character-sound-error" role="status">The recorded meow is unavailable right now. The cat can still play!</p>:null}
  {unlocked&&word==='CAT'?<p className="character-sound-credit">Natural, real cat recording (CC0). Sound plays only when you tap.</p>:null}
 </div>;
}
