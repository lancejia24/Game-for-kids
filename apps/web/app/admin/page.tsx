import type {Metadata} from 'next';
import {isSupabaseConfigured} from '../../lib/supabase-server';
import {requireAdmin} from '../../lib/admin';
import {archiveDraftAction,createDraftAction,logoutAction,updateDraftAction,importCandidateDraftAction} from './actions';
import {CURRICULUM_CANDIDATES} from '@wordpath/core';
import Link from 'next/link';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Admin | Word library',robots:{index:false,follow:false}};
type WordRow={id:string;word_text:string;short_definition:string;example_sentence:string|null;category:string;status:string;created_at:string};
export default async function Admin({searchParams}:{searchParams:Promise<{notice?:string;error?:string}>}){
 if(!isSupabaseConfigured())return <div className="section-width content-page"><h1>Admin setup required</h1><p>Supabase environment variables are not configured yet. The admin dashboard is closed until authentication and row-level security are ready.</p><Link href="/admin/setup" className="button primary">Setup instructions</Link></div>;
 const {client}=await requireAdmin();
 const {data,error}=await client.from('wordpath_words').select('id,word_text,short_definition,example_sentence,category,status,created_at').order('created_at',{ascending:false}).limit(100);
 const words=(data??[]) as WordRow[];
 const params=await searchParams;
 const notices:Record<string,string>={created:'Draft word created.',imported:'Candidate copied into draft library for review.',updated:'Draft updated.',archived:'Draft archived.'};
 const errors:Record<string,string>={invalid:'Please check the word, definition, example, and category.',duplicate:'That word is already in the library.',save:'The change was not saved. Verify your Supabase setup and try again.'};
 return <div className="section-width" style={{paddingBottom:80}}>
  <div className="page-intro"><p className="eyebrow">SECURE CONTENT MANAGEMENT</p><h1>Word library</h1><p>Create and revise draft word entries. Only authenticated, approved administrators can view or change them.</p>
   <form action={logoutAction}><button className="tool-button" type="submit">Sign out</button></form>
  </div>
  <div className="development-warning">Publication is disabled until original images, 100% human-recorded voice clips, educational review, asset licensing, and safe release synchronization are in place. Drafts do not appear in the learner’s lessons.</div>
  {params.notice&&notices[params.notice]?<p className="notice" role="status">{notices[params.notice]}</p>:null}
  {params.error&&errors[params.error]?<p className="notice error" role="alert">{errors[params.error]}</p>:null}
  <section className="panel" style={{marginTop:24}}>
    <h2>Starter curriculum candidates ({CURRICULUM_CANDIDATES.length})</h2>
    <p>These word suggestions are NOT reviewed or published. Import one into drafts, then check its meaning, age suitability, phonics, IPA, artwork and voice recording before future publication.</p>
    <div className="word-list">{CURRICULUM_CANDIDATES.map(candidate=>{
     const already=words.some(row=>row.word_text===candidate.word);
     return <article className="word-card" key={candidate.word}>
      <span className="status">{candidate.skill} · candidate</span>
      <h3>{candidate.word}</h3><p>{candidate.definition}</p><p className="tag">{candidate.category}</p>
      <form action={importCandidateDraftAction}><input type="hidden" name="candidate" value={candidate.word}/>
       <button type="submit" disabled={already} className="tool-button">{already?'Already in library':'Copy to drafts'}</button>
      </form>
     </article>;
    })}</div>
   </section>
  <div className="admin-grid">
   <section className="panel"><h2>Add a draft word</h2>
    <form action={createDraftAction}>
     <label className="field">Word (2–10 English letters)<input autoComplete="off" name="word" pattern="[A-Za-z]{2,10}" minLength={2} maxLength={10} required placeholder="CAT"/></label>
     <label className="field">Meaning<input name="definition" maxLength={250} minLength={3} required placeholder="A small animal kept as a pet"/></label>
     <label className="field">Example sentence<textarea name="example" maxLength={300} placeholder="The cat sits by the window."/></label>
     <label className="field">Category<select name="category" defaultValue="animals"><option value="animals">Animals</option><option value="food">Food</option><option value="vehicles">Vehicles</option><option value="nature">Nature</option><option value="home">Home</option><option value="school">School</option><option value="everyday">Everyday words</option></select></label>
     <button type="submit" className="button primary">Save draft</button>
    </form>
   </section>
   <section>
    <h2>Saved drafts ({words.length})</h2>
    {error?<p className="notice error">Unable to load the words database. Apply the SQL migration and confirm admin permissions.</p>:null}
    {!error&&words.length===0?<div className="panel"><p>No words yet. Add a draft using the form.</p></div>:null}
    <div className="word-list">{words.map(word=><article className="word-card" key={word.id}>
     <span className="status">{word.status}</span><h3>{word.word_text}</h3><p>{word.short_definition}</p>
     <p className="tag">{word.category}</p>
     {word.status==='draft'?<details><summary>Edit draft</summary><form action={updateDraftAction}>
      <input type="hidden" name="id" value={word.id}/>
      <label className="field">Meaning<input name="definition" minLength={3} maxLength={250} required defaultValue={word.short_definition}/></label>
      <label className="field">Example sentence<textarea name="example" maxLength={300} defaultValue={word.example_sentence??''}/></label>
      <label className="field">Category<select name="category" defaultValue={word.category}><option value="animals">Animals</option><option value="food">Food</option><option value="vehicles">Vehicles</option><option value="nature">Nature</option><option value="home">Home</option><option value="school">School</option><option value="everyday">Everyday words</option></select></label>
      <button type="submit" className="button primary">Save changes</button>
     </form>
     <form action={archiveDraftAction} style={{marginTop:12}}><input name="id" type="hidden" value={word.id}/><button type="submit" className="tool-button">Archive draft</button></form>
     </details>:null}
    </article>)}</div>
   </section>
  </div>
 </div>;
}
