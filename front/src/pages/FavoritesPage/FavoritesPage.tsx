import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import Button from '../../ui/Button/Button'
import { useWishlist } from '../../hooks/useWishlist'
import { productService } from '../../services/productService'
import type { Product } from '../../types/api'
import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[6]} 8px`};

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[8]} clamp(16px, 5vw, 64px)`};
  }
`

const PageTop = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const FavoritesLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`

const FavoritesTitle = styled.h1`
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
`

const CountRow = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.04em;
  margin-top: 6px;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[4]}`};
  text-align: center;
`

const EmptyTitle = styled.p`
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const EmptyBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 280px;
  line-height: 1.65;
`

const breadcrumb = [
  { label: 'Início', to: '/' },
  { label: 'Favoritos' },
]

export default function FavoritesPage() {
  const { items } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
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
        <FavoritesLabel>Salvos</FavoritesLabel>
        <FavoritesTitle>Favoritos</FavoritesTitle>
      </PageTop>

      {!loading && items.length === 0 ? (
        <EmptyState>
          <Heart size={56} strokeWidth={1} style={{ opacity: 0.3 }} />
          <EmptyTitle>Nenhum favorito ainda</EmptyTitle>
          <EmptyBody>Salve produtos que você gostou para encontrá-los facilmente depois.</EmptyBody>
          <Button as={Link} to="/produtos" variant="primary" size="md">Descobrir produtos</Button>
        </EmptyState>
      ) : (
        <>
          {!loading && <CountRow>{items.length} {items.length === 1 ? 'item salvo' : 'itens salvos'}</CountRow>}
          <ProductGrid products={products} loading={loading} />
        </>
      )}
    </PageWrapper>
  )
}
