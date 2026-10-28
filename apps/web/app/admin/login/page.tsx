import type {Metadata} from 'next';
import Link from 'next/link';
import {loginAction} from '../actions';
import {isSupabaseConfigured} from '../../../lib/supabase-server';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Admin sign-in',robots:{index:false,follow:false}};
export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
 const {error}=await searchParams;
 const msg=error==='forbidden'?'This account does not have WordPath administrator access.':error==='credentials'?'Could not sign in with those credentials.':null;
 return <div className="content-page section-width" style={{maxWidth:540}}>
  <p className="eyebrow">WORDPATH MANAGEMENT</p><h1>Administrator sign-in</h1>
  {!isSupabaseConfigured()?<p className="notice error">Admin authentication is not configured. <Link href="/admin/setup"><u>See setup instructions</u></Link>.</p>:<>
   <p>Only adult accounts explicitly approved in the admin database can access the word library.</p>
   {msg?<p className="notice error" role="alert">{msg}</p>:null}
   <form className="panel" action={loginAction}>
    <label className="field">Email<input name="email" type="email" autoComplete="username" required maxLength={254}/></label>
    <label className="field">Password<input name="password" type="password" autoComplete="current-password" required minLength={1}/></label>
    <button type="submit" className="button primary">Sign in securely</button>
   </form>
  </>}
 </div>;
}
