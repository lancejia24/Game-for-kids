/** Editorial candidates only. Not approved lessons, IPA pronunciations or recordings. */
export type CurriculumCandidate={
 word:string;category:'animals'|'food'|'vehicles'|'nature'|'home'|'school'|'everyday';
 definition:string;skill:string;reviewStatus:'candidate';
};
export const CURRICULUM_CANDIDATES:readonly CurriculumCandidate[]=[
  {
    "word": "AT",
    "category": "everyday",
    "definition": "A word used to show where something is.",
    "skill": "short-vowel",
    "reviewStatus": "candidate"
  },
  {
    "word": "IN",
    "category": "everyday",
    "definition": "A word meaning inside something.",
    "skill": "short-vowel",
    "reviewStatus": "candidate"
  },
  {
    "word": "UP",
    "category": "everyday",
    "definition": "Toward a higher place.",
    "skill": "short-vowel",
    "reviewStatus": "candidate"
  },
  {
    "word": "AM",
    "category": "everyday",
    "definition": "Used when talking about yourself, as in I am.",
    "skill": "short-vowel",
    "reviewStatus": "candidate"
  },
  {
    "word": "IT",
    "category": "everyday",
    "definition": "A word used for a thing or animal.",
    "skill": "short-vowel",
    "reviewStatus": "candidate"
  },
  {
    "word": "SUN",
    "category": "nature",
    "definition": "The star that gives Earth light and warmth.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "MAP",
    "category": "school",
    "definition": "A picture showing where places are.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "PEN",
    "category": "school",
    "definition": "A tool used for writing with ink.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "DOG",
    "category": "animals",
    "definition": "An animal commonly kept as a pet.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "HEN",
    "category": "animals",
    "definition": "An adult female chicken.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "PIG",
    "category": "animals",
    "definition": "A farm animal with a snout.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "BED",
    "category": "home",
    "definition": "Furniture you sleep on.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "BUS",
    "category": "vehicles",
    "definition": "A large vehicle that carries passengers.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "CUP",
    "category": "home",
    "definition": "A small container used for drinking.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "BOX",
    "category": "home",
    "definition": "A container with sides used to hold things.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "HAT",
    "category": "everyday",
    "definition": "Something worn on the head.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "RED",
    "category": "everyday",
    "definition": "A color like a ripe strawberry.",
    "skill": "cvc",
    "reviewStatus": "candidate"
  },
  {
    "word": "SHIP",
    "category": "vehicles",
    "definition": "A large boat that travels on water.",
    "skill": "digraph",
    "reviewStatus": "candidate"
  },
  {
    "word": "SHOP",
    "category": "everyday",
    "definition": "A place where people buy things.",
    "skill": "digraph",
    "reviewStatus": "candidate"
  },
  {
    "word": "CHIP",
    "category": "food",
    "definition": "A thin, crisp piece of food.",
    "skill": "digraph",
    "reviewStatus": "candidate"
  },
  {
    "word": "CHAT",
    "category": "everyday",
    "definition": "To talk in a friendly way.",
    "skill": "digraph",
    "reviewStatus": "candidate"
  },
  {
    "word": "THIN",
    "category": "everyday",
    "definition": "Not thick.",
    "skill": "digraph",
    "reviewStatus": "candidate"
  },
  {
    "word": "BATH",
    "category": "home",
    "definition": "Washing your body in water.",
    "skill": "digraph",
    "reviewStatus": "candidate"
  },
  {
    "word": "RING",
    "category": "everyday",
    "definition": "A round band worn on a finger.",
    "skill": "nasal",
    "reviewStatus": "candidate"
  },
  {
    "word": "SING",
    "category": "everyday",
    "definition": "To make music with your voice.",
    "skill": "nasal",
    "reviewStatus": "candidate"
  },
  {
    "word": "SHELL",
    "category": "nature",
    "definition": "A hard covering found on some animals.",
    "skill": "double-letter",
    "reviewStatus": "candidate"
  },
  {
    "word": "BELL",
    "category": "everyday",
    "definition": "An object that makes a ringing sound.",
    "skill": "double-letter",
    "reviewStatus": "candidate"
  },
  {
    "word": "HAPPY",
    "category": "everyday",
    "definition": "Feeling glad or pleased.",
    "skill": "double-letter",
    "reviewStatus": "candidate"
  },
  {
    "word": "APPLE",
    "category": "food",
    "definition": "A round fruit that grows on trees.",
    "skill": "double-letter",
    "reviewStatus": "candidate"
  },
  {
    "word": "RABBIT",
    "category": "animals",
    "definition": "A small animal with long ears.",
    "skill": "double-letter",
    "reviewStatus": "candidate"
  },
  {
    "word": "PLANE",
    "category": "vehicles",
    "definition": "An aircraft with wings.",
    "skill": "blend-longer",
    "reviewStatus": "candidate"
  },
  {
    "word": "TRAIN",
    "category": "vehicles",
    "definition": "A vehicle that runs on railroad tracks.",
    "skill": "blend-longer",
    "reviewStatus": "candidate"
  },
  {
    "word": "GARDEN",
    "category": "nature",
    "definition": "A place where plants are grown.",
    "skill": "blend-longer",
    "reviewStatus": "candidate"
  },
  {
    "word": "ELEPHANT",
    "category": "animals",
    "definition": "A very large animal with a trunk.",
    "skill": "blend-longer",
    "reviewStatus": "candidate"
  },
  {
    "word": "BUTTERFLY",
    "category": "animals",
    "definition": "An insect with two pairs of broad wings.",
    "skill": "blend-longer",
    "reviewStatus": "candidate"
  }
];
export function getCurriculumCandidate(word:string):CurriculumCandidate|null{
 return CURRICULUM_CANDIDATES.find(item=>item.word===word)??null;
}
