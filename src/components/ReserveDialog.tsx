import { useEffect, useRef } from 'react'
import { registerReserve } from '../lib/reserve'

export function ReserveDialog() {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    registerReserve(() => ref.current?.showModal())
    return () => registerReserve(null)
  }, [])

  return (
    <dialog
      className="reserve"
      ref={ref}
      aria-labelledby="reserve-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      <button className="text-btn" type="button" onClick={() => ref.current?.close()} autoFocus>
        Close
      </button>
      <p className="kicker">There is no list</p>
      <h2 id="reserve-title">Lyra is a study, not a product.</h2>
      <p>
        Nothing is being manufactured, and nothing is for sale. If the scroll made the object feel close, the study
        worked. It was made by Akhilendra Singh.
      </p>
      <a className="btn" href="https://github.com/AkhilSingh2">
        View the engineer
      </a>
    </dialog>
  )
}
