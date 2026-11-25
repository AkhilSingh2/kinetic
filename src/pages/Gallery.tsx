import { useRef } from 'react'
import { DistortMedia } from '../components/DistortMedia'
import { PageHero } from '../components/PageHero'
import { useIntro } from '../context/Intro'
import { useReveals } from '../hooks/useReveals'

const STUDIES = [
  {
    src: '/gallery/ring.svg',
    title: 'The ring',
    meta: '01 / Macro',
    alt: 'Generative study of concentric rings, ivory on black with one copper circle.',
  },
  {
    src: '/gallery/coil.svg',
    title: 'Voice coil',
    meta: '02 / Copper',
    alt: 'Generative copper spiral on a black field.',
  },
  {
    src: '/gallery/grain.svg',
    title: '6061 grain',
    meta: '03 / Billet',
    alt: 'Generative drawing of brushed horizontal grain.',
  },
  {
    src: '/gallery/leather.svg',
    title: 'Hide',
    meta: '04 / Contact',
    alt: 'Generative study of overlapping brown forms suggesting undyed leather.',
  },
  {
    src: '/gallery/night.svg',
    title: 'Unlit',
    meta: '05 / Night',
    alt: 'A dark field with a single copper ring and a small point of light.',
  },
  {
    src: '/gallery/section.svg',
    title: 'Labyrinth',
    meta: '06 / Section',
    alt: 'Line drawing of a headphone cup in section, with a copper seal.',
  },
]

export function Gallery() {
  const root = useRef<HTMLElement>(null)
  const { ready } = useIntro()
  useReveals(root, ready)

  return (
    <article className="sheet" ref={root}>
      <PageHero
        index="03 — Studies"
        title="Studies in metal and air."
        lede="Six plates made for the site, not borrowed. Hover a plate on a fine pointer and the image gives, just slightly, under the hand."
      />
      <div className="gallery-grid">
        {STUDIES.map((study) => (
          <figure key={study.src} data-reveal>
            <DistortMedia src={study.src} alt={study.alt} />
            <figcaption>
              <span>{study.title}</span>
              <span>{study.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </article>
  )
}
