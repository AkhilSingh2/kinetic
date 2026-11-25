import { useLayoutEffect, useRef } from 'react'
import { PageHero } from '../components/PageHero'
import { useIntro } from '../context/Intro'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useReveals } from '../hooks/useReveals'
import { gsap } from '../lib/gsap'

const ROWS = [
  ['Driver', '40 mm planar magnetic'],
  ['Impedance', '32 Ω'],
  ['Sensitivity', '98 dB SPL / mW'],
  ['Response', '8 Hz – 42 kHz'],
  ['Distortion', '< 0.08% at 1 kHz'],
  ['Weight', '248 g'],
  ['Battery', '18 hours'],
  ['Charge', '20 minutes for 4 hours'],
  ['Wireless', 'Bluetooth 5.4, aptX Lossless, LDAC'],
  ['Wired', '4.4 mm balanced, USB-C audio'],
  ['Materials', '6061 aluminum, vegetable-tanned leather, copper'],
  ['Origin', 'Milled in Osaka, tuned in Kyoto'],
]

export function Specs() {
  const root = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const { ready } = useIntro()
  const reduced = useReducedMotion()
  useReveals(root, ready)

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path || !ready || reduced) return
    const length = path.getTotalLength()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: path,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.6,
          },
        },
      )
    })
    return () => ctx.revert()
  }, [ready, reduced])

  return (
    <article className="sheet" ref={root}>
      <PageHero
        index="02 — Specifications"
        title="Measured, then left alone."
        lede="A target curve is a compromise with a committee. Lyra was tuned to small rooms, close voices, and the noise a house makes after midnight."
      />
      <dl className="spec-list" data-reveal>
        {ROWS.map(([label, value]) => (
          <div className="spec-row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <section className="curve" data-reveal>
        <div className="curve-head">
          <p className="kicker">Response</p>
          <h2>A drawing, not a laboratory plot.</h2>
          <p>
            The line is the shape of the fiction: present in the bass, unforced through the voice, and unwilling to
            shout at the top. These figures describe the story. They are not measurements of a manufactured object.
          </p>
        </div>
        <svg viewBox="0 0 1000 280" role="img" aria-label="Stylized frequency curve, level through the midrange and falling after the top octave.">
          <path className="axis" d="M40 240 H960" />
          <path
            ref={pathRef}
            className="response"
            d="M40 198 C 130 196, 190 188, 250 168 S 370 118, 470 110 S 640 104, 760 132 S 900 196, 960 214"
          />
          <circle cx="470" cy="110" r="5" className="curve-dot" />
        </svg>
        <div className="curve-labels">
          <span>20 Hz</span>
          <span>1 kHz</span>
          <span>20 kHz</span>
          <span>40 kHz</span>
        </div>
      </section>
      <section className="refusal" data-reveal>
        <p className="kicker">Refusal</p>
        <h2>No active noise control.</h2>
        <p>The seal is the engineering. There is no app, and no light that blinks for nobody.</p>
      </section>
    </article>
  )
}
