import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react'
import Button from '../../ui/Button/Button'
import Spinner from '../../ui/Spinner/Spinner'
import { orderService } from '../../services/orderService'
import { formatCurrency } from '../../utils/formatCurrency'
import type { Order } from '../../types/api'
import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const PageWrapper = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} 8px`};
  animation: ${fadeUp} 400ms ease;

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[12]} clamp(16px, 5vw, 48px)`};
  }
`

const SuccessIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.accentGreen};
`

const Label = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 6px;
`

const Title = styled.h1`
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 1.65;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

const OrderCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const CardSection = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child { border-bottom: none; }
`

const CardSectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`

const OrderId = styled.p`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.brand};
`

const OrderMeta = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${({ $status }) =>
    $status === 'entregue' ? 'rgba(34,197,94,0.15)' :
    $status === 'cancelado' ? 'rgba(239,68,68,0.12)' :
    $status === 'enviado' ? 'rgba(59,130,246,0.15)' :
    'rgba(249,115,22,0.12)'};
  color: ${({ $status }) =>
    $status === 'entregue' ? '#22c55e' :
    $status === 'cancelado' ? '#ef4444' :
    $status === 'enviado' ? '#3b82f6' :
    '#f97316'};
`

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  em_preparo: 'Em preparo',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`

const ItemLeft = styled.div``

const ItemName = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const ItemMeta = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`

const ItemPrice = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing[3]};
  font-weight: 700;
  font-size: 15px;
`

const InfoText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.65;
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`

const PAYMENT_LABELS: Record<string, string> = {
  pix: 'PIX',
  cartao: 'Cartão de crédito',
  boleto: 'Boleto bancário',
}

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    orderService.myOrder(Number(id))
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Center><Spinner size="lg" /></Center>

  if (!order) {
    return (
      <PageWrapper>
        <Label>Pedido</Label>
        <Title>Pedido confirmado!</Title>
        <Subtitle>Seu pedido #{id} foi recebido com sucesso. Você receberá atualizações por e-mail.</Subtitle>
        <Actions>
          <Button as={Link} to="/produtos" variant="primary">Continuar comprando</Button>
          <Button as={Link} to="/minha-conta" variant="ghost">Minha conta</Button>
        </Actions>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <SuccessIcon><CheckCircle size={56} strokeWidth={1.5} /></SuccessIcon>
      <Label>Pedido recebido</Label>
      <Title>Pedido confirmado!</Title>
      <Subtitle>
        Obrigado, {order.customerName.split(' ')[0]}! Seu pedido foi recebido e está sendo processado.
        Você receberá atualizações no e-mail {order.customerEmail}.
      </Subtitle>

      <OrderCard>
        <CardSection>
          <CardSectionTitle><Package size={14} /> Número do pedido</CardSectionTitle>
          <OrderId>#{order.id.toString().padStart(5, '0')}</OrderId>
          <OrderMeta>
            {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            {' · '}
            <StatusBadge $status={order.status}>{STATUS_LABELS[order.status] ?? order.status}</StatusBadge>
          </OrderMeta>
        </CardSection>

        <CardSection>
          <CardSectionTitle>Itens do pedido</CardSectionTitle>
          <ItemsList>
            {order.items.map((item) => (
              <Item key={item.id}>
                <ItemLeft>
                  <ItemName>{item.productName}</ItemName>
                  <ItemMeta>
                    {item.productBrand}
                    {item.size ? ` · ${item.size}` : ''}
                    {item.color ? ` · ${item.color}` : ''}
                    {` × ${item.quantity}`}
                  </ItemMeta>
                </ItemLeft>
                <ItemPrice>{formatCurrency(item.price * item.quantity)}</ItemPrice>
              </Item>
            ))}
          </ItemsList>
          <TotalRow>
            <span>Total</span>
            <span>{formatCurrency(order.totalPrice)}</span>
          </TotalRow>
        </CardSection>

        <CardSection>
          <CardSectionTitle><MapPin size={14} /> Endereço de entrega</CardSectionTitle>
          <InfoText>{order.address}</InfoText>
        </CardSection>

        <CardSection>
          <CardSectionTitle><CreditCard size={14} /> Pagamento</CardSectionTitle>
          <InfoText>{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</InfoText>
        </CardSection>
      </OrderCard>

      <Actions>
        <Button as={Link} to="/produtos" variant="primary">Continuar comprando</Button>
        <Button as={Link} to="/minha-conta" variant="ghost">Ver meus pedidos</Button>
      </Actions>
    </PageWrapper>
  )
}
