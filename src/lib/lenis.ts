import type Lenis from 'lenis'

let instance: Lenis | null = null
let holds = 0

export function setLenis(next: Lenis | null) {
  instance = next
  if (next && holds > 0) next.stop()
}

export function getLenis() {
  return instance
}

/** Reference-counted pause so the intro, menu, and page curtain can overlap. */
export function holdScroll() {
  holds += 1
  instance?.stop()
}

export function releaseScroll() {
  holds = Math.max(0, holds - 1)
  if (holds === 0) instance?.start()
}

export function scrollToTop(immediate = true) {
  if (instance) {
    instance.scrollTo(0, { immediate, force: true })
    return
  }
  window.scrollTo(0, 0)
}
