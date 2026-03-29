export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function calcDiscount(original, current) {
  if (!original || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}
