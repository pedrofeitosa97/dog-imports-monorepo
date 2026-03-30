import { useState, useEffect } from 'react'
import HeroBanner from '../../shared/HeroBanner/HeroBanner'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import { productService } from '../../services/productService'
import type { Product } from '../../types/api'
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
  font-weight: ${({ theme }) => theme.typography.weight.extrabold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
`

const SeeAll = styled.a`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.brand};
  text-decoration: none;
  cursor: pointer;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover { opacity: 0.75; }
`

const mockProducts: Product[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  slug: `produto-${i + 1}`,
  name: ['Camiseta Tommy Hilfiger', 'Moletom Polo Ralph Lauren', 'Jaqueta Calvin Klein', 'Tênis Gucci', 'Bolsa Michael Kors', 'Perfume Versace', 'Calça Armani', 'Casaco Burberry', 'Óculos Ray-Ban'][i],
  brand: ['Tommy Hilfiger', 'Ralph Lauren', 'Calvin Klein', 'Gucci', 'Michael Kors', 'Versace', 'Armani', 'Burberry', 'Ray-Ban'][i],
  price: [299, 599, 899, 2499, 1299, 449, 799, 1899, 699][i],
  originalPrice: ([399, 799, 1199, 3199, 1599, null, 999, 2399, null] as (number | null)[])[i],
  rating: [4.5, 4.8, 4.2, 4.9, 4.6, 4.3, 4.7, 4.4, 4.1][i],
  reviewCount: [120, 85, 210, 45, 178, 92, 134, 67, 203][i],
  images: [`https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80`],
  badge: i === 0 ? 'NOVO' : i === 3 ? 'EXCLUSIVO' : undefined,
  stock: 10,
  isActive: true,
  isFeatured: i < 3,
  description: '',
  sizes: [],
  colors: [],
}))

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
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
