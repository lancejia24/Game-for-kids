import {NextRequest,NextResponse} from 'next/server';
import {approvedAsset,buildSsml,getSpeechEntry} from '@wordpath/core';

export const runtime='nodejs';
/**
 * Public content only: the provider sees trusted, pre-authored strings and no
 * learner input, profile data, emails, child information, or browser text.
 */
export async function GET(request:NextRequest){
 const id=request.nextUrl.searchParams.get('id')??'';
 if(id.length>80||!getSpeechEntry(id)){
  return NextResponse.json({error:'Unknown approved narration ID'},{status:404,headers:{'Cache-Control':'no-store'}});
 }
 const saved=approvedAsset(id,'azure-ssml');
 if(saved)return NextResponse.redirect(new URL(saved.path,request.url),{status:307});
 const key=process.env.AZURE_SPEECH_KEY;
 const region=process.env.AZURE_SPEECH_REGION??'';
 const enabled=process.env.WORDPATH_ENABLE_SYNTHETIC_NARRATION==='true';
 if(!enabled||!key||!/^[a-z0-9-]{2,32}$/.test(region)){
  return NextResponse.json({error:'SSML narration has not been configured'},{status:503,headers:{'Cache-Control':'no-store'}});
 }
 const entry=getSpeechEntry(id)!;
 const voice=process.env.AZURE_SPEECH_VOICE||'en-US-JennyNeural';
 let ssml:string;
 try{ssml=buildSsml(entry,voice);}catch{
  return NextResponse.json({error:'Narration voice is not configured correctly'},{status:503,headers:{'Cache-Control':'no-store'}});
 }
 try{
  const result=await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,{
   method:'POST',
   headers:{
    'Ocp-Apim-Subscription-Key':key,
    'Content-Type':'application/ssml+xml',
    'X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3',
    'User-Agent':'WordPath-Server',
   },
   body:ssml,
   signal:AbortSignal.timeout(12000),
   cache:'no-store'
  });
  if(!result.ok){
   // Do not expose upstream diagnostics or secrets to public callers.
   return NextResponse.json({error:'Narration is temporarily unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});
  }
  const audio=await result.arrayBuffer();
  // Keep audio requests small and bounded even if the service is misconfigured.
  if(!audio.byteLength||audio.byteLength>500_000){
   return NextResponse.json({error:'Narration output invalid'},{status:502,headers:{'Cache-Control':'no-store'}});
  }
  return new Response(audio,{status:200,headers:{
   'Content-Type':'audio/mpeg',
   'Cache-Control':'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
   'X-Content-Type-Options':'nosniff',
  }});
 }catch{
  return NextResponse.json({error:'Narration is temporarily unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});
 }
}
