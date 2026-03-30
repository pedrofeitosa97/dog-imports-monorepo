import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, RefreshCw, Truck, CreditCard, ChevronRight } from 'lucide-react'
import HeroBanner from '../../shared/HeroBanner/HeroBanner'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import { productService } from '../../services/productService'
import type { Product } from '../../types/api'
import styled, { keyframes } from 'styled-components'

/* ── Trust Strip ─────────────────────────────────────────────────────────── */

const TrustStrip = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const TrustInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(16px, 5vw, 64px);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-right: 1px solid ${({ theme }) => theme.colors.border};

  &:nth-child(even) {
    padding-left: 20px;
  }

  &:last-child {
    border-right: none;
  }

  @media (max-width: 767px) {
    padding: 14px 12px;
    &:nth-child(2) { border-right: none; }
    &:nth-child(3) { border-top: 1px solid ${({ theme }) => theme.colors.border}; }
    &:nth-child(4) { border-top: 1px solid ${({ theme }) => theme.colors.border}; border-right: none; padding-left: 20px; }
  }
`

const TrustIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.brandLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.brand};
  flex-shrink: 0;
`

const TrustText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`

const TrustTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: 0.01em;
`

const TrustSub = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ── Brands Strip ────────────────────────────────────────────────────────── */

const BrandsSection = styled.section`
  padding: 28px clamp(16px, 5vw, 64px);
  max-width: 1440px;
  margin: 0 auto;
  overflow: hidden;
`

const BrandsLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 16px;
`

const scroll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`

const BrandsTrack = styled.div`
  display: flex;
  gap: 0;
  width: max-content;
  animation: ${scroll} 28s linear infinite;

  &:hover { animation-play-state: paused; }
`

const BrandName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0 32px;
  white-space: nowrap;
  opacity: 0.45;
  transition: opacity 140ms ease;
  cursor: default;

  &:hover { opacity: 1; color: ${({ theme }) => theme.colors.brand}; }
`

/* ── Featured Section ────────────────────────────────────────────────────── */

const Section = styled.section`
  padding: 32px 8px 48px;
  max-width: 1440px;
  margin: 0 auto;

  @media (min-width: 480px) {
    padding: 40px clamp(16px, 5vw, 64px) 56px;
  }
`

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const SeeAll = styled(Link)`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brand};
  text-decoration: none;
  letter-spacing: 0.04em;
  white-space: nowrap;
  transition: opacity 140ms ease;

  &:hover { opacity: 0.75; }
`

/* ── Categories Row ──────────────────────────────────────────────────────── */

const CatsSection = styled.section`
  padding: 0 clamp(16px, 5vw, 64px) 40px;
  max-width: 1440px;
  margin: 0 auto;
`

const CatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (min-width: 640px) { grid-template-columns: repeat(4, 1fr); }
`

const CatCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 12px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 140ms ease, background 140ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
    background: ${({ theme }) => theme.colors.brandLight};
  }
`

const CatEmoji = styled.span`
  font-size: 22px;
  line-height: 1;
`

const CatLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};
`

/* ── Mock data ───────────────────────────────────────────────────────────── */

const BRANDS = [
  'Tommy Hilfiger', 'Ralph Lauren', 'Calvin Klein', 'Gucci',
  'Versace', 'Armani', 'Burberry', 'Michael Kors', 'Ray-Ban', 'Lacoste',
]

const mockProducts: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  slug: `produto-${i + 1}`,
  name: ['Camiseta Tommy Hilfiger', 'Moletom Polo Ralph Lauren', 'Jaqueta Calvin Klein', 'Tênis Gucci', 'Bolsa Michael Kors', 'Perfume Versace', 'Calça Armani', 'Casaco Burberry'][i],
  brand: ['Tommy Hilfiger', 'Ralph Lauren', 'Calvin Klein', 'Gucci', 'Michael Kors', 'Versace', 'Armani', 'Burberry'][i],
  price: [299, 599, 899, 2499, 1299, 449, 799, 1899][i],
  originalPrice: ([399, 799, 1199, 3199, 1599, null, 999, 2399] as (number | null)[])[i],
  rating: [4.5, 4.8, 4.2, 4.9, 4.6, 4.3, 4.7, 4.4][i],
  reviewCount: [120, 85, 210, 45, 178, 92, 134, 67][i],
  images: [`https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80`],
  badge: i === 0 ? 'NOVO' : i === 3 ? 'EXCLUSIVO' : undefined,
  stock: 10,
  isActive: true,
  isFeatured: true,
  description: '',
  sizes: [],
  colors: [],
}))

/* ── Component ───────────────────────────────────────────────────────────── */

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.getFeatured()
      .then(setProducts)
      .catch(() => setProducts(mockProducts))
      .finally(() => setLoading(false))
  }, [])

  const displayProducts = products.length ? products : mockProducts

  return (
    <>
      <HeroBanner />

      {/* Trust strip */}
      <TrustStrip>
        <TrustInner>
          <TrustItem>
            <TrustIcon><ShieldCheck size={16} /></TrustIcon>
            <TrustText>
              <TrustTitle>100% Autêntico</TrustTitle>
              <TrustSub>Garantia de originalidade</TrustSub>
            </TrustText>
          </TrustItem>
          <TrustItem>
            <TrustIcon><Truck size={16} /></TrustIcon>
            <TrustText>
              <TrustTitle>Frete grátis</TrustTitle>
              <TrustSub>Compras acima de R$ 500</TrustSub>
            </TrustText>
          </TrustItem>
          <TrustItem>
            <TrustIcon><RefreshCw size={16} /></TrustIcon>
            <TrustText>
              <TrustTitle>Troca em 30 dias</TrustTitle>
              <TrustSub>Sem complicação</TrustSub>
            </TrustText>
          </TrustItem>
          <TrustItem>
            <TrustIcon><CreditCard size={16} /></TrustIcon>
            <TrustText>
              <TrustTitle>Pagamento seguro</TrustTitle>
              <TrustSub>Pix, cartão e boleto</TrustSub>
            </TrustText>
          </TrustItem>
        </TrustInner>
      </TrustStrip>

      {/* Brands marquee */}
      <BrandsSection>
        <BrandsLabel>Marcas disponíveis</BrandsLabel>
        <BrandsTrack>
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <BrandName key={i}>{b}</BrandName>
          ))}
        </BrandsTrack>
      </BrandsSection>

      {/* Categories */}
      <CatsSection>
        <CatsGrid>
          <CatCard to="/produtos?gender=masculino">
            <CatEmoji>👔</CatEmoji>
            <CatLabel>Masculino</CatLabel>
          </CatCard>
          <CatCard to="/produtos?gender=feminino">
            <CatEmoji>👗</CatEmoji>
            <CatLabel>Feminino</CatLabel>
          </CatCard>
          <CatCard to="/produtos?sortBy=newest">
            <CatEmoji>✨</CatEmoji>
            <CatLabel>Novidades</CatLabel>
          </CatCard>
          <CatCard to="/produtos">
            <CatEmoji>🔥</CatEmoji>
            <CatLabel>Promoções</CatLabel>
          </CatCard>
        </CatsGrid>
      </CatsSection>

      {/* Featured products */}
      <Section>
        <SectionHeader>
          <SectionTitle>Em destaque</SectionTitle>
          <SeeAll to="/produtos">
            Ver todos <ChevronRight size={14} />
          </SeeAll>
        </SectionHeader>
        <ProductGrid products={displayProducts} loading={loading} skeletonCount={8} />
      </Section>
    </>
  )
}
