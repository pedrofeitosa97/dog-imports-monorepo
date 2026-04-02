import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import FilterSidebar from '../../features/filters/FilterSidebar/FilterSidebar'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import Pagination from '../../ui/Pagination/Pagination'
import Modal from '../../ui/Modal/Modal'
import { useFilters } from '../../hooks/useFilters'
import { productService } from '../../services/productService'
import { ITEMS_PER_PAGE, SORT_OPTIONS } from '../../utils/constants'
import type { Product } from '../../types/api'
import type { BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb'
import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]} 8px;

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[8]} clamp(16px, 5vw, 64px)`};
  }
`

const PageTop = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const PageLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`

const PageTitle = styled.h1`
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const ResultCount = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.04em;
  margin-top: 6px;
`

const Layout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  align-items: flex-start;
`

const SidebarDesktop = styled.div`
  display: none;
  width: 220px;
  flex-shrink: 0;
  @media (min-width: 1024px) {
    display: block;
  }
`

const Main = styled.div`
  flex: 1;
  min-width: 0;
`

const SortBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const ActiveChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
`

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1px solid ${({ theme }) => theme.colors.borderMedium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 11px;
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentRed};
    color: ${({ theme }) => theme.colors.accentRed};
  }
`

const InlineSortSelect = styled.select`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: 6px 12px;
  font-size: 12px;
  font-family: inherit;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  option {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand};
  }
`

const MobileFilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (min-width: 1024px) {
    display: none;
  }
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing[10]};
`

const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  slug: `produto-${i + 1}`,
  name: `Produto Importado ${i + 1}`,
  brand: (['Tommy Hilfiger', 'Ralph Lauren', 'Calvin Klein', 'Gucci'] as const)[i % 4],
  price: 299 + i * 80,
  originalPrice: i % 3 === 0 ? 399 + i * 100 : null,
  rating: 4 + (i % 5) * 0.2,
  reviewCount: 50 + i * 15,
  images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
  stock: 10,
  isActive: true,
  isFeatured: false,
  description: '',
  sizes: [],
  colors: [],
}))

export default function ProductListingPage() {
  const { brand, category } = useParams<{ brand?: string; category?: string }>()
  const { filters, setFilter, toggleFilter, setPage, clearFilters } = useFilters()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    productService.getAll({ ...filters, brand, category, limit: ITEMS_PER_PAGE })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
          setTotal(data.length)
        } else {
          const paginated = data as { items?: Product[]; data?: Product[]; totalPages?: number; total?: number }
          const items = paginated.items ?? paginated.data ?? []
          setProducts(items)
          setTotal(paginated.total ?? items.length)
          setTotalPages(paginated.totalPages ?? 1)
        }
      })
      .catch(() => {
        setProducts(mockProducts)
        setTotal(mockProducts.length)
        setTotalPages(3)
      })
      .finally(() => setLoading(false))
  }, [filters, brand, category])

  const breadcrumb: BreadcrumbItem[] = [
    { label: 'Início', to: '/' },
    brand ? { label: brand } : null,
    category ? { label: category } : null,
    !brand && !category ? { label: 'Produtos' } : null,
  ].filter((item): item is BreadcrumbItem => item !== null)

  const pageTitle = brand ?? category ?? 'Todos os produtos'

  // Active filter chips
  type ArrayFilterKey = 'gender' | 'sizes' | 'brands' | 'categories'
  const chipDefs: Array<{ key: ArrayFilterKey; value: string; label: string }> = [
    ...filters.gender.map((v) => ({ key: 'gender' as ArrayFilterKey, value: v, label: v })),
    ...filters.sizes.map((v) => ({ key: 'sizes' as ArrayFilterKey, value: v, label: v })),
    ...filters.brands.map((v) => ({ key: 'brands' as ArrayFilterKey, value: v, label: v })),
    ...filters.categories.map((v) => ({ key: 'categories' as ArrayFilterKey, value: v, label: v })),
  ]

  return (
    <PageWrapper>
      <PageTop>
        <Breadcrumb items={breadcrumb} />
        <PageLabel>Catálogo</PageLabel>
        <PageTitle>{pageTitle}</PageTitle>
        {!loading && <ResultCount>{total} produto{total !== 1 ? 's' : ''}</ResultCount>}
      </PageTop>

      <MobileFilterBtn onClick={() => setFilterModalOpen(true)}>
        <SlidersHorizontal size={16} /> Filtrar e ordenar
      </MobileFilterBtn>

      <Layout>
        <SidebarDesktop>
          <FilterSidebar
            filters={filters}
            setFilter={setFilter}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            totalCount={products.length}
          />
        </SidebarDesktop>

        <Main>
          <SortBar>
            <InlineSortSelect
              value={filters.sortBy}
              onChange={(e) => setFilter('sortBy', e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </InlineSortSelect>
          </SortBar>
          {chipDefs.length > 0 && (
            <ActiveChips>
              {chipDefs.map((chip) => (
                <Chip key={`${chip.key}-${chip.value}`} onClick={() => toggleFilter(chip.key, chip.value)}>
                  {chip.label} <X size={10} />
                </Chip>
              ))}
            </ActiveChips>
          )}

          <ProductGrid products={products} loading={loading} />
          <PaginationWrapper>
            <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={setPage} />
          </PaginationWrapper>
        </Main>
      </Layout>

      <Modal isOpen={filterModalOpen} onClose={() => setFilterModalOpen(false)} title="Filtros" size="sm">
        <FilterSidebar
          filters={filters}
          setFilter={setFilter}
          toggleFilter={toggleFilter}
          clearFilters={() => { clearFilters(); setFilterModalOpen(false) }}
          totalCount={products.length}
        />
      </Modal>
    </PageWrapper>
  )
}
