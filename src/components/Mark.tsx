export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="12.25" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="16" r="3.15" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
