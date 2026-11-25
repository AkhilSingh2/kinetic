import { useEffect, useRef } from 'react'
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery'

export function Cursor() {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !fine) return
    const root = document.documentElement
    const dotEl = dot.current
    const ringEl = ring.current
    if (!dotEl || !ringEl) return

    root.classList.add('has-cursor')
    let x = window.innerWidth * 0.5
    let y = window.innerHeight * 0.4
    let rx = x
    let ry = y
    let frame = 0
    let shown = false

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (!shown) {
        shown = true
        dotEl.classList.add('is-on')
        ringEl.classList.add('is-on')
      }
      dotEl.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const onOver = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      ringEl.classList.toggle('is-hot', Boolean(target.closest('a, button, [data-cursor]')))
    }
    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      ringEl.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    frame = requestAnimationFrame(loop)
    return () => {
      root.classList.remove('has-cursor')
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
    }
  }, [fine, reduced])

  if (reduced || !fine) return null

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
