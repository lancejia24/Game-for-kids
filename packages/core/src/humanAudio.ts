export type HumanClipKind='prompt'|'word'|'phonics'|'meaning'|'feedback';
export type HumanClipMetadata={
 id:string;
 word:string;
 kind:HumanClipKind;
 locale:'en-US';
 transcript:string;
 provenance:'human-recorded';
 synthetic:false;
 narratorId:string;
 license:'owned'|'licensed';
 rightsConfirmed:true;
 reviewerId:string;
 reviewedAt:string;
 approved:true;
};
/** Metadata gate; a reviewer must independently confirm the provenance of the actual recording. */
export function isApprovedHumanClipMetadata(value:unknown):value is HumanClipMetadata{
 if(!value||typeof value!=='object')return false;
 const v=value as Record<string,unknown>;
 if(typeof v.word!=='string'||!/^[A-Z]{2,10}$/.test(v.word))return false;
 if(!['prompt','word','phonics','meaning','feedback'].includes(String(v.kind)))return false;
 return v.id===v.word+':'+v.kind
  &&v.locale==='en-US'
  &&typeof v.transcript==='string'&&v.transcript.trim().length>0
  &&v.provenance==='human-recorded'&&v.synthetic===false
  &&typeof v.narratorId==='string'&&v.narratorId.trim().length>0
  &&(v.license==='owned'||v.license==='licensed')
  &&v.rightsConfirmed===true
  &&typeof v.reviewerId==='string'&&v.reviewerId.trim().length>0
  &&typeof v.reviewedAt==='string'&&!Number.isNaN(Date.parse(v.reviewedAt))
  &&v.approved===true;
}
