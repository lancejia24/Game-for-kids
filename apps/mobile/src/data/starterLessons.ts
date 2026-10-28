/** Development-only prompts; not reviewed phonics or publishable recordings. */
export type StarterLesson={word:string;icon:string;meaning:string;sound:string;choices:string[];prompt:string;phonics:string};
export const STARTER_LESSONS:readonly StarterLesson[]=[
 {word:'CAT',icon:'🐈',meaning:'A small animal that often lives with people.',sound:'C',choices:['C','T','M'],prompt:'Listen to cat. Which letter spells the first /k/ sound?',phonics:'C spells the /k/ sound at the beginning of cat.'},
 {word:'FISH',icon:'🐟',meaning:'An animal that swims in water.',sound:'SH',choices:['CH','SH','TH'],prompt:'Listen to fish. Which two letters spell the last /sh/ sound?',phonics:'S and H together make one /sh/ sound. Keep two separate spelling tiles.'},
 {word:'BANANA',icon:'🍌',meaning:'A long yellow fruit.',sound:'B',choices:['D','B','P'],prompt:'Listen to banana. Which letter spells its first /b/ sound?',phonics:'The letter B spells the /b/ sound at the beginning of banana.'},
 {word:'STRAWBERRY',icon:'🍓',meaning:'A sweet red fruit with tiny seeds.',sound:'ST',choices:['ST','SH','CH'],prompt:'Listen to strawberry. Which letters are the starting /s/ /t/ blend?',phonics:'S and T are separate sounds blended at the beginning of strawberry.'}
];
export const STARTER_WORDS=STARTER_LESSONS.map(lesson=>lesson.word);
