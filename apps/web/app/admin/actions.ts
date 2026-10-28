'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {createSupabaseServer} from '../../lib/supabase-server';
import {requireAdmin} from '../../lib/admin';
import {getCurriculumCandidate} from '@wordpath/core';
const WORD=/^[A-Z]{2,10}$/;
function str(data:FormData,key:string,max:number):string{
 const value=data.get(key);
 if(typeof value!=='string')return '';
 return value.trim().slice(0,max+1);
}
export async function loginAction(data:FormData){
 const client=await createSupabaseServer();
 if(!client)redirect('/admin/setup');
 const email=str(data,'email',254),password=str(data,'password',500);
 if(!email||!password)redirect('/admin/login?error=credentials');
 const login=await client.auth.signInWithPassword({email,password});
 if(login.error||!login.data.user)redirect('/admin/login?error=credentials');
 const check=await client.from('wordpath_admins').select('user_id').eq('user_id',login.data.user.id).maybeSingle();
 if(check.error||!check.data){
  await client.auth.signOut();
  redirect('/admin/login?error=forbidden');
 }
 redirect('/admin');
}
export async function logoutAction(){
 const client=await createSupabaseServer();
 if(client)await client.auth.signOut();
 redirect('/admin/login');
}
export async function createDraftAction(form:FormData){
 const {client,user}=await requireAdmin();
 const word=str(form,'word',20).toUpperCase(),definition=str(form,'definition',250),example=str(form,'example',350),category=str(form,'category',45);
 if(!WORD.test(word)||definition.length<3||!category||example.length>300)redirect('/admin?error=invalid');
 const {error}=await client.from('wordpath_words').insert({word_text:word,short_definition:definition,example_sentence:example||null,category,status:'draft',created_by:user.id});
 if(error)redirect(error.code==='23505'?'/admin?error=duplicate':'/admin?error=save');
 revalidatePath('/admin');
 redirect('/admin?notice=created');
}
export async function updateDraftAction(form:FormData){
 const {client}=await requireAdmin();
 const id=str(form,'id',40),definition=str(form,'definition',250),example=str(form,'example',350),category=str(form,'category',45);
 if(!/^[0-9a-f-]{36}$/i.test(id)||definition.length<3||example.length>300||!category)redirect('/admin?error=invalid');
 const {data,error}=await client.from('wordpath_words').update({short_definition:definition,example_sentence:example||null,category}).eq('id',id).eq('status','draft').select('id').maybeSingle();
 if(error||!data)redirect('/admin?error=save');
 revalidatePath('/admin');redirect('/admin?notice=updated');
}
export async function archiveDraftAction(form:FormData){
 const {client}=await requireAdmin();
 const id=str(form,'id',40);
 if(!/^[0-9a-f-]{36}$/i.test(id))redirect('/admin?error=invalid');
 const {data,error}=await client.from('wordpath_words').update({status:'archived'}).eq('id',id).eq('status','draft').select('id').maybeSingle();
 if(error||!data)redirect('/admin?error=save');
 revalidatePath('/admin');redirect('/admin?notice=archived');
}

/** Copy one pre-authored candidate to the admin-only draft library, never publish. */
export async function importCandidateDraftAction(form:FormData){
 const {client,user}=await requireAdmin();
 const word=str(form,'candidate',20).toUpperCase();
 const candidate=getCurriculumCandidate(word);
 if(!candidate)redirect('/admin?error=invalid');
 const {error}=await client.from('wordpath_words').insert({
  word_text:candidate.word,short_definition:candidate.definition,
  category:candidate.category,status:'draft',created_by:user.id
 });
 if(error)redirect(error.code==='23505'?'/admin?error=duplicate':'/admin?error=save');
 revalidatePath('/admin');redirect('/admin?notice=imported');
}
