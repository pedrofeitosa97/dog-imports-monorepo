import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import { useWishlist } from '../../hooks/useWishlist'
import { productService } from '../../services/productService'
import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[8]}`};
`

const PageTop = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.size['2xl']};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin-top: ${({ theme }) => theme.spacing[2]};
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[4]}`};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const EmptyTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`

const EmptyLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: underline;
`

const breadcrumb = [
  { label: 'Início', to: '/' },
  { label: 'Favoritos' },
]

export default function FavoritesPage() {
  const { items } = useWishlist()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    Promise.all(items.map((id) => productService.getById(id)))
      .then((results) => setProducts(results))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [items])

  return (
    <PageWrapper>
      <PageTop>
        <Breadcrumb items={breadcrumb} />
        <PageTitle>Favoritos ({items.length})</PageTitle>
      </PageTop>

      {!loading && items.length === 0 ? (
        <EmptyState>
          <Heart size={48} strokeWidth={1.5} />
          <EmptyTitle>Nenhum favorito ainda</EmptyTitle>
          <EmptyLink to="/produtos">Explorar produtos</EmptyLink>
        </EmptyState>
      ) : (
        <ProductGrid products={products} loading={loading} />
      )}
    </PageWrapper>
  )
}
