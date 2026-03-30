import { Link } from 'react-router-dom'
import CartItem from '../../features/cart/CartItem/CartItem'
import Button from '../../ui/Button/Button'
import { useCart } from '../../hooks/useCart'
import { formatCurrency } from '../../utils/formatCurrency'
import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[8]}`};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.size['2xl']};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[8]};
  align-items: start;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 340px;
  }
`

const Summary = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  position: sticky;
  top: 100px;
`

const SummaryTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const SummaryRow = styled.div<{ $total?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: ${({ $total, theme }) => $total ? theme.typography.size.md : theme.typography.size.sm};
  color: ${({ $total, theme }) => $total ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${({ $total, theme }) => $total ? theme.typography.weight.bold : theme.typography.weight.regular};
`

const EmptyCart = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]};

  h2 { margin-bottom: ${({ theme }) => theme.spacing[4]}; }
  p { color: ${({ theme }) => theme.colors.textSecondary}; margin-bottom: ${({ theme }) => theme.spacing[6]}; }
`

export default function CartPage() {
  const { items, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <PageWrapper>
        <EmptyCart>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione produtos para continuar comprando.</p>
          <Button as={Link} to="/produtos" variant="primary" size="lg">Ver produtos</Button>
        </EmptyCart>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Title>Carrinho ({totalItems})</Title>
      <Layout>
        <div>
          {items.map((item, idx) => <CartItem key={idx} item={item} />)}
        </div>

        <Summary>
          <SummaryTitle>Resumo do pedido</SummaryTitle>
          <SummaryRow>
            <span>Subtotal</span>
            <span>{formatCurrency(totalPrice)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Frete</span>
            <span>Calcular</span>
          </SummaryRow>
          <SummaryRow $total>
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </SummaryRow>
          <Button variant="primary" size="lg" fullWidth>Finalizar pedido</Button>
          <Button as={Link} to="/produtos" variant="ghost" size="md" fullWidth>Continuar comprando</Button>
        </Summary>
      </Layout>
    </PageWrapper>
  )
}
