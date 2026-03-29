import styled from 'styled-components'

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  overflow: hidden;
  transition: box-shadow ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

export const ImageWrapper = styled.a`
  position: relative;
  aspect-ratio: 3/4;
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
  display: block;
  text-decoration: none;

  &:hover img {
    transform: scale(1.04);
  }
`

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.slow};
`

export const WishlistBtn = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  cursor: pointer;
  color: ${({ theme, wishlisted }) => wishlisted ? theme.colors.accentRed : theme.colors.textPrimary};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    background: #fff;
    transform: scale(1.1);
  }
`

export const BadgeWrapper = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  left: ${({ theme }) => theme.spacing[3]};
`

export const Info = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`

export const Name = styled.a`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    text-decoration: underline;
  }
`

export const Brand = styled.a`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing[1]};
`

export const CurrentPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const OriginalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`

export const DiscountBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.accentGreen};
`

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`

export const Stars = styled.span`
  font-size: 14px;
  line-height: 1;
`

export const ReviewCount = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`
