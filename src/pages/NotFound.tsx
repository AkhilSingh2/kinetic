import { TransitionLink } from '../components/TransitionLink'

export function NotFound() {
  return (
    <article className="sheet not-found">
      <p className="kicker">404</p>
      <h1>This frequency is empty.</h1>
      <p>The page is not on the instrument.</p>
      <TransitionLink to="/" className="btn">
        Back to Lyra
      </TransitionLink>
    </article>
  )
}
