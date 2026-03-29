import { useState, useEffect } from 'react'
import HeroBanner from '../../shared/HeroBanner/HeroBanner'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import { productService } from '../../services/productService'
import styled from 'styled-components'

const Section = styled.section`
  padding: ${({ theme }) => `${theme.spacing[12]} ${theme.spacing[8]}`};
  max-width: 1440px;
  margin: 0 auto;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.size['2xl']};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`

const SeeAll = styled.a`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: underline;
  cursor: pointer;

  &:hover { color: ${({ theme }) => theme.colors.textPrimary}; }
`

const mockProducts = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  slug: `produto-${i + 1}`,
  name: ['Camiseta Tommy Hilfiger', 'Moletom Polo Ralph Lauren', 'Jaqueta Calvin Klein', 'Tênis Gucci', 'Bolsa Michael Kors', 'Perfume Versace', 'Calça Armani', 'Casaco Burberry', 'Óculos Ray-Ban'][i],
  brand: ['Tommy Hilfiger', 'Ralph Lauren', 'Calvin Klein', 'Gucci', 'Michael Kors', 'Versace', 'Armani', 'Burberry', 'Ray-Ban'][i],
  category: 'Masculino',
  price: [299, 599, 899, 2499, 1299, 449, 799, 1899, 699][i],
  originalPrice: [399, 799, 1199, 3199, 1599, null, 999, 2399, null][i],
  rating: [4.5, 4.8, 4.2, 4.9, 4.6, 4.3, 4.7, 4.4, 4.1][i],
  reviewCount: [120, 85, 210, 45, 178, 92, 134, 67, 203][i],
  images: [`https://images.unsplash.com/photo-${['1521572163474-6864f9cf17ab', '1556821840-3a63f15732ce', '1591047139829-d91aecb6caea', '1542291026-7eec264c27ff', '1547949003-9792a18a2601', '1588099768523-f4e6a5679d88', '1594938298603-a69a74ba0905', '1544923246-77307dd654cb', '1511499767150-a7a1aaaa-4b66'][i]}?w=600&q=80`],
  badge: i === 0 ? 'NOVO' : i === 3 ? 'EXCLUSIVO' : null,
}))

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    productService.getFeatured()
      .then(setProducts)
      .catch(() => setProducts(mockProducts))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <HeroBanner />
      <Section>
        <SectionHeader>
          <SectionTitle>Em destaque</SectionTitle>
          <SeeAll href="/produtos">Ver todos</SeeAll>
        </SectionHeader>
        <ProductGrid products={products.length ? products : mockProducts} loading={loading} />
      </Section>
    </>
  )
}
