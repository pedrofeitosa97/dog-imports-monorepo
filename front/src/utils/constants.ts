export interface SortOption {
  value: string
  label: string
}

export interface GenderOption {
  value: string
  label: string
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'newest', label: 'Mais recentes' },
]

export const SIZES: string[] = ['PP', 'P', 'M', 'G', 'GG', 'XG', '36', '38', '40', '42', '44', '46']

export const GENDERS: GenderOption[] = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'unissex', label: 'Unissex' },
]

export const STORAGE_KEYS = {
  token: 'dog_imports_token',
  cart: 'dog_imports_cart',
  wishlist: 'dog_imports_wishlist',
} as const

export const ITEMS_PER_PAGE = 12
