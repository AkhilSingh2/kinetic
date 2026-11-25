import { useRef } from 'react'
import { PageHero } from '../components/PageHero'
import { useIntro } from '../context/Intro'
import { useReveals } from '../hooks/useReveals'

const CHAPTERS = [
  {
    n: '01',
    title: 'The brief',
    body: 'Make a headphone that feels like a tool left on a workbench. Not a gadget, not a lifestyle, not a glowing case that needs a firmware update before you can hear a record.',
  },
  {
    n: '02',
    title: 'The metal',
    body: 'One billet of recycled aerospace aluminum. Three hours of milling. Almost all of it becomes swarf. What remains is the band, and it remembers the shape of a head rather than a template.',
  },
  {
    n: '03',
    title: 'The ear',
    body: 'We tuned to small rooms and to voices, not to a curve copied from a competitor’s brochure. If a piano sounds like a piano at midnight, the tuning is finished.',
  },
  {
    n: '04',
    title: 'The refusal',
    body: 'Active noise control came off. The companion app came off. The lamp that tells you the battery is a battery came off. The seal stayed.',
  },
]

const TIMES = [
  ['Brief', 'Night, a small room, one listener.'],
  ['Metal', 'Osaka. One billet, mostly swarf.'],
  ['Tune', 'Kyoto. Voices, not a leaderboard.'],
  ['Leave', 'No app. No lamp. Ship the silence.'],
]

export function Story() {
  const root = useRef<HTMLElement>(null)
  const { ready } = useIntro()
  useReveals(root, ready)

  return (
    <article className="sheet" ref={root}>
      <PageHero
        index="04 — Origin"
        title="A tool, not a gadget."
        lede="Lyra began as a disagreement with objects that ask for attention. The work was to make one that disappears, and to make a site that could prove it before the metal existed."
      />
      {CHAPTERS.map((chapter) => (
        <section className="chapter" key={chapter.n} data-reveal>
          <p className="kicker">{chapter.n}</p>
          <div>
            <h2>{chapter.title}</h2>
            <p>{chapter.body}</p>
          </div>
        </section>
      ))}
      <blockquote className="pull" data-reveal>
        Loud was never the point.
      </blockquote>
      <section className="timeline" aria-label="The making">
        {TIMES.map(([title, copy]) => (
          <article className="time-card" key={title} data-reveal>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>
      <section className="colophon" data-reveal>
        <p>
          Lyra does not ship. The site does. It was made by Akhilendra Singh so an object could be felt before it could
          be held.
        </p>
      </section>
    </article>
  )
}
