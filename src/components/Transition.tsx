import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { holdScroll, releaseScroll, scrollToTop } from '../lib/lenis'

const TITLES: Record<string, string> = {
  '/': 'Lyra — The room disappears',
  '/specs': 'Lyra — Specifications',
  '/gallery': 'Lyra — Studies',
  '/story': 'Lyra — Origin',
}

const GoContext = createContext<((to: string) => void) | null>(null)

export function useGo() {
  const go = useContext(GoContext)
  if (!go) throw new Error('useGo must be used within TransitionProvider')
  return go
}

type Phase = 'idle' | 'cover' | 'reveal'

const COVER_MS = 680
const REVEAL_MS = 760

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const busy = useRef(false)

  useEffect(() => {
    document.title = TITLES[location.pathname] ?? 'Lyra — Empty frequency'
  }, [location.pathname])

  const go = useCallback(
    (to: string) => {
      if (to === location.pathname) {
        scrollToTop(true)
        return
      }
      if (reduced) {
        navigate(to)
        scrollToTop(true)
        return
      }
      if (busy.current) return
      busy.current = true
      holdScroll()
      setPhase('cover')
      window.setTimeout(() => {
        const swap = () => {
          flushSync(() => {
            navigate(to)
          })
          scrollToTop(true)
        }
        const root = document.documentElement
        if (typeof document.startViewTransition === 'function') {
          root.classList.add('vt-running')
          try {
            const transition = document.startViewTransition(() => {
              swap()
            })
            void transition.finished.finally(() => root.classList.remove('vt-running'))
          } catch {
            root.classList.remove('vt-running')
            swap()
          }
        } else {
          swap()
        }
        setPhase('reveal')
        window.setTimeout(() => {
          setPhase('idle')
          busy.current = false
          releaseScroll()
        }, REVEAL_MS)
      }, COVER_MS)
    },
    [location.pathname, navigate, reduced],
  )

  return (
    <GoContext.Provider value={go}>
      {children}
      <div className={`curtain is-${phase}`} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            style={{
              transitionDelay: `${(phase === 'reveal' ? 4 - index : index) * 48}ms`,
            }}
          />
        ))}
      </div>
    </GoContext.Provider>
  )
}
