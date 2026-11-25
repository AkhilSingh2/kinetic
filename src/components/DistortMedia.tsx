import { useEffect, useRef } from 'react'
import { mountDistort, type DistortHandle } from '../lib/distort'
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery'

let activeDestroy: (() => void) | null = null

export function DistortMedia({ src, alt }: { src: string; alt: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const interactive = !reduced && fine

  useEffect(() => {
    if (!interactive) return
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    let local: DistortHandle | null = null
    let dead = false
    let releaseTimer = 0

    const destroyLocal = () => {
      local?.destroy()
      local = null
      if (activeDestroy === destroyLocal) activeDestroy = null
    }

    const ensure = () => {
      if (dead) return null
      if (!local) {
        local = mountDistort(canvas, host, src)
      }
      return local
    }

    const onEnter = () => {
      window.clearTimeout(releaseTimer)
      if (activeDestroy && activeDestroy !== destroyLocal) activeDestroy()
      const handle = ensure()
      if (!handle) return
      activeDestroy = destroyLocal
      handle.setHover(1)
    }
    const onLeave = () => {
      local?.setHover(0)
      window.clearTimeout(releaseTimer)
      releaseTimer = window.setTimeout(destroyLocal, 420)
    }
    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      ensure()?.setMouse((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height)
    }

    host.addEventListener('pointerenter', onEnter)
    host.addEventListener('pointerleave', onLeave)
    host.addEventListener('pointermove', onMove)
    return () => {
      dead = true
      window.clearTimeout(releaseTimer)
      host.removeEventListener('pointerenter', onEnter)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('pointermove', onMove)
      destroyLocal()
    }
  }, [interactive, src])

  return (
    <div className="distort" ref={hostRef}>
      <img src={src} alt={alt} draggable={false} />
      {interactive ? <canvas ref={canvasRef} aria-hidden="true" /> : null}
    </div>
  )
}
