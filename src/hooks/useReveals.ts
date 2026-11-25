import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from './useMediaQuery'

export function useReveals(root: RefObject<HTMLElement | null>, ready: boolean) {
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (!ready || reduced || !root.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 28,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [ready, reduced, root])
}
