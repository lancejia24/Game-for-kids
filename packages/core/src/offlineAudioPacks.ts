/** Local offline-pack metadata. No downloaded file is trusted until verified. */
export type AudioPackFile={id:string;relativePath:string;sha256:string;bytes:number};
export type AudioPackManifest={schema:1;packId:string;version:number;locale:'en-US';files:readonly AudioPackFile[];status:'draft'|'approved'};
const ID=/^[A-Za-z0-9_-]{1,80}$/;
const FILE=/^audio\/phonemes\/v[1-9]\d*\/[A-Za-z0-9_-]+\.mp3$/;
export function validateAudioPack(pack:AudioPackManifest):boolean{
 if(pack.schema!==1||!ID.test(pack.packId)||!Number.isSafeInteger(pack.version)||pack.version<1||pack.locale!=='en-US')return false;
 if(!Array.isArray(pack.files)||pack.files.length===0||pack.files.length>500)return false;
 const paths=new Set<string>();const ids=new Set<string>();
 for(const file of pack.files){
  if(!ID.test(file.id)||!FILE.test(file.relativePath)||!/^[a-f0-9]{64}$/.test(file.sha256)||!Number.isSafeInteger(file.bytes)||file.bytes<=0||file.bytes>500000)return false;
  if(paths.has(file.relativePath)||ids.has(file.id))return false;
  paths.add(file.relativePath);ids.add(file.id);
 }
 return pack.status==='draft'||pack.status==='approved';
}
export type InstalledAudioPack={packId:string;version:number;verifiedAt:string;paths:readonly string[]};
export function isValidInstalledPack(pack:InstalledAudioPack):boolean{
 return ID.test(pack.packId)&&Number.isSafeInteger(pack.version)&&pack.version>=1
  && typeof pack.verifiedAt==='string'&&!Number.isNaN(Date.parse(pack.verifiedAt))
  && Array.isArray(pack.paths)&&pack.paths.length>0&&pack.paths.every(p=>typeof p==='string'&&FILE.test(p));
}
export function safeReadInstalledPacks(raw:string|null):InstalledAudioPack[]{
 if(!raw)return [];
 try{
  const parsed:unknown=JSON.parse(raw);
  if(!Array.isArray(parsed)||parsed.length>30||!parsed.every(isValidInstalledPack))return [];
  return parsed;
 }catch{return [];}
}
/** Intentionally empty: no reviewed, licensed media exists yet. */
export const STARTER_AUDIO_PACKS:readonly AudioPackManifest[]=[];
