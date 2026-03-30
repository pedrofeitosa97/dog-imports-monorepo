import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface FiltersState {
  gender: string[]
  sizes: string[]
  priceMin: number
  priceMax: number
  brands: string[]
  categories: string[]
  colors: string[]
  sortBy: string
  page: number
  discount: boolean
}

type ArrayFilterKey = 'gender' | 'sizes' | 'brands' | 'categories' | 'colors'

function buildParams(filters: FiltersState): Record<string, string> {
  const params: Record<string, string> = {}
  if (filters.sortBy !== 'relevance') params.sortBy = filters.sortBy
  if (filters.page > 1) params.page = String(filters.page)
  if (filters.brands.length) params.brands = filters.brands.join(',')
  if (filters.categories.length) params.categories = filters.categories.join(',')
  if (filters.sizes.length) params.sizes = filters.sizes.join(',')
  if (filters.gender.length) params.gender = filters.gender.join(',')
  if (filters.colors.length) params.colors = filters.colors.join(',')
  if (filters.discount) params.discount = 'true'
  return params
}

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  // URL is the single source of truth — memoized so object reference only
  // changes when the actual search string changes (prevents useEffect loops)
  const searchStr = searchParams.toString()
  const filters = useMemo<FiltersState>(() => ({
    gender:     searchParams.get('gender')?.split(',').filter(Boolean)     ?? [],
    brands:     searchParams.get('brands')?.split(',').filter(Boolean)     ?? [],
    categories: searchParams.get('categories')?.split(',').filter(Boolean) ?? [],
    sizes:      searchParams.get('sizes')?.split(',').filter(Boolean)      ?? [],
    colors:     searchParams.get('colors')?.split(',').filter(Boolean)     ?? [],
    sortBy:     searchParams.get('sortBy') ?? 'relevance',
    page:       Number(searchParams.get('page')) || 1,
    priceMin:   Number(searchParams.get('priceMin')) || 0,
    priceMax:   Number(searchParams.get('priceMax')) || 9999,
    discount:   searchParams.get('discount') === 'true',
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [searchStr])

  const setFilter = (key: keyof FiltersState, value: FiltersState[keyof FiltersState]) => {
    setSearchParams(buildParams({ ...filters, [key]: value, page: 1 }), { replace: true })
  }

  const toggleFilter = (key: ArrayFilterKey, value: string) => {
    const arr = filters[key]
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
    setSearchParams(buildParams({ ...filters, [key]: next, page: 1 }), { replace: true })
  }

  const setPage = (page: number) => {
    setSearchParams(buildParams({ ...filters, page }), { replace: true })
  }

  const clearFilters = () => {
    setSearchParams({}, { replace: true })
  }

  return { filters, setFilter, toggleFilter, setPage, clearFilters }
}
