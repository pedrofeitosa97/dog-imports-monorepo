import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../../../hooks/useWishlist'
import Badge from '../../../ui/Badge/Badge'
import { formatCurrency } from '../../../utils/formatCurrency'
import {
  Card,
  ImageWrapper,
  ProductImage,
  WishlistBtn,
  BadgeWrapper,
  Info,
  Brand,
  Name,
  PriceRow,
  CurrentPrice,
  OriginalPrice,
  DiscountBadge,
  RatingRow,
  Stars,
  ReviewCount,
} from './ProductCard.styles'

export default function ProductCard({ id, slug, name, brand, category, price, originalPrice, discountPct, rating, reviewCount, images = [], badge }) {
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(id)
  const discount = discountPct || (originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0)

  return (
    <Card>
      <ImageWrapper as={Link} to={`/produtos/${slug}`}>
        <ProductImage
          src={images[0] || '/placeholder.jpg'}
          alt={name}
          loading="lazy"
        />
        {badge && (
          <BadgeWrapper>
            <Badge variant="dark" size="sm">{badge}</Badge>
          </BadgeWrapper>
        )}
        <WishlistBtn
          onClick={(e) => { e.preventDefault(); toggle(id) }}
          wishlisted={wishlisted}
          aria-label={wishlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
        </WishlistBtn>
      </ImageWrapper>

      <Info>
        <Name as={Link} to={`/produtos/${slug}`}>{name}</Name>
        <Brand as={Link} to={`/marcas/${brand?.toLowerCase()}`}>{brand}</Brand>

        <PriceRow>
          <CurrentPrice>{formatCurrency(price)}</CurrentPrice>
          {originalPrice && originalPrice > price && (
            <>
              <OriginalPrice>{formatCurrency(originalPrice)}</OriginalPrice>
              <DiscountBadge>{discount}% off</DiscountBadge>
            </>
          )}
        </PriceRow>

        {rating > 0 && (
          <RatingRow>
            <Stars>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < Math.round(rating) ? '#F5A623' : '#E5E5E5' }}>★</span>
              ))}
            </Stars>
            {reviewCount > 0 && <ReviewCount>({reviewCount})</ReviewCount>}
          </RatingRow>
        )}
      </Info>
    </Card>
  )
}
