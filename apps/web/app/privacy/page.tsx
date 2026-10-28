import type {Metadata} from 'next';
export const metadata:Metadata={title:'Privacy & parent information'};
export default function Privacy(){return <article className="content-page section-width">
 <p className="eyebrow">PARENTS & LEARNERS</p><h1>Privacy and parent information</h1>
 <p>This is a development preview, not the final privacy policy for a released app. It offers a guest word-building demo without requiring a name, birthday, email, microphone, location, camera, payment, or account.</p>
 <h2>Local learning progress</h2><p>The browser demo stores progress only in your browser’s local storage so you can resume later. You can reset it from the demo; clearing your browser data also clears it. The preview does not send this progress to our database.</p>
 <h2>Audio</h2><p>Audio will be actual human recordings approved for educational use. No AI voice, voice cloning, or device speech synthesis is used as a fallback. Recorded audio has not yet been added to this demo.</p>
 <h2>Admin area</h2><p>The separate admin area uses adult administrator accounts through Supabase if configured; it is not a child account or a public social feature.</p>
 <h2>Before release</h2><p>A reviewed privacy policy, clear operator contact, data-rights process, required parental consent arrangements, and applicable child privacy compliance assessment must be completed before production launch.</p>
 </article>;}
