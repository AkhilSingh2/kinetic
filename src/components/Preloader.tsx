import { useEffect, useRef, useState } from 'react'
import { useIntro } from '../context/Intro'
import { Mark } from './Mark'

const RADIUS = 42
const CIRC = 2 * Math.PI * RADIUS

export function Preloader() {
  const { done, begin, finish } = useIntro()
  const [leaving, setLeaving] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (done) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }

    let frame = 0
    let timer = 0
    let dead = false
    let value = 0
    const start = performance.now()
    const minMs = 1650
    let loaded = document.readyState === 'complete'
    const onLoad = () => {
      loaded = true
    }
    window.addEventListener('load', onLoad)

    const paint = (next: number) => {
      const shown = Math.min(100, Math.round(next))
      if (countRef.current) countRef.current.textContent = String(shown).padStart(3, '0')
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(CIRC - (CIRC * Math.min(next, 100)) / 100)
      }
      rootRef.current?.setAttribute('aria-valuenow', String(shown))
    }

    const tick = (now: number) => {
      if (dead) return
      const elapsed = now - start
      const ready = loaded || elapsed > 4200
      const cap = ready && elapsed >= minMs ? 100 : Math.min(92, (elapsed / minMs) * 92)
      value += (cap - value) * (cap === 100 ? 0.3 : 0.12)
      paint(value)
      if (cap === 100 && value > 98.5) {
        paint(100)
        setLeaving(true)
        begin()
        timer = window.setTimeout(() => finish(), 1050)
        return
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      dead = true
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      window.removeEventListener('load', onLoad)
    }
  }, [begin, done, finish])

  if (done) return null

  return (
    <div
      className={`preloader${leaving ? ' is-leaving' : ''}`}
      ref={rootRef}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-label="Loading Lyra"
    >
      <div className="pre-top">
        <span className="pre-brand">
          <Mark size={22} />
          Lyra
        </span>
        <span className="pre-count" ref={countRef}>
          000
        </span>
      </div>
      <div className="pre-center">
        <svg className="pre-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="track" cx="50" cy="50" r={RADIUS} />
          <circle
            ref={ringRef}
            className="progress"
            cx="50"
            cy="50"
            r={RADIUS}
            style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC }}
          />
        </svg>
        <p>The room is loading.</p>
      </div>
      <div className="pre-bottom">
        <span>Kinetic / 01</span>
        <span>Osaka — Kyoto</span>
      </div>
    </div>
  )
}
