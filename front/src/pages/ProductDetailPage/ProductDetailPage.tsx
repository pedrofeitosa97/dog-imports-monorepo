import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import ImageGallery from '../../features/products/ImageGallery/ImageGallery'
import SizeSelector from '../../features/products/SizeSelector/SizeSelector'
import ColorSwatch from '../../features/products/ColorSwatch/ColorSwatch'
import Button from '../../ui/Button/Button'
import Badge from '../../ui/Badge/Badge'
import Spinner from '../../ui/Spinner/Spinner'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { productService } from '../../services/productService'
import { formatCurrency } from '../../utils/formatCurrency'
import type { Product } from '../../types/api'
import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[8]}`};
`

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[12]};
  margin-top: ${({ theme }) => theme.spacing[6]};

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`

const BrandLink = styled.a`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`

const ProductName = styled.h1`
  font-size: ${({ theme }) => theme.typography.size['2xl']};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`

const Price = styled.span`
  font-size: ${({ theme }) => theme.typography.size['2xl']};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`

const OldPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`

const ActionsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`

const WishBtn = styled.button<{ $wishlisted: boolean }>`
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  cursor: pointer;
  color: ${({ $wishlisted, theme }) => $wishlisted ? theme.colors.accentRed : theme.colors.textPrimary};
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { border-color: ${({ theme }) => theme.colors.textPrimary}; }
`

const Description = styled.div`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.loose};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing[4]};
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`

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

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { addItem, openCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    productService.getBySlug(slug)
      .then(setProduct)
      .catch(() => setProduct(mockProduct))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Center><Spinner size="lg" /></Center>
  if (!product) return <Center>Produto não encontrado.</Center>

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    addItem(product, 1, selectedSize, selectedColor)
    openCart()
  }

  const wishlisted = isWishlisted(product.id)

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
            <BrandLink href={`/marcas/${product.brand.toLowerCase()}`}>{product.brand}</BrandLink>
            <ProductName>{product.name}</ProductName>
          </div>

          <PriceRow>
            <Price>{formatCurrency(product.price)}</Price>
            {product.originalPrice && <OldPrice>{formatCurrency(product.originalPrice)}</OldPrice>}
            {discount > 0 && <Badge variant="green">{discount}% off</Badge>}
          </PriceRow>

          {(product.colors?.length ?? 0) > 0 && (
            <ColorSwatch colors={product.colors!} selected={selectedColor} onChange={setSelectedColor} />
          )}

          {(product.sizes?.length ?? 0) > 0 && (
            <SizeSelector
              sizes={product.sizes!.map((s) => ({ label: s.label ?? s.name ?? '', available: s.available }))}
              selected={selectedSize}
              onChange={setSelectedSize}
            />
          )}

          <ActionsRow>
            <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
              Adicionar ao carrinho
            </Button>
            <WishBtn onClick={() => toggle(product.id)} $wishlisted={wishlisted}>
              <Heart size={22} fill={wishlisted ? 'currentColor' : 'none'} />
            </WishBtn>
          </ActionsRow>

          <Description>{product.description}</Description>
        </InfoCol>
      </Layout>
    </PageWrapper>
  )
}
