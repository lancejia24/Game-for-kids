import Link from 'next/link';
export default function Home(){
 return <div className="home">
  <section className="hero">
   <div className="hero-copy">
    <p className="eyebrow">LEARN ONE SOUND AT A TIME</p>
    <h1>Little sounds.<br/><span>Big discoveries.</span></h1>
    <p>Listen, recognize, and build words with movable letter tiles. One learning pathway, with age-appropriate styles for kids, teens and adults.</p>
    <div className="hero-actions"><Link className="button primary" href="/play">Try the spelling game</Link><Link className="button secondary" href="#how-it-works">How it works</Link></div>
    <p className="muted small">Free development preview. No account, advertising, or child data upload.</p>
   </div>
   <div className="hero-visual" aria-label="Illustration of letters making the word CAT">
    <div className="sample-emoji" aria-hidden="true">🐱</div><p>Build the word</p>
    <div className="sample-tiles" aria-hidden="true"><span>C</span><span>A</span><span>T</span></div>
    <div className="hero-ribbon">Sound • Spell • Understand</div>
   </div>
  </section>
  <section id="how-it-works" className="how section-width">
   <div className="section-heading"><p className="eyebrow">HOW IT WORKS</p><h2>Three simple steps to stronger spelling.</h2></div>
   <div className="feature-grid">
    <article className="feature"><div className="feature-emoji" aria-hidden="true">👂</div><h3>Hear & recognize</h3><p>Identify sounds and patterns using clear phonics prompts.</p></article>
    <article className="feature"><div className="feature-emoji" aria-hidden="true">🔤</div><h3>Build the word</h3><p>Drag or tap letter tiles into slots, even when letters repeat.</p></article>
    <article className="feature"><div className="feature-emoji" aria-hidden="true">🌱</div><h3>Learn & grow</h3><p>Discover meanings, practice tricky sounds, and pick up where you left off.</p></article>
   </div>
  </section>
  <section className="development-note section-width"><h2>A thoughtful work in progress</h2>
   <p>The current demo has four example words. We are preparing professionally reviewed, <strong>100% human-recorded</strong> English audio, original illustrations, and a complete adaptive pathway. Until approved recordings exist, the preview uses written instructions instead of synthetic voices.</p>
   <Link href="/play" className="button primary">Open the demo</Link>
  </section>
 </div>;
}
