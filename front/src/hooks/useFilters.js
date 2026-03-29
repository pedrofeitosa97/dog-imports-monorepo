import { useReducer, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const initialState = {
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

function filtersReducer(state, action) {
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
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const params = {}
    if (filters.sortBy !== 'relevance') params.sortBy = filters.sortBy
    if (filters.page > 1) params.page = filters.page
    if (filters.brands.length) params.brands = filters.brands.join(',')
    if (filters.categories.length) params.categories = filters.categories.join(',')
    if (filters.sizes.length) params.sizes = filters.sizes.join(',')
    if (filters.gender.length) params.gender = filters.gender.join(',')
    setSearchParams(params, { replace: true })
  }, [filters])

  const setFilter = (key, value) => dispatch({ type: 'SET', key, value })
  const toggleFilter = (key, value) => dispatch({ type: 'TOGGLE_ARRAY', key, value })
  const setPage = (page) => dispatch({ type: 'SET_PAGE', page })
  const clearFilters = () => dispatch({ type: 'CLEAR' })

  return { filters, setFilter, toggleFilter, setPage, clearFilters }
}
