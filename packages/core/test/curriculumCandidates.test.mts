import {test} from 'node:test';import {strict as assert} from 'node:assert';
import {CURRICULUM_CANDIDATES,getCurriculumCandidate,startWord} from '../src/index.ts';
test('35 unique editorial candidate words, each 2–10 letters',()=>{
 assert.equal(CURRICULUM_CANDIDATES.length,35);
 assert.equal(new Set(CURRICULUM_CANDIDATES.map(x=>x.word)).size,35);
 for(const c of CURRICULUM_CANDIDATES){
  assert.match(c.word,/^[A-Z]{2,10}$/);
  assert.ok(c.definition.length>=3&&c.definition.length<=250);
  assert.ok(['animals','food','vehicles','nature','home','school','everyday'].includes(c.category));
  assert.equal(c.reviewStatus,'candidate');
  assert.equal(startWord(c.word).slots.length,c.word.length);
  assert.equal(getCurriculumCandidate(c.word)?.word,c.word);
 }
});
test('only known candidate IDs may be imported',()=>{
 assert.equal(getCurriculumCandidate('UNKNOWN'),null);
 assert.equal(getCurriculumCandidate('cat'),null);
});
