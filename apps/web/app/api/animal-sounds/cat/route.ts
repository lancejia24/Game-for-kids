import {NextResponse} from 'next/server';

/**
 * CC0 recording of a real cat by Kerzoven (OpenGameArt).
 * The server fetches it, avoiding requests from children's browsers to the asset host.
 * No voice synthesis, generated audio, microphone access or third-party browser SDK.
 */
const CAT_SOUND='https://opengameart.org/sites/default/files/cat_mewfood.wav';
export const runtime='nodejs';
export async function GET(){
 try{
  const response=await fetch(CAT_SOUND,{next:{revalidate:60*60*24*7},signal:AbortSignal.timeout(8000)});
  const size=Number(response.headers.get('content-length')||'0');
  if(!response.ok||size>300_000)return NextResponse.json({error:'Cat sound unavailable'},{status:503});
  const data=new Uint8Array(await response.arrayBuffer());
  if(data.length<44||data.length>300_000||String.fromCharCode(...data.slice(0,4))!=='RIFF'||String.fromCharCode(...data.slice(8,12))!=='WAVE'){
   return NextResponse.json({error:'Recording failed validation'},{status:503});
  }
  return new Response(data,{headers:{'Content-Type':'audio/wav','Cache-Control':'public, max-age=86400, s-maxage=604800','X-Content-Type-Options':'nosniff'}});
 }catch{return NextResponse.json({error:'Cat sound unavailable'},{status:503});}
}
