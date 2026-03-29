import styled from 'styled-components'

export const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.textPrimary};
  color: ${({ theme }) => theme.colors.textInverse};
  margin-top: auto;
`

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => `${theme.spacing[12]} ${theme.spacing[8]}`};
  max-width: 1440px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

export const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`

export const FooterTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`

export const FooterLink = styled.a`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: #fff;
  }
`

export const FooterBottom = styled.div`
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
  max-width: 1440px;
  margin: 0 auto;
`

export const Copyright = styled.p`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: rgba(255,255,255,0.4);
`
