import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery'
import { pointer } from '../../lib/pointer'

export function ModelHit() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  if (!fine || reduced) return null

  return (
    <div
      className="model-hit"
      data-cursor=""
      aria-hidden="true"
      onPointerDown={(event) => {
        pointer.dragging = true
        pointer.lastX = event.clientX
        pointer.lastY = event.clientY
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (!pointer.dragging) return
        const dx = event.clientX - pointer.lastX
        const dy = event.clientY - pointer.lastY
        pointer.lastX = event.clientX
        pointer.lastY = event.clientY
        pointer.dragY += dx * 0.01
        pointer.dragX += dy * 0.005
      }}
      onPointerUp={() => {
        pointer.dragging = false
      }}
      onPointerCancel={() => {
        pointer.dragging = false
      }}
    />
  )
}
