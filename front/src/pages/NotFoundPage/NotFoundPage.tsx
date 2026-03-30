import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};
  gap: ${({ theme }) => theme.spacing[4]};
`

const Code = styled.span`
  font-size: 96px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -4px;
  color: ${({ theme }) => theme.colors.brand};
  opacity: 0.18;

  @media (max-width: 480px) { font-size: 72px; }
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.size['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`

const Sub = styled.p`
  font-size: ${({ theme }) => theme.typography.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`

const BackBtn = styled(Link)`
  margin-top: ${({ theme }) => theme.spacing[2]};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  background: ${({ theme }) => theme.colors.brand};
  color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: 600;
  text-decoration: none;
  transition: opacity 140ms ease;

  &:hover { opacity: 0.85; }
`

export default function NotFoundPage() {
  return (
    <Wrapper>
      <Code>404</Code>
      <Title>Página não encontrada</Title>
      <Sub>O endereço que você acessou não existe ou foi movido.</Sub>
      <BackBtn to="/">Voltar para o início</BackBtn>
    </Wrapper>
  )
}
