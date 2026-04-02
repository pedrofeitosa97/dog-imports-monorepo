import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Minus, Plus } from 'lucide-react'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import ImageGallery from '../../features/products/ImageGallery/ImageGallery'
import SizeSelector from '../../features/products/SizeSelector/SizeSelector'
import ColorSwatch from '../../features/products/ColorSwatch/ColorSwatch'
import ProductGrid from '../../features/products/ProductGrid/ProductGrid'
import Accordion from '../../ui/Accordion/Accordion'
import Button from '../../ui/Button/Button'
import Badge from '../../ui/Badge/Badge'
import Spinner from '../../ui/Spinner/Spinner'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { productService } from '../../services/productService'
import { formatCurrency } from '../../utils/formatCurrency'
import type { Product } from '../../types/api'
import styled from 'styled-components'

/* ── Layout ──────────────────────────────────────────────────────────────── */

const PageWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[6]} 8px`};

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[8]} clamp(16px, 5vw, 64px)`};
  }
`

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[10]};
  margin-top: ${({ theme }) => theme.spacing[6]};

  @media (min-width: 768px) {
    grid-template-columns: 55fr 45fr;
    gap: ${({ theme }) => theme.spacing[12]};
    align-items: start;
  }
`

/* ── Info column ─────────────────────────────────────────────────────────── */

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`

const BrandLink = styled(Link)`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover { color: ${({ theme }) => theme.colors.brand}; }
`

const ProductName = styled.h1`
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 4px;
`

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Stars = styled.span`
  font-size: 14px;
  line-height: 1;
  letter-spacing: 2px;
`

const ReviewCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ── Price ───────────────────────────────────────────────────────────────── */

const PriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`

const Price = styled.span`
  font-size: clamp(1.4rem, 2.5vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const OldPrice = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`

const PriceMeta = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.03em;
`

/* ── Size guide link ─────────────────────────────────────────────────────── */

const SizeGuideLink = styled(Link)`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: underline;
  text-underline-offset: 3px;
  align-self: flex-start;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover { color: ${({ theme }) => theme.colors.brand}; }
`

/* ── Quantity ────────────────────────────────────────────────────────────── */

const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const QuantityLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  overflow: hidden;
`

const QtyBtn = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

const QtyDisplay = styled.span`
  width: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  line-height: 36px;
`

/* ── Actions ─────────────────────────────────────────────────────────────── */

const ActionsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`

const WishBtn = styled.button<{ $wishlisted: boolean }>`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  cursor: pointer;
  color: ${({ $wishlisted, theme }) => $wishlisted ? theme.colors.accentRed : theme.colors.textPrimary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentRed};
    color: ${({ theme }) => theme.colors.accentRed};
  }
`

/* ── Accordions ──────────────────────────────────────────────────────────── */

const AccordionSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const AccordionText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.75;
`

const PolicyLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand};
  text-decoration: none;
  font-weight: 600;

  &:hover { text-decoration: underline; }
`

/* ── Related products ────────────────────────────────────────────────────── */

const RelatedSection = styled.section`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing[12]} 0`};
  margin-top: ${({ theme }) => theme.spacing[8]};
`

const RelatedLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`

const RelatedTitle = styled.h2`
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`

const NotFound = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[20]};
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ── Mock ────────────────────────────────────────────────────────────────── */

const mockProduct: Product = {
  id: 1,
  slug: 'produto-1',
  name: 'Camiseta Tommy Hilfiger Original',
  brand: 'Tommy Hilfiger',
  price: 299,
  originalPrice: 399,
  description: 'Camiseta 100% algodão importada diretamente dos EUA. Autenticidade garantida com certificado de origem. Modelagem regular fit com logo bordado no peito.',
  images: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
  ],
  sizes: [
    { label: 'PP', available: true, name: 'PP' },
    { label: 'P', available: true, name: 'P' },
    { label: 'M', available: true, name: 'M' },
    { label: 'G', available: false, name: 'G' },
    { label: 'GG', available: true, name: 'GG' },
  ],
  colors: [
    { name: 'Branco', hex: '#FFFFFF', available: true },
    { name: 'Preto', hex: '#111111', available: true },
    { name: 'Azul Marinho', hex: '#1E3A5F', available: false },
  ],
  rating: 4.5,
  reviewCount: 120,
  stock: 10,
  isActive: true,
  isFeatured: true,
  badge: undefined,
}

/* ── Component ───────────────────────────────────────────────────────────── */

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { addItem, openCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setQuantity(1)
    productService.getBySlug(slug)
      .then(setProduct)
      .catch(() => setProduct(mockProduct))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!product) return
    productService.getAll({ brands: [product.brand], limit: 5 })
      .then((res) => {
        const items = Array.isArray(res) ? res : (res.data ?? [])
        setRelatedProducts(items.filter((p: Product) => p.id !== product.id).slice(0, 4))
      })
      .catch(() => {})
  }, [product])

  if (loading) return <Center><Spinner size="lg" /></Center>
  if (!product) return <NotFound>Produto não encontrado.</NotFound>

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor)
    openCart()
  }

  const wishlisted = isWishlisted(product.id)
  const rating = product.rating ?? 0

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#F5A623' : 'rgba(255,255,255,0.18)' }}>★</span>
    ))

  return (
    <PageWrapper>
      <Breadcrumb items={[
        { label: 'Início', to: '/' },
        { label: product.brand, to: `/marcas/${product.brand.toLowerCase()}` },
        { label: product.name },
      ]} />

      <Layout>
        <ImageGallery images={product.images} />

        <InfoCol>
          <div>
            <BrandLink to={`/produtos?brands=${encodeURIComponent(product.brand)}`}>{product.brand}</BrandLink>
            <ProductName>{product.name}</ProductName>
            {rating > 0 && (
              <RatingRow>
                <Stars>{renderStars(rating)}</Stars>
                {(product.reviewCount ?? 0) > 0 && (
                  <ReviewCount>({product.reviewCount} avaliações)</ReviewCount>
                )}
              </RatingRow>
            )}
          </div>

          <PriceBlock>
            <PriceRow>
              <Price>{formatCurrency(product.price)}</Price>
              {product.originalPrice && <OldPrice>{formatCurrency(product.originalPrice)}</OldPrice>}
              {discount > 0 && <Badge variant="green">{discount}% off</Badge>}
            </PriceRow>
            <PriceMeta>Ou em até 12x no cartão</PriceMeta>
          </PriceBlock>

          {(product.colors?.length ?? 0) > 0 && (
            <ColorSwatch colors={product.colors!} selected={selectedColor} onChange={setSelectedColor} />
          )}

          {(product.sizes?.length ?? 0) > 0 && (
            <>
              <SizeSelector
                sizes={product.sizes!.map((s) => ({ label: s.label ?? s.name ?? '', available: s.available ?? true }))}
                selected={selectedSize}
                onChange={setSelectedSize}
              />
              <SizeGuideLink to="/guia-de-tamanhos">Guia de tamanhos</SizeGuideLink>
            </>
          )}

          <QuantityRow>
            <QuantityLabel>Quantidade</QuantityLabel>
            <QtyControl>
              <QtyBtn onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir">
                <Minus size={14} />
              </QtyBtn>
              <QtyDisplay>{quantity}</QtyDisplay>
              <QtyBtn onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar">
                <Plus size={14} />
              </QtyBtn>
            </QtyControl>
          </QuantityRow>

          <ActionsRow>
            <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
              Adicionar ao carrinho
            </Button>
            <WishBtn onClick={() => toggle(product.id)} $wishlisted={wishlisted} aria-label={wishlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
              <Heart size={22} fill={wishlisted ? 'currentColor' : 'none'} />
            </WishBtn>
          </ActionsRow>

          <AccordionSection>
            {product.description && (
              <Accordion title="Descrição" defaultOpen>
                <AccordionText>{product.description}</AccordionText>
              </Accordion>
            )}
            <Accordion title="Envio e entrega">
              <AccordionText>
                Entrega estimada em 7 a 15 dias úteis após confirmação do pagamento. Frete grátis em compras acima de R$ 500. Rastreamento disponível após despacho.
              </AccordionText>
            </Accordion>
            <Accordion title="Trocas e devoluções">
              <AccordionText>
                Trocas aceitas em até 30 dias após o recebimento. Produto deve estar sem uso e com etiqueta original.{' '}
                <PolicyLink to="/politica-de-trocas">Ver política completa</PolicyLink>
              </AccordionText>
            </Accordion>
          </AccordionSection>
        </InfoCol>
      </Layout>

      {relatedProducts.length > 0 && (
        <RelatedSection>
          <RelatedLabel>Você também pode gostar</RelatedLabel>
          <RelatedTitle>Da mesma marca</RelatedTitle>
          <ProductGrid products={relatedProducts} skeletonCount={4} />
        </RelatedSection>
      )}
    </PageWrapper>
  )
}
