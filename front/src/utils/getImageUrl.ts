const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.includes('undefined') || path.includes('null')) return null
  if (path.startsWith('blob:')) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${BASE}${path}`
}
