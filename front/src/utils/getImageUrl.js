const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')

/**
 * Converte um caminho de imagem salvo no banco (/uploads/products/x.jpg)
 * para a URL completa acessível pelo browser.
 * Imagens externas (http/https) são retornadas sem alteração.
 */
export function getImageUrl(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${BASE}${path}`
}
