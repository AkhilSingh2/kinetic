import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../lib/gsap'
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery'

export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()

  useEffect(() => {
    const box = outer.current
    const target = inner.current
    if (!box || !target || reduced || !fine) return

    const xTo = gsap.quickTo(target, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(target, 'y', { duration: 0.45, ease: 'power3.out' })

    const onMove = (event: MouseEvent) => {
      const rect = box.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    box.addEventListener('mousemove', onMove)
    box.addEventListener('mouseleave', onLeave)
    return () => {
      box.removeEventListener('mousemove', onMove)
      box.removeEventListener('mouseleave', onLeave)
      gsap.set(target, { x: 0, y: 0 })
    }
  }, [fine, reduced, strength])

  return (
    <div className="magnetic" ref={outer} data-cursor="">
      <div className="magnetic-inner" ref={inner}>
        {children}
      </div>
    </div>
  )
}
