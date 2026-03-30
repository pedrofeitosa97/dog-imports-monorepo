import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import styled from 'styled-components'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import Pagination from '../../ui/Pagination/Pagination'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import { productService } from '../../services/productService'
import type { Product } from '../../types/api'
import { ITEMS_PER_PAGE } from '../../utils/constants'

const Wrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[8]}`};

  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]}`};
  }
`

const TopRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.size['2xl']};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin-top: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};

  span {
    color: ${({ theme }) => theme.colors.brand};
  }
`

const Meta = styled.p`
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[8]}`};

  svg {
    opacity: 0.15;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.size.xl};
    font-weight: ${({ theme }) => theme.typography.weight.semibold};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }

  p {
    font-size: ${({ theme }) => theme.typography.size.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    productService
      .getAll({ search: query, page, limit: ITEMS_PER_PAGE })
      .then((res) => {
        setProducts(res.data)
        setTotal(res.total)
        setTotalPages(res.totalPages)
      })
      .catch(() => {
        setProducts([])
        setTotal(0)
      })
      .finally(() => setLoading(false))
  }, [query, page])

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: query ? `Busca: "${query}"` : 'Busca' },
  ]

  if (!query) {
    return (
      <Wrapper>
        <EmptyState>
          <Search size={64} />
          <h2>O que você está procurando?</h2>
          <p>Use a busca no topo da página para encontrar produtos.</p>
        </EmptyState>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <TopRow>
        <Breadcrumb items={breadcrumbs} />
        <Title>
          Resultados para <span>&ldquo;{query}&rdquo;</span>
        </Title>
        {!loading && (
          <Meta>
            {total === 0
              ? 'Nenhum produto encontrado'
              : `${total} produto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
          </Meta>
        )}
      </TopRow>

      {!loading && products.length === 0 ? (
        <EmptyState>
          <Search size={64} />
          <h2>Nenhum resultado para &ldquo;{query}&rdquo;</h2>
          <p>Tente termos diferentes ou navegue pelas categorias.</p>
        </EmptyState>
      ) : (
        <>
          <ProductGrid products={products} loading={loading} skeletonCount={ITEMS_PER_PAGE} />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                const params = new URLSearchParams(searchParams)
                params.set('page', String(p))
                window.scrollTo({ top: 0, behavior: 'smooth' })
                window.history.pushState({}, '', `/busca?${params}`)
                window.dispatchEvent(new PopStateEvent('popstate'))
              }}
            />
          )}
        </>
      )}
    </Wrapper>
  )
}
