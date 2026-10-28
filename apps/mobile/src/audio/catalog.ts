/**
 * Human-voice clip registry. EMPTY until actual permission-cleared recordings are supplied.
 *
 * Add local WAV/MP3/M4A audio assets under apps/mobile/assets/audio/human/.
 * Static Metro require() paths must be written explicitly and only AFTER review.
 * Never place AI-generated speech, TTS, or cloned voices in this registry.
 *
 * Example once an authentic clip has been uploaded and independently reviewed:
 * 'CAT:word': {
 *   meta: {id:'CAT:word',kind:'word',word:'CAT',locale:'en-US',
 *     transcript:'cat',provenance:'human-recorded',synthetic:false,
 *     narratorId:'voice-actor-01',license:'owned',rightsConfirmed:true,
 *     reviewerId:'editor-01',reviewedAt:'2026-11-01T00:00:00Z',approved:true},
 *   source: require('../../assets/audio/human/CAT_word.m4a')
 * }
 * The above is an illustration, NOT an approved asset or verified recording.
 */
import {isApprovedHumanClipMetadata,type HumanClipMetadata} from '@wordpath/core';
import type {AudioSource} from 'expo-audio';

export type RegisteredHumanClip={meta:HumanClipMetadata;source:AudioSource};
const HUMAN_VOICE_LIBRARY: Readonly<Record<string,RegisteredHumanClip|undefined>>=Object.freeze({});
export function humanVoiceClip(id:string):RegisteredHumanClip|null{
 const asset=HUMAN_VOICE_LIBRARY[id];
 return asset&&asset.meta.id===id&&isApprovedHumanClipMetadata(asset.meta)&&asset.source!=null?asset:null;
}
