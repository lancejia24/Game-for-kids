import {cookies} from 'next/headers';
import {createServerClient} from '@supabase/ssr';
export function isSupabaseConfigured():boolean{
 return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
export async function createSupabaseServer(){
 if(!isSupabaseConfigured())return null;
 const cookieStore=await cookies();
 return createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {cookies:{
   getAll(){return cookieStore.getAll();},
   setAll(toSet){try{for(const cookie of toSet){cookieStore.set(cookie.name,cookie.value,cookie.options);}}catch{
    // Server Components cannot write cookies. Server Actions can.
    // A request middleware refresh strategy must be verified before launch.
   }}
  }}
 );
}
