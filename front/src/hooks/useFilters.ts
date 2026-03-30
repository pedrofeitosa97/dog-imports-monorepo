import { useReducer, useEffect } from 'react'
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
}

type ArrayFilterKey = 'gender' | 'sizes' | 'brands' | 'categories' | 'colors'

type FiltersAction =
  | { type: 'SET'; key: keyof FiltersState; value: FiltersState[keyof FiltersState] }
  | { type: 'TOGGLE_ARRAY'; key: ArrayFilterKey; value: string }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'CLEAR' }

const initialState: FiltersState = {
  gender: [],
  sizes: [],
  priceMin: 0,
  priceMax: 9999,
  brands: [],
  categories: [],
  colors: [],
  sortBy: 'relevance',
  page: 1,
}

function filtersReducer(state: FiltersState, action: FiltersAction): FiltersState {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.key]: action.value, page: 1 }
    case 'TOGGLE_ARRAY': {
      const arr = state[action.key]
      const exists = arr.includes(action.value)
      return {
        ...state,
        [action.key]: exists ? arr.filter((v) => v !== action.value) : [...arr, action.value],
        page: 1,
      }
    }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'CLEAR':
      return { ...initialState }
    default:
      return state
  }
}

export function useFilters() {
  const [filters, dispatch] = useReducer(filtersReducer, initialState)
  const [, setSearchParams] = useSearchParams()

  useEffect(() => {
    const params: Record<string, string> = {}
    if (filters.sortBy !== 'relevance') params.sortBy = filters.sortBy
    if (filters.page > 1) params.page = String(filters.page)
    if (filters.brands.length) params.brands = filters.brands.join(',')
    if (filters.categories.length) params.categories = filters.categories.join(',')
    if (filters.sizes.length) params.sizes = filters.sizes.join(',')
    if (filters.gender.length) params.gender = filters.gender.join(',')
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const setFilter = (key: keyof FiltersState, value: FiltersState[keyof FiltersState]) =>
    dispatch({ type: 'SET', key, value })
  const toggleFilter = (key: ArrayFilterKey, value: string) =>
    dispatch({ type: 'TOGGLE_ARRAY', key, value })
  const setPage = (page: number) => dispatch({ type: 'SET_PAGE', page })
  const clearFilters = () => dispatch({ type: 'CLEAR' })

  return { filters, setFilter, toggleFilter, setPage, clearFilters }
}
