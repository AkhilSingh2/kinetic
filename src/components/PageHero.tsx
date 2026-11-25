import { useLayoutEffect, useRef } from 'react'
import { useIntro } from '../context/Intro'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { gsap } from '../lib/gsap'
import { SplitLine } from './SplitLine'

type PageHeroProps = {
  index: string
  title: string
  lede: string
}

export function PageHero({ index, title, lede }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const { ready } = useIntro()
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (!ready || reduced || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.set('.char-inner', { yPercent: 110 })
      gsap.to('.char-inner', {
        yPercent: 0,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.012,
      })
      gsap.from('.lede', {
        y: 16,
        autoAlpha: 0,
        duration: 0.9,
        delay: 0.28,
        ease: 'power3.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [ready, reduced])

  return (
    <header className="page-hero" ref={ref}>
      <p className="kicker">{index}</p>
      <h1 aria-label={title}>
        <SplitLine text={title} />
      </h1>
      <p className="lede">{lede}</p>
    </header>
  )
}
