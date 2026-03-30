import FilterAccordion from '../FilterAccordion/FilterAccordion'
import PriceRange from '../PriceRange/PriceRange'
import { SidebarWrapper, SidebarHeader, Title, ClearBtn, Count } from './FilterSidebar.styles'
import { GENDERS, SIZES, SORT_OPTIONS } from '../../../utils/constants'
import Select from '../../../ui/Select/Select'
import type { Category } from '../../../types/api'
import type { FiltersState } from '../../../hooks/useFilters'

interface FilterSidebarProps {
  filters: FiltersState
  setFilter: (key: keyof FiltersState, value: FiltersState[keyof FiltersState]) => void
  toggleFilter: (key: 'gender' | 'sizes' | 'brands' | 'categories' | 'colors', value: string) => void
  clearFilters: () => void
  totalCount?: number
  brands?: string[]
  categories?: Category[]
  colors?: string[]
}

export default function FilterSidebar({
  filters,
  setFilter,
  toggleFilter,
  clearFilters,
  totalCount = 0,
  brands = [],
  categories = [],
  colors = [],
}: FilterSidebarProps) {
  return (
    <SidebarWrapper>
      <SidebarHeader>
        <Title>Filtros</Title>
        <ClearBtn onClick={clearFilters}>Limpar</ClearBtn>
      </SidebarHeader>

      {totalCount > 0 && <Count>{totalCount} produtos</Count>}

      <Select
        label="Ordenar por"
        options={SORT_OPTIONS}
        value={filters.sortBy}
        onChange={(e) => setFilter('sortBy', e.target.value)}
        fullWidth
      />

      <FilterAccordion
        title="Gênero"
        options={GENDERS}
        selected={filters.gender}
        onToggle={(v) => toggleFilter('gender', v)}
        defaultOpen
      />

      <FilterAccordion
        title="Tamanho"
        options={SIZES.map((s) => ({ value: s, label: s }))}
        selected={filters.sizes}
        onToggle={(v) => toggleFilter('sizes', v)}
      />

      {brands.length > 0 && (
        <FilterAccordion
          title="Marca"
          options={brands.map((b) => ({ value: b, label: b }))}
          selected={filters.brands}
          onToggle={(v) => toggleFilter('brands', v)}
        />
      )}

      {categories.length > 0 && (
        <FilterAccordion
          title="Categoria"
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          selected={filters.categories}
          onToggle={(v) => toggleFilter('categories', v)}
        />
      )}

      {colors.length > 0 && (
        <FilterAccordion
          title="Cor"
          options={colors.map((c) => ({ value: c, label: c }))}
          selected={filters.colors}
          onToggle={(v) => toggleFilter('colors', v)}
        />
      )}

      <FilterAccordion title="Preço">
        <PriceRange
          valueMin={filters.priceMin}
          valueMax={filters.priceMax}
          onChange={([min, max]) => {
            setFilter('priceMin', min)
            setFilter('priceMax', max)
          }}
        />
      </FilterAccordion>
    </SidebarWrapper>
  )
}
