import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {allSpeechIds,buildSsml,getSpeechEntry,xmlEscape} from '../src/index.ts';
test('catalog has every stage of instructions, prompts, words and hints',()=>{
 for(const word of ['CAT','FISH','BANANA','STRAWBERRY']){
  for(const suffix of ['prompt','word','phonics','meaning','spell','hint:0','hint:1','hint:2','hint:3']){
   assert.ok(getSpeechEntry(word+':'+suffix),word+':'+suffix);
  }
 }
 assert.ok(getSpeechEntry('game:complete'));
 assert.equal(getSpeechEntry('visitor input arbitrary words'),null);
 assert.equal(new Set(allSpeechIds()).size,allSpeechIds().length);
});
test('IPA is embedded as SSML, never read as slash characters',()=>{
 const word=getSpeechEntry('CAT:word');assert.ok(word);
 const xml=buildSsml(word);assert.match(xml,/<phoneme alphabet="ipa" ph="kæt">cat<\/phoneme>/);
 assert.match(xml,/xml:lang="en-US"/);
 assert.match(buildSsml(getSpeechEntry('FISH:prompt')!),/ph="fɪʃ"/);
});
test('escape authored text and IPA and reject unapproved voice names',()=>{
 assert.equal(xmlEscape('&<>"\''),'&amp;&lt;&gt;&quot;&apos;');
 const sample={id:'test',text:'',reviewStatus:'development' as const,parts:[{text:'<say & hi>',ipa:'k"æt'}]};
 const ssml=buildSsml(sample);assert.match(ssml,/ph="k&quot;æt"/);assert.match(ssml,/&lt;say &amp; hi&gt;/);
 assert.throws(()=>buildSsml(sample,'<voice hack="true">'));
});
test('scripts are flagged as development content, not educator reviewed',()=>{
 assert.ok(allSpeechIds().every(id=>getSpeechEntry(id)?.reviewStatus==='development'));
});
