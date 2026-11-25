let opener: (() => void) | null = null

export function registerReserve(fn: (() => void) | null) {
  opener = fn
}

export function openReserve() {
  opener?.()
}
