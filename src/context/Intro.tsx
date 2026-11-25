import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { holdScroll, releaseScroll } from '../lib/lenis'

type IntroValue = {
  ready: boolean
  done: boolean
  begin: () => void
  finish: () => void
}

const IntroContext = createContext<IntroValue | null>(null)

function prefersReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(prefersReduced)
  const [done, setDone] = useState(prefersReduced)

  const begin = useCallback(() => setReady(true), [])
  const finish = useCallback(() => {
    setReady(true)
    setDone(true)
  }, [])

  const value = useMemo<IntroValue>(
    () => ({ ready, done, begin, finish }),
    [ready, done, begin, finish],
  )

  useEffect(() => {
    document.documentElement.classList.toggle('intro-lock', !done)
    if (!done) {
      holdScroll()
      return () => releaseScroll()
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [done])

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
}

export function useIntro() {
  const value = useContext(IntroContext)
  if (!value) throw new Error('useIntro must be used within IntroProvider')
  return value
}
