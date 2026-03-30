import styled from 'styled-components'

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: box-shadow ${({ theme }) => theme.transitions.normal},
              transform ${({ theme }) => theme.transitions.normal},
              border-color ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderMedium};
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
    transform: scale(1.05);
  }
`

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.slow};
`

export const WishlistBtn = styled.button<{ $wishlisted?: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)'};
  border-radius: 50%;
  cursor: pointer;
  color: ${({ theme, $wishlisted }) => $wishlisted ? theme.colors.accentRed : theme.colors.textPrimary};
  transition: all ${({ theme }) => theme.transitions.fast};
  backdrop-filter: blur(4px);

  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(0,0,0,0.85)' : '#fff'};
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
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.brand};
  }
`

export const Brand = styled.a`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.weight.semibold};

  &:hover {
    color: ${({ theme }) => theme.colors.brand};
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
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const OriginalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`

export const DiscountBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.colors.accentGreen};
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(34,197,94,0.12)' : 'rgba(22,163,74,0.1)'};
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`

export const Stars = styled.span`
  font-size: 13px;
  line-height: 1;
`

export const ReviewCount = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`
