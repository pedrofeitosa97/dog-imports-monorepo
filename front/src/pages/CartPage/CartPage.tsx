import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import CartItem from '../../features/cart/CartItem/CartItem'
import Button from '../../ui/Button/Button'
import { useCart } from '../../hooks/useCart'
import { formatCurrency } from '../../utils/formatCurrency'
import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} 8px`};

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[8]} clamp(16px, 5vw, 48px)`};
  }
`

const PageLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`

const Title = styled.h1`
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  align-items: baseline;
  gap: 8px;
`

const CartCount = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSecondary};
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  position: sticky;
  top: 100px;
`

const SummaryTitle = styled.h3`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0;
`

const CouponRow = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 4px;
`

const CouponInput = styled.input`
  flex: 1;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand};
  }
`

const CouponBtn = styled.button`
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: 11px;
  font-family: inherit;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  white-space: nowrap;
  transition: border-color ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.brand};
  }
`

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[4]}`};
  gap: ${({ theme }) => theme.spacing[4]};
`

const EmptyLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const EmptyTitle = styled.h2`
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const EmptyBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 320px;
  line-height: 1.65;
`

export default function CartPage() {
  const { items, totalPrice, totalItems } = useCart()
  const [couponCode, setCouponCode] = useState('')

  if (items.length === 0) {
    return (
      <PageWrapper>
        <EmptyWrapper>
          <ShoppingBag size={48} strokeWidth={1} color="currentColor" style={{ opacity: 0.3 }} />
          <EmptyLabel>Carrinho vazio</EmptyLabel>
          <EmptyTitle>Sua sacola está vazia</EmptyTitle>
          <EmptyBody>Explore nosso catálogo e descubra produtos importados com autenticidade garantida.</EmptyBody>
          <Button as={Link} to="/produtos" variant="primary" size="lg">Explorar catálogo</Button>
        </EmptyWrapper>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <PageLabel>Compras</PageLabel>
      <Title>
        Minha sacola <CartCount>({totalItems})</CartCount>
      </Title>

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
          <Divider />
          <CouponRow>
            <CouponInput
              placeholder="Código de desconto"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <CouponBtn type="button">Aplicar</CouponBtn>
          </CouponRow>
          <Divider />
          <SummaryRow $total>
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </SummaryRow>
          <Button as={Link} to="/checkout" variant="primary" size="lg" fullWidth>Finalizar pedido</Button>
          <Button as={Link} to="/produtos" variant="ghost" size="md" fullWidth>Continuar comprando</Button>
        </Summary>
      </Layout>
    </PageWrapper>
  )
}
