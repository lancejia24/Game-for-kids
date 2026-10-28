/**
 * Fixed, development-only narration scripts. No child input or user-authored text is sent
 * to the synthesis provider. The IPA fields need human educator review before release.
 */
export type SpeechPiece={text:string;ipa?:string};
export type SpeechEntry={id:string;parts:readonly SpeechPiece[];text:string;reviewStatus:'development'};
const wordSpecs=[
 {word:'CAT',ipa:'kæt',question:'Listen to cat. Which letter spells the first sound?',phonics:'The letter C represents the first sound in cat.',meaning:'A cat is a small animal that often lives with people.',first:'C'},
 {word:'FISH',ipa:'fɪʃ',question:'Listen to fish. Which two letters spell the last sound?',phonics:'S and H work together at the end of fish to make one sound.',meaning:'A fish is an animal that swims in water.',first:'F'},
 {word:'BANANA',ipa:'bə.ˈnæn.ə',question:'Listen to banana. Which letter spells the first sound?',phonics:'The letter B represents the first sound in banana.',meaning:'A banana is a long yellow fruit.',first:'B'},
 {word:'STRAWBERRY',ipa:'ˈstrɔ.bɛ.ri',question:'Listen to strawberry. Which two letters spell the first blend?',phonics:'S and T make two separate sounds that blend at the start of strawberry.',meaning:'A strawberry is a sweet red fruit with little seeds.',first:'S'},
] as const;
function single(id:string,text:string,ipa?:string):SpeechEntry{
 return {id,text,parts:[{text,...(ipa?{ipa}:{})}],reviewStatus:'development'};
}
const scripts:SpeechEntry[]=[
 single('game:welcome','Welcome to WordPath. Choose your answer, then build each word using letters.'),
 single('game:retry','Not quite. Listen and try again.'),
 single('game:correct','Great work! You got it right!'),
 single('game:complete','You finished the lesson. Great job exploring sounds and words.'),
 single('game:spell-instruction','Drag or tap letter tiles to spell the picture word.'),
 single('game:reset','The letter tiles have been reset. Try again.'),
];
for(const spec of wordSpecs){
 const word=spec.word;
 scripts.push(
  {id:word+':prompt',parts:[{text:spec.question.replace(new RegExp(word,'i'),'')||spec.question}],text:spec.question,reviewStatus:'development'},
  single(word+':word',word.toLowerCase(),spec.ipa),
  single(word+':phonics',spec.phonics),
  single(word+':meaning',spec.meaning),
  single(word+':spell','Spell '+word.toLowerCase()+' using the letter tiles.'),
  {id:word+':hint:0',text:'Replay the word and listen carefully. '+word.toLowerCase()+'.',parts:[{text:'Replay the word and listen carefully. '},{text:word.toLowerCase(),ipa:spec.ipa},{text:'.'}],reviewStatus:'development'},
  single(word+':hint:1','Look at the first sound and letter.'),
  single(word+':hint:2','The word begins with '+spec.first+'.'),
  {id:word+':hint:3',text:'The word is '+word.toLowerCase()+'.',parts:[{text:'The word is '},{text:word.toLowerCase(),ipa:spec.ipa},{text:'.'}],reviewStatus:'development'},
 );
 // Ensure each prompt retains an explicit spoken IPA word instead of reading slash notation.
 const prompt=scripts.find(item=>item.id===word+':prompt')!;
 const idx=spec.question.toLowerCase().indexOf(word.toLowerCase());
 prompt.parts=idx>=0?[
  {text:spec.question.slice(0,idx)},
  {text:word.toLowerCase(),ipa:spec.ipa},
  {text:spec.question.slice(idx+word.length)}
 ]:[{text:spec.question}];
}
const SPEECH=Object.freeze(Object.fromEntries(scripts.map(item=>[item.id,item])) as Record<string,SpeechEntry>);
export function getSpeechEntry(id:string):SpeechEntry|null{
 return Object.hasOwn(SPEECH,id)?SPEECH[id]:null;
}
export function allSpeechIds():readonly string[]{return Object.keys(SPEECH);}
export function xmlEscape(input:string):string{
 return input.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]??char));
}
export function buildSsml(entry:SpeechEntry,voice='en-US-JennyNeural'):string{
 // Voice is from a trusted server environment, not from request parameters.
 if(!/^en-US-[A-Za-z]+Neural$/.test(voice))throw new Error('Voice must be an approved US English neural voice');
 const content=entry.parts.map(piece=>{
  const escaped=xmlEscape(piece.text);
  return piece.ipa
   ?'<phoneme alphabet="ipa" ph="'+xmlEscape(piece.ipa)+'">'+escaped+'</phoneme>'
   :escaped;
 }).join('');
 return '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="'+voice+'"><prosody rate="-10%">'+content+'</prosody></voice></speak>';
}
