import styled from 'styled-components'

export const FooterWrapper = styled.footer`
  background: #080808;
  color: #f5f5f7;
  margin-top: auto;
  border-top: 1px solid rgba(255,255,255,0.06);
`

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[8]}`};
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[5]}`};
  }
`

export const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};

  img {
    height: 72px;
    width: 72px;
    object-fit: contain;
  }
`

export const FooterTagline = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(255,255,255,0.45);
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  max-width: 260px;
`

export const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`

export const FooterTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`

export const FooterLink = styled.a`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: #f97316;
  }
`

export const FooterBottom = styled.div`
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: ${({ theme }) => `${theme.spacing[5]} ${theme.spacing[8]}`};
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  }
`

export const Copyright = styled.p`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: rgba(255,255,255,0.3);
`

export const FooterAccent = styled.span`
  color: #f97316;
`
