import type { MouseEvent, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useGo } from './Transition'

type Props = {
  to: string
  className?: string
  children: ReactNode
  onNavigate?: () => void
}

export function TransitionLink({ to, className, children, onNavigate }: Props) {
  const go = useGo()
  const location = useLocation()
  const current = location.pathname === to

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate?.()
    go(to)
  }

  return (
    <a href={to} className={className} aria-current={current ? 'page' : undefined} onClick={onClick}>
      {children}
    </a>
  )
}
