/** Resolve a file in /public against the deploy base (e.g. /kinetic/ on GitHub Pages). */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
