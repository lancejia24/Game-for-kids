import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
export const metadata:Metadata={
 title:{default:'WordPath | Listen. Build. Learn.',template:'%s | WordPath'},
 description:'A friendly phonics and spelling journey with letter tiles, gentle feedback, and separate kids, teens and adults experiences.',
 robots:{index:true,follow:true}
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body>
  <header className="site-header"><nav className="site-nav" aria-label="Main navigation">
   <Link href="/" className="brand" aria-label="WordPath home"><span className="brand-mark">W</span>WordPath</Link>
   <div className="nav-links"><Link href="/play">Play demo</Link><Link href="/privacy">Privacy</Link><Link href="/admin">Admin</Link></div>
  </nav></header>
  <main id="main-content">{children}</main>
  <footer className="site-footer"><span>WordPath • Phonics, reading & spelling</span><span><Link href="/privacy">Privacy</Link> · <Link href="/admin">Admin</Link></span></footer>
 </body></html>;
}
