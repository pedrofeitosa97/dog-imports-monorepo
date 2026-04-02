import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, RefreshCw, Truck, CreditCard, ChevronRight, User, Users, Sparkles, Tag } from 'lucide-react'
import HeroBanner from '../../shared/HeroBanner/HeroBanner'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import { productService } from '../../services/productService'
import type { Product } from '../../types/api'
import styled, { keyframes } from 'styled-components'

/* ── Trust Strip ─────────────────────────────────────────────────────────── */

const TrustStrip = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const TrustInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(16px, 5vw, 64px);
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
`

const TrustText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const TrustTitle = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const TrustSub = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ── Categories Strip ────────────────────────────────────────────────────── */

const CatsSection = styled.section`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const CatsInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(16px, 5vw, 64px);
  display: flex;
  flex-wrap: wrap;
  gap: 0;
`

const CatCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 28px 18px 0;
  margin-right: 32px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  position: relative;
  transition: color ${({ theme }) => theme.transitions.fast};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: transparent;
    transition: background ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    &::after { background: ${({ theme }) => theme.colors.brand}; }
  }

  @media (max-width: 640px) {
    padding: 14px 16px 14px 0;
    margin-right: 20px;
  }
`

const CatLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

/* ── Brands Strip ────────────────────────────────────────────────────────── */

const BrandsSection = styled.section`
  padding: 32px clamp(16px, 5vw, 64px);
  max-width: 1440px;
  margin: 0 auto;
  overflow: hidden;
`

const BrandsLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 18px;
`

const scroll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`

const BrandsTrack = styled.div`
  display: flex;
  gap: 0;
  width: max-content;
  animation: ${scroll} 30s linear infinite;

  &:hover { animation-play-state: paused; }
`

const BrandName = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0 40px;
  white-space: nowrap;
  opacity: 0.35;
  transition: opacity 140ms ease;
  cursor: default;

  &:hover { opacity: 1; color: ${({ theme }) => theme.colors.brand}; }
`

/* ── Section ─────────────────────────────────────────────────────────────── */

const Section = styled.section`
  padding: 40px 8px 56px;
  max-width: 1440px;
  margin: 0 auto;

  @media (min-width: 480px) {
    padding: 48px clamp(16px, 5vw, 64px) 64px;
  }
`

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 12px;
`

const SectionMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const SectionLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const SectionTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.1;
`

const SeeAll = styled(Link)`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brand};
  text-decoration: none;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: opacity 140ms ease;
  padding-bottom: 2px;

  &:hover { opacity: 0.7; }
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
            <TrustIcon><ShieldCheck size={18} /></TrustIcon>
            <TrustText>
              <TrustTitle>100% Autêntico</TrustTitle>
              <TrustSub>Garantia de originalidade</TrustSub>
            </TrustText>
          </TrustItem>
          <TrustItem>
            <TrustIcon><Truck size={18} /></TrustIcon>
            <TrustText>
              <TrustTitle>Frete grátis</TrustTitle>
              <TrustSub>Compras acima de R$ 500</TrustSub>
            </TrustText>
          </TrustItem>
          <TrustItem>
            <TrustIcon><RefreshCw size={18} /></TrustIcon>
            <TrustText>
              <TrustTitle>Troca em 30 dias</TrustTitle>
              <TrustSub>Sem complicação</TrustSub>
            </TrustText>
          </TrustItem>
          <TrustItem>
            <TrustIcon><CreditCard size={18} /></TrustIcon>
            <TrustText>
              <TrustTitle>Pagamento seguro</TrustTitle>
              <TrustSub>Pix, cartão e boleto</TrustSub>
            </TrustText>
          </TrustItem>
        </TrustInner>
      </TrustStrip>

      {/* Categories strip */}
      <CatsSection>
        <CatsInner>
          <CatCard to="/produtos?gender=masculino">
            <User size={16} />
            <CatLabel>Masculino</CatLabel>
          </CatCard>
          <CatCard to="/produtos?gender=feminino">
            <Users size={16} />
            <CatLabel>Feminino</CatLabel>
          </CatCard>
          <CatCard to="/produtos?sortBy=newest">
            <Sparkles size={16} />
            <CatLabel>Novidades</CatLabel>
          </CatCard>
          <CatCard to="/produtos?discount=true">
            <Tag size={16} />
            <CatLabel>Promoções</CatLabel>
          </CatCard>
        </CatsInner>
      </CatsSection>

      {/* Brands marquee */}
      <BrandsSection>
        <BrandsLabel>Marcas disponíveis</BrandsLabel>
        <BrandsTrack>
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <BrandName key={i}>{b}</BrandName>
          ))}
        </BrandsTrack>
      </BrandsSection>

      {/* Featured products */}
      <Section>
        <SectionHeader>
          <SectionMeta>
            <SectionLabel>Seleção</SectionLabel>
            <SectionTitle>Em Destaque</SectionTitle>
          </SectionMeta>
          <SeeAll to="/produtos">
            Ver todos <ChevronRight size={14} />
          </SeeAll>
        </SectionHeader>
        <ProductGrid products={displayProducts} loading={loading} skeletonCount={8} />
      </Section>
    </>
  )
}
