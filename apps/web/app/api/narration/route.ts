import {NextRequest,NextResponse} from 'next/server';
import {approvedAsset,getSpeechEntry} from '@wordpath/core';
export const runtime='nodejs';
/**
 * Zero-cost audio: ONLY verified, versioned, static MP3 files committed to the
 * WordPath repository. There are no paid APIs, cloud synthesis, or secret keys.
 */
export async function GET(request:NextRequest){
 const id=request.nextUrl.searchParams.get('id')??'';
 if(id.length>80||!getSpeechEntry(id))return NextResponse.json({error:'Unknown narration ID'},{status:404,headers:{'Cache-Control':'no-store'}});
 const recorded=approvedAsset(id,'human-recorded');
 const generated=approvedAsset(id,'local-open-source');
 const asset=recorded??generated;
 if(!asset)return NextResponse.json({error:'No reviewed offline audio asset is available for this lesson yet'},{status:404,headers:{'Cache-Control':'no-store'}});
 return NextResponse.redirect(new URL(asset.path,request.url),{status:307});
}
