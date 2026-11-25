import { TransitionLink } from './TransitionLink'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="kicker">Kinetic</p>
          <p className="footer-lead">A fictional instrument, built as a study in motion by Akhilendra Singh.</p>
        </div>
        <nav aria-label="Footer">
          <TransitionLink to="/">Product</TransitionLink>
          <TransitionLink to="/specs">Specs</TransitionLink>
          <TransitionLink to="/gallery">Gallery</TransitionLink>
          <TransitionLink to="/story">Story</TransitionLink>
        </nav>
        <div className="footer-meta">
          <a href="https://github.com/AkhilSingh2">github.com/AkhilSingh2</a>
          <span>Osaka / Kyoto</span>
          <span>Study 2026</span>
        </div>
      </div>
      <p className="footer-word" aria-hidden="true">
        Lyra
      </p>
    </footer>
  )
}
