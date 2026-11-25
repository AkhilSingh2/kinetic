import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { setLenis } from '../lib/lenis'
import { useReducedMotion } from '../hooks/useMediaQuery'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.92,
      touchMultiplier: 1,
    })
    setLenis(lenis)
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const fontsReady = document.fonts.ready.then(refresh)

    return () => {
      window.removeEventListener('load', refresh)
      void fontsReady
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [reduced])

  return children
}
