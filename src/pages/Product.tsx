import { lazy, Suspense, useLayoutEffect, useRef, type CSSProperties } from 'react'
import { Boundary } from '../components/Boundary'
import { ModelHit } from '../components/hero/ModelHit'
import { SplitLine } from '../components/SplitLine'
import { useIntro } from '../context/Intro'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { openReserve } from '../lib/reserve'
import { pose } from '../lib/pose'
import { asset } from '../lib/asset'

const HeroCanvas = lazy(() => import('../components/hero/HeroCanvas'))

const BEATS = [
  {
    n: '01',
    title: 'One ring.',
    body: 'Nothing ornamental. The mark on each cup is the voice coil, brought to the surface so you can see what is doing the work.',
  },
  {
    n: '02',
    title: 'Forty millimeters.',
    body: 'A planar diaphragm, tensioned by hand. It moves as a sheet, not a cone, which is why a voice arrives intact.',
  },
  {
    n: '03',
    title: 'Then it sleeps.',
    body: 'Eighteen hours, and no lamp to announce it. Lyra goes dark in the case the way a stone goes dark in a pocket.',
  },
]

const MATERIALS = [
  {
    index: '01',
    name: '6061',
    label: 'Aluminum',
    copy: 'Milled from a single billet. The swarf outweighs the band.',
    image: asset('/gallery/grain.svg'),
  },
  {
    index: '02',
    name: 'C110',
    label: 'Copper',
    copy: 'The voice coil, and the only warm color on the object.',
    image: asset('/gallery/coil.svg'),
  },
  {
    index: '03',
    name: 'Hide',
    label: 'Leather',
    copy: 'Vegetable-tanned, undyed, meant to darken where you touch it.',
    image: asset('/gallery/leather.svg'),
  },
  {
    index: '04',
    name: 'Air',
    label: 'Labyrinth',
    copy: 'Seven turns between the driver and the room.',
    image: asset('/gallery/section.svg'),
  },
]

const MARQUEE = ['Silence', 'Aluminum', 'Planar', 'Night', 'Copper', 'Kyoto', 'Air', 'Leather']

function HeroFallback() {
  return (
    <div className="hero-fallback" aria-hidden="true">
      <span />
      <span />
    </div>
  )
}

export function Product() {
  const root = useRef<HTMLDivElement>(null)
  const { ready } = useIntro()
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (!ready || reduced || !root.current) return
    const rootEl = root.current
    const mm = gsap.matchMedia()

    const ctx = gsap.context(() => {
      gsap.set('.display .char-inner', { yPercent: 110 })
      gsap.to('.display .char-inner', {
        yPercent: 0,
        duration: 1.25,
        ease: 'expo.out',
        stagger: 0.014,
        delay: 0.06,
      })
      gsap.from('.hero-fade', {
        y: 18,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        delay: 0.35,
        ease: 'power3.out',
      })

      const beats = gsap.utils.toArray<HTMLElement>('.pin-beat')
      const bar = rootEl.querySelector<HTMLElement>('[data-pin-bar]')
      gsap.set(beats.slice(1), { autoAlpha: 0, y: 30 })
      if (bar) gsap.set(bar, { scaleY: 0, transformOrigin: 'top center' })

      const pin = gsap.timeline({
        scrollTrigger: {
          trigger: '.pin',
          start: 'top top',
          end: () => (window.innerWidth >= 900 ? '+=230%' : '+=150%'),
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            pose.story = self.progress
          },
        },
      })

      beats.forEach((beat, index) => {
        if (index === 0) return
        const at = 0.28 + (index - 1) * 0.95
        pin.to(beats[index - 1], { autoAlpha: 0, y: -40, duration: 0.28 }, at)
        pin.fromTo(beat, { autoAlpha: 0, y: 42 }, { autoAlpha: 1, y: 0, duration: 0.34 }, at + 0.26)
      })
      if (bar) pin.to(bar, { scaleY: 1, ease: 'none', duration: 2 }, 0)

      const startScale = window.innerWidth >= 900 ? 0.36 : 0.78
      const emerge = gsap.timeline({
        scrollTrigger: {
          trigger: '.emerge',
          start: 'top top',
          end: () => (window.innerWidth >= 900 ? '+=170%' : '+=110%'),
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      emerge.fromTo(
        '.emerge-frame',
        { scale: startScale, borderRadius: '32px' },
        { scale: 1, borderRadius: '0px', ease: 'none', duration: 0.7 },
        0,
      )
      emerge.fromTo('.emerge-frame img', { scale: 1.2 }, { scale: 1, ease: 'none', duration: 0.7 }, 0)
      emerge.fromTo('.emerge-copy', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.28 }, 0.5)
    }, rootEl)

    mm.add('(min-width: 900px)', () => {
      const track = rootEl.querySelector<HTMLElement>('.h-track')
      if (!track) return
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 32),
        ease: 'none',
        scrollTrigger: {
          trigger: '.h-scroll',
          start: 'top top',
          end: () => `+=${Math.max(track.scrollWidth - window.innerWidth + 32, 1)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      pose.story = 0
      mm.revert()
      ctx.revert()
    }
  }, [ready, reduced])

  return (
    <div className="product" ref={root}>
      <div className="stage">
        <div className="stage-sticky">
          <Suspense fallback={<HeroFallback />}>
            <Boundary fallback={<HeroFallback />}>
              <HeroCanvas />
            </Boundary>
          </Suspense>
          <ModelHit />
        </div>
        <div className="stage-scroll">
          <section className="hero">
            <p className="kicker hero-fade">01 — Closed-back planar</p>
            <div className="hero-bottom">
              <h1 className="display" aria-label="The room disappears.">
                <SplitLine text="The room" />
                <SplitLine text="disappears." italic />
              </h1>
              <div className="hero-aside">
                <p className="hero-fade">
                  Lyra is a closed-back planar headphone milled from one billet of recycled aerospace aluminum. Built
                  for the hour when the house goes quiet.
                </p>
                <p className="sr-only">
                  A procedural three-dimensional model of the headphone sits above the headline. With a fine pointer,
                  drag to turn it.
                </p>
                <button className="btn hero-fade" type="button" onClick={openReserve}>
                  Request a pair
                </button>
              </div>
            </div>
          </section>

          <section className="pin" aria-label="The instrument, in three notes">
            <div className="pin-progress" aria-hidden="true">
              <span data-pin-bar="" />
            </div>
            <div className="pin-stage">
              {BEATS.map((beat) => (
                <article className="pin-beat" key={beat.n}>
                  <p className="kicker">{beat.n}</p>
                  <h2>{beat.title}</h2>
                  <p>{beat.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="emerge" aria-label="The seal">
        <div className="emerge-frame">
          <img src={asset('/gallery/night.svg')} alt="" />
        </div>
        <div className="emerge-copy">
          <p className="kicker">04 — The seal</p>
          <h2>The outside stays outside.</h2>
          <p>Closed, then vented through a seven-turn labyrinth. The room does not get a vote.</p>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((item, index) => (
            <span key={`${item}-${index}`}>
              {item}
              <i />
            </span>
          ))}
        </div>
      </div>

      <section className="h-scroll" aria-label="Materials">
        <div className="h-track">
          <article className="h-card h-card-title">
            <p className="kicker">Materials</p>
            <h2>What it is made of, and what was left on the floor.</h2>
          </article>
          {MATERIALS.map((item) => (
            <article
              key={item.index}
              className="h-card"
              style={{ '--card': `url(${item.image})` } as CSSProperties}
            >
              <p className="kicker">{item.index}</p>
              <div>
                <h3>{item.name}</h3>
                <p className="card-label">{item.label}</p>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="close">
        <p className="kicker">05 — The ask</p>
        <h2>Hear less of everything else.</h2>
        <button className="btn" type="button" onClick={openReserve}>
          Request a pair
        </button>
      </section>
    </div>
  )
}
