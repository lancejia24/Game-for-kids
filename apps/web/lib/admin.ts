import {redirect} from 'next/navigation';
import {createSupabaseServer} from './supabase-server';
export async function requireAdmin(){
 const client=await createSupabaseServer();
 if(!client)redirect('/admin/setup');
 // getUser makes a server-side Auth request rather than trusting a stale session cookie.
 const {data:{user},error}=await client.auth.getUser();
 if(error||!user)redirect('/admin/login');
 const {data:membership,error:roleError}=await client.from('wordpath_admins').select('user_id').eq('user_id',user.id).maybeSingle();
 if(roleError||!membership)redirect('/admin/login?error=forbidden');
 return {client,user};
}
