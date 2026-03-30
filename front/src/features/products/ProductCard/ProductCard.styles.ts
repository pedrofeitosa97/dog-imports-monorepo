import styled from 'styled-components'

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  overflow: hidden;
  transition: transform 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-3px);
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

  @media (max-width: 479px) {
    aspect-ratio: 2/3;
  }

  &:hover img {
    transform: scale(1.04);
    transition: transform 420ms ease;
  }
`

export const WishlistBtn = styled.button<{ $wishlisted?: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;

  @media (max-width: 479px) {
    width: 34px;
    height: 34px;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.88)'};
  border-radius: 50%;
  cursor: pointer;
  color: ${({ theme, $wishlisted }) => $wishlisted ? theme.colors.accentRed : theme.colors.textSecondary};
  transition: all 140ms ease;
  backdrop-filter: blur(6px);

  &:hover {
    color: ${({ theme }) => theme.colors.accentRed};
    transform: scale(1.1);
  }
`

export const BadgeWrapper = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
`

export const Info = styled.div`
  padding: 10px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 479px) {
    padding: 7px 8px 10px;
    gap: 1px;
  }
`

export const Brand = styled.a`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  font-weight: 600;

  &:hover { color: ${({ theme }) => theme.colors.brand}; }
`

export const Name = styled.a`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 1px;
  transition: color 140ms ease;

  &:hover { color: ${({ theme }) => theme.colors.brand}; }
`

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 5px;

  @media (max-width: 479px) {
    margin-top: 3px;
  }
`

export const CurrentPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const OriginalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textDisabled};
  text-decoration: line-through;
`

export const DiscountBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentGreen};
`

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 3px;
`

export const Stars = styled.span`
  font-size: 11px;
  line-height: 1;
`

export const ReviewCount = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
