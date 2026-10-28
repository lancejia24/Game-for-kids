import {test} from 'node:test';import {strict as assert} from 'node:assert';
import {STARTER_AUDIO_PACKS,validateAudioPack,safeReadInstalledPacks} from '../src/index.ts';
const valid={schema:1 as const,packId:'starter-phonemes',version:1,locale:'en-US' as const,status:'approved' as const,files:[{id:'k',relativePath:'audio/phonemes/v1/k.mp3',sha256:'a'.repeat(64),bytes:1032}]};
test('packs require content hashes and safe relative asset names',()=>{
 assert.equal(validateAudioPack(valid),true);
 assert.equal(validateAudioPack({...valid,files:[{...valid.files[0],relativePath:'../../private.txt'}]}),false);
 assert.equal(validateAudioPack({...valid,files:[{...valid.files[0],sha256:'bad'}]}),false);
 assert.equal(validateAudioPack({...valid,files:[...valid.files,...valid.files]}),false);
});
test('installed metadata never implies verified sound files unless separately checked',()=>{
 assert.deepEqual(STARTER_AUDIO_PACKS,[]);
 assert.deepEqual(safeReadInstalledPacks('bad'),[]);
 assert.deepEqual(safeReadInstalledPacks('[{"packId":"x","version":1,"verifiedAt":"today","paths":["../bad"]}]'),[]);
});
