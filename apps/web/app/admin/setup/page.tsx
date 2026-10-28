import type {Metadata} from 'next';
export const metadata:Metadata={title:'Administrator setup',robots:{index:false,follow:false}};
export default function Setup(){return <div className="content-page section-width" style={{maxWidth:850}}>
 <p className="eyebrow">OWNER SETUP</p><h1>Connect the secure admin dashboard</h1>
 <p>Until Supabase authentication and the WordPath-specific database tables are configured, the admin area stays closed. No public demo user is granted administrator rights.</p>
 <h2>1. Prepare Supabase</h2>
 <p>Create or select your Supabase project. Run <code>supabase/migrations/20261028010000_wordpath_web_admin.sql</code> in its SQL Editor. The migration creates a protected word library and administrator membership table.</p>
 <h2>2. Approve your adult administrator account</h2>
 <p>In Supabase Auth, create an adult administrator login. Use the SQL Editor as the privileged database operator to add its Auth user UUID to <code>public.wordpath_admins</code>. Never make this operation accessible from the web app.</p>
 <h2>3. Configure Vercel</h2>
 <p>Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in the Vercel project environment. Use only the public key, never a service-role key.</p>
 <h2>4. Verify</h2><p>Visit <code>/admin/login</code> and sign in. Verify that a normal Supabase user is denied and an approved administrator can create, edit, and archive draft words. Publishing is intentionally locked until approved human recordings and asset review are implemented.</p>
 </div>;}
