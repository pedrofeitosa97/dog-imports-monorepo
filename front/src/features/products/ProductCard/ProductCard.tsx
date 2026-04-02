import { type MouseEvent } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../../../hooks/useWishlist'
import Badge from '../../../ui/Badge/Badge'
import LazyImage from '../../../ui/LazyImage/LazyImage'
import { formatCurrency } from '../../../utils/formatCurrency'
import { getImageUrl } from '../../../utils/getImageUrl'
import {
  Card, ImageWrapper, WishlistBtn, BadgeWrapper,
  Info, Brand, Name, PriceRow, CurrentPrice, OriginalPrice,
  DiscountBadge, RatingRow, Stars, ReviewCount, LowStock,
} from './ProductCard.styles'

interface ProductCardProps {
  id: number
  slug: string
  name: string
  brand: string
  price: number
  originalPrice?: number | null
  discountPct?: number
  rating?: number
  reviewCount?: number
  images?: string[]
  badge?: string | null
  stock?: number
}

export default function ProductCard({
  id, slug, name, brand, price, originalPrice, discountPct,
  rating, reviewCount, images = [], badge, stock,
}: ProductCardProps) {
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(id)
  const discount = discountPct || (originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0)

  return (
    <Card>
      <ImageWrapper as={Link} to={`/produtos/${slug}`}>
        <LazyImage
          src={getImageUrl(images[0]) || '/placeholder.jpg'}
          alt={name}
        />
        {badge && (
          <BadgeWrapper>
            <Badge variant="dark" size="sm">{badge}</Badge>
          </BadgeWrapper>
        )}
        <WishlistBtn
          onClick={(e: MouseEvent) => { e.preventDefault(); toggle(id) }}
          $wishlisted={wishlisted}
          aria-label={wishlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
        </WishlistBtn>
      </ImageWrapper>

      <Info>
        <Brand as={Link} to={`/marcas/${brand?.toLowerCase()}`}>{brand}</Brand>
        <Name as={Link} to={`/produtos/${slug}`}>{name}</Name>

        <PriceRow>
          <CurrentPrice>{formatCurrency(price)}</CurrentPrice>
          {originalPrice && originalPrice > price && (
            <>
              <OriginalPrice>{formatCurrency(originalPrice)}</OriginalPrice>
              <DiscountBadge>{discount}% off</DiscountBadge>
            </>
          )}
        </PriceRow>

        {(rating ?? 0) > 0 && (
          <RatingRow>
            <Stars>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < Math.round(rating ?? 0) ? '#F5A623' : '#E5E5E5' }}>★</span>
              ))}
            </Stars>
            {(reviewCount ?? 0) > 0 && <ReviewCount>({reviewCount})</ReviewCount>}
          </RatingRow>
        )}
        {stock !== undefined && stock > 0 && stock <= 5 && (
          <LowStock>Restam apenas {stock} {stock === 1 ? 'unidade' : 'unidades'}</LowStock>
        )}
      </Info>
    </Card>
  )
}
