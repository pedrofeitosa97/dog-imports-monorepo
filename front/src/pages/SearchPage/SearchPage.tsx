import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import styled from 'styled-components'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import Pagination from '../../ui/Pagination/Pagination'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import { productService } from '../../services/productService'
import type { Product } from '../../types/api'
import { ITEMS_PER_PAGE, SORT_OPTIONS } from '../../utils/constants'

const Wrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[6]} 8px`};

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[8]} clamp(16px, 5vw, 64px)`};
  }
`

const TopRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

const SearchLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing[2]};
  margin-bottom: 4px;
`

const SearchHeadline = styled.h1`
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const QueryHighlight = styled.span`
  color: ${({ theme }) => theme.colors.brand};
`

const SortBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing[6]};
`

const ResultMeta = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.04em;
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[8]}`};
`

const EmptyIcon = styled.div`
  opacity: 0.10;
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`

const EmptyTitle = styled.h2`
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`

const EmptyBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const SuggestionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`

const SuggestionChip = styled(Link)`
  padding: 6px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: border-color ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.brand};
  }
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing[10]};
`

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const page = Number(searchParams.get('page') ?? 1)
  const [sortBy, setSortBy] = useState('relevance')

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    productService
      .getAll({ search: query, page, limit: ITEMS_PER_PAGE, sortBy })
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
  }, [query, page, sortBy])

  const breadcrumbs = [
    { label: 'Início', to: '/' },
    { label: query ? `Busca: "${query}"` : 'Busca' },
  ]

  if (!query) {
    return (
      <Wrapper>
        <EmptyState>
          <EmptyIcon><Search size={64} /></EmptyIcon>
          <EmptyTitle>O que você está procurando?</EmptyTitle>
          <EmptyBody>Use a busca no topo da página para encontrar produtos.</EmptyBody>
          <SuggestionRow>
            <SuggestionChip to="/produtos?gender=masculino">Masculino</SuggestionChip>
            <SuggestionChip to="/produtos?gender=feminino">Feminino</SuggestionChip>
            <SuggestionChip to="/produtos?sortBy=newest">Novidades</SuggestionChip>
            <SuggestionChip to="/produtos?discount=true">Promoções</SuggestionChip>
          </SuggestionRow>
        </EmptyState>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <TopRow>
        <Breadcrumb items={breadcrumbs} />
        <SearchLabel>Resultados</SearchLabel>
        <SearchHeadline>
          Busca por <QueryHighlight>&ldquo;{query}&rdquo;</QueryHighlight>
        </SearchHeadline>
      </TopRow>

      <SortBar>
        <ResultMeta>
          {loading ? 'Buscando...' : total === 0
            ? 'Nenhum produto encontrado'
            : `${total} produto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
        </ResultMeta>
        <InlineSortSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </InlineSortSelect>
      </SortBar>

      {!loading && products.length === 0 ? (
        <EmptyState>
          <EmptyIcon><Search size={64} /></EmptyIcon>
          <EmptyTitle>Nenhum resultado para &ldquo;{query}&rdquo;</EmptyTitle>
          <EmptyBody>Tente termos diferentes ou explore nossas categorias.</EmptyBody>
          <SuggestionRow>
            <SuggestionChip to="/produtos?gender=masculino">Masculino</SuggestionChip>
            <SuggestionChip to="/produtos?gender=feminino">Feminino</SuggestionChip>
            <SuggestionChip to="/produtos?sortBy=newest">Novidades</SuggestionChip>
            <SuggestionChip to="/produtos?discount=true">Promoções</SuggestionChip>
          </SuggestionRow>
        </EmptyState>
      ) : (
        <>
          <ProductGrid products={products} loading={loading} skeletonCount={ITEMS_PER_PAGE} />
          {totalPages > 1 && (
            <PaginationWrapper>
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
            </PaginationWrapper>
          )}
        </>
      )}
    </Wrapper>
  )
}
