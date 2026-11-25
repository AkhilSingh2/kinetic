import { useEffect, useState } from 'react'
import { Magnetic } from './Magnetic'
import { Mark } from './Mark'
import { TransitionLink } from './TransitionLink'
import { useGo } from './Transition'
import { holdScroll, releaseScroll } from '../lib/lenis'
import { openReserve } from '../lib/reserve'

const LINKS = [
  { to: '/', label: 'Product', index: '01' },
  { to: '/specs', label: 'Specs', index: '02' },
  { to: '/gallery', label: 'Gallery', index: '03' },
  { to: '/story', label: 'Story', index: '04' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const go = useGo()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (!open) return
    holdScroll()
    return () => releaseScroll()
  }, [open])

  const closeAndGo = (to: string) => {
    go(to)
    setOpen(false)
  }

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Magnetic strength={0.4}>
        <TransitionLink to="/" className="brand" onNavigate={() => setOpen(false)}>
          <Mark />
          Lyra
        </TransitionLink>
      </Magnetic>
      <nav className="nav-links" aria-label="Primary">
        {LINKS.map((link) => (
          <Magnetic key={link.to} strength={0.45}>
            <TransitionLink to={link.to}>{link.label}</TransitionLink>
          </Magnetic>
        ))}
      </nav>
      <div className="nav-end">
        <Magnetic strength={0.3}>
          <button className="btn nav-reserve" type="button" onClick={openReserve}>
            Request a pair
          </button>
        </Magnetic>
        <button
          className={`nav-burger${open ? ' is-open' : ''}`}
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
      <div className={`menu${open ? ' is-open' : ''}`} inert={!open ? true : undefined}>
        <nav aria-label="Mobile">
          {LINKS.map((link) => (
            <a
              key={link.to}
              href={link.to}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
                event.preventDefault()
                closeAndGo(link.to)
              }}
            >
              {link.label}
              <span>{link.index}</span>
            </a>
          ))}
        </nav>
        <button className="btn" type="button" onClick={() => { setOpen(false); openReserve() }}>
          Request a pair
        </button>
      </div>
    </header>
  )
}
