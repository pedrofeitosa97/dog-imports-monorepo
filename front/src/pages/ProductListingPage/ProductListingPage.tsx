import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import FilterSidebar from '../../features/filters/FilterSidebar/FilterSidebar'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import Pagination from '../../ui/Pagination/Pagination'
import Modal from '../../ui/Modal/Modal'
import { useFilters } from '../../hooks/useFilters'
import { productService } from '../../services/productService'
import { ITEMS_PER_PAGE } from '../../utils/constants'
import type { Product } from '../../types/api'
import type { BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb'
import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]} 8px;

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[8]}`};
  }
`

const PageTop = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.size['2xl']};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin-top: ${({ theme }) => theme.spacing[2]};
`

const Layout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  align-items: flex-start;
`

const SidebarDesktop = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: block;
  }
`

const Main = styled.div`
  flex: 1;
  min-width: 0;
`

const MobileFilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.size.sm};
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
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    productService.getAll({ ...filters, brand, category, limit: ITEMS_PER_PAGE })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          const paginated = data as { items?: Product[]; data?: Product[]; totalPages?: number }
          setProducts(paginated.items ?? paginated.data ?? [])
          setTotalPages(paginated.totalPages ?? 1)
        }
      })
      .catch(() => {
        setProducts(mockProducts)
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

  return (
    <PageWrapper>
      <PageTop>
        <Breadcrumb items={breadcrumb} />
        <PageTitle>{pageTitle} ({products.length})</PageTitle>
      </PageTop>

      <MobileFilterBtn onClick={() => setFilterModalOpen(true)}>
        <SlidersHorizontal size={16} /> Filtros
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
