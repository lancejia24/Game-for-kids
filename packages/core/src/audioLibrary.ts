import {getSpeechEntry} from './speech.ts';
export type AudioProvenance='human-recorded'|'azure-ssml';
export type AudioAsset={id:string;path:string;sha256:string;provenance:AudioProvenance;locale:'en-US';reviewed:boolean;license:string;version:number};
export type AudioManifest={schema:1;assets:AudioAsset[]};
/**
 * Committed audio catalog. Add assets ONLY after verifying recordings, rights,
 * pronunciation and sha256. The current starter has no approved files.
 */
export const AUDIO_LIBRARY:AudioManifest={schema:1,assets:[]};
export function isValidAsset(asset:AudioAsset):boolean{
 return !!getSpeechEntry(asset.id)
  && /^\/audio\/v[1-9]\d*\/[A-Za-z0-9_-]+\.mp3$/.test(asset.path)
  && /^[a-f0-9]{64}$/.test(asset.sha256)
  && ['human-recorded','azure-ssml'].includes(asset.provenance)
  && asset.locale==='en-US'&&asset.reviewed===true
  && asset.license.trim().length>0
  && Number.isSafeInteger(asset.version)&&asset.version>=1;
}
export function approvedAsset(id:string,provenance:AudioProvenance):AudioAsset|null{
 const asset=AUDIO_LIBRARY.assets.find(a=>a.id===id&&a.provenance===provenance);
 return asset&&isValidAsset(asset)?asset:null;
}
