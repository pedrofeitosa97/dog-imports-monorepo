import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, MapPin, CreditCard, Clock } from 'lucide-react'
import Button from '../../ui/Button/Button'
import Spinner from '../../ui/Spinner/Spinner'
import { orderService } from '../../services/orderService'
import { formatCurrency } from '../../utils/formatCurrency'
import type { Order } from '../../types/api'
import styled, { keyframes } from 'styled-components'

/* ── Animations ──────────────────────────────────────────────────────────── */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ── Layout ──────────────────────────────────────────────────────────────── */

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

const StatusNote = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-top: -${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

/* ── Timeline ────────────────────────────────────────────────────────────── */

const TimelineWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const TimelineTitle = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const TimelineItem = styled.div<{ $done: boolean; $active: boolean; $cancelled: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 13px;
    top: 28px;
    width: 2px;
    height: calc(100% - 4px);
    background: ${({ $done, $cancelled, theme }) =>
      $cancelled ? 'rgba(239,68,68,0.3)' :
      $done ? theme.colors.accentGreen :
      theme.colors.border};
  }
`

const TimelineDot = styled.div<{ $done: boolean; $active: boolean; $cancelled: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  position: relative;
  z-index: 1;
  background: ${({ $done, $active, $cancelled, theme }) =>
    $cancelled ? 'rgba(239,68,68,0.15)' :
    $done || $active ? theme.colors.accentGreen :
    theme.colors.surface};
  border: 2px solid ${({ $done, $active, $cancelled, theme }) =>
    $cancelled ? '#ef4444' :
    $done || $active ? theme.colors.accentGreen :
    theme.colors.border};
  color: ${({ $done, $active, $cancelled }) =>
    $cancelled ? '#ef4444' :
    $done || $active ? '#fff' :
    'transparent'};
`

const TimelineContent = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing[5]};
  flex: 1;
`

const TimelineLabel = styled.p<{ $done: boolean; $active: boolean }>`
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? 700 : 600};
  color: ${({ $done, $active, theme }) =>
    $done || $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  line-height: 1.4;
  padding-top: 4px;
`

const TimelineDesc = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`

const ActiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(249,115,22,0.12);
  color: #f97316;
  margin-left: 8px;
`

/* ── Order card ──────────────────────────────────────────────────────────── */

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

/* ── Data ────────────────────────────────────────────────────────────────── */

const PAYMENT_LABELS: Record<string, string> = {
  pix: 'PIX',
  cartao: 'Cartão de crédito',
  boleto: 'Boleto bancário',
}

const TIMELINE_STEPS = [
  { key: 'pendente',   label: 'Pedido recebido',   desc: 'Aguardando confirmação' },
  { key: 'confirmado', label: 'Pedido confirmado',  desc: 'Pagamento aprovado' },
  { key: 'em_preparo', label: 'Em preparo',         desc: 'Seu pedido está sendo separado' },
  { key: 'enviado',    label: 'Enviado',             desc: 'A caminho do destino' },
  { key: 'entregue',   label: 'Entregue',            desc: 'Pedido recebido com sucesso' },
]

const STATUS_ORDER = ['pendente', 'confirmado', 'em_preparo', 'enviado', 'entregue']

function getStepState(stepKey: string, currentStatus: string) {
  if (currentStatus === 'cancelado') {
    return { done: false, active: false, cancelled: true }
  }
  const currentIdx = STATUS_ORDER.indexOf(currentStatus)
  const stepIdx = STATUS_ORDER.indexOf(stepKey)
  return {
    done: stepIdx < currentIdx,
    active: stepIdx === currentIdx,
    cancelled: false,
  }
}

/* ── Component ───────────────────────────────────────────────────────────── */

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
        <Title>Pedido realizado!</Title>
        <Subtitle>Seu pedido #{id} foi recebido com sucesso. Você receberá atualizações por e-mail.</Subtitle>
        <Actions>
          <Button as={Link} to="/produtos" variant="primary">Continuar comprando</Button>
          <Button as={Link} to="/minha-conta" variant="ghost">Minha conta</Button>
        </Actions>
      </PageWrapper>
    )
  }

  const isCancelled = order.status === 'cancelado'

  return (
    <PageWrapper>
      <SuccessIcon><CheckCircle size={56} strokeWidth={1.5} /></SuccessIcon>
      <Label>Obrigado pela compra</Label>
      <Title>Pedido realizado!</Title>
      <Subtitle>
        Olá, {order.customerName.split(' ')[0]}! Seu pedido foi recebido e está sendo processado.
        Acompanhe o status abaixo.
      </Subtitle>
      <StatusNote>
        <Clock size={13} />
        Aguarde atualização de status — atualizamos em tempo real
      </StatusNote>

      {/* Timeline */}
      <TimelineWrapper>
        <TimelineTitle>Acompanhamento do pedido</TimelineTitle>
        <TimelineList>
          {isCancelled ? (
            <TimelineItem $done={false} $active={false} $cancelled>
              <TimelineDot $done={false} $active={false} $cancelled>✕</TimelineDot>
              <TimelineContent>
                <TimelineLabel $done={false} $active style={{ color: '#ef4444' }}>
                  Pedido cancelado
                </TimelineLabel>
                <TimelineDesc>Entre em contato para mais informações</TimelineDesc>
              </TimelineContent>
            </TimelineItem>
          ) : (
            TIMELINE_STEPS.map((step) => {
              const { done, active, cancelled } = getStepState(step.key, order.status)
              return (
                <TimelineItem key={step.key} $done={done} $active={active} $cancelled={cancelled}>
                  <TimelineDot $done={done} $active={active} $cancelled={cancelled}>
                    {done ? '✓' : active ? '●' : ''}
                  </TimelineDot>
                  <TimelineContent>
                    <TimelineLabel $done={done} $active={active}>
                      {step.label}
                      {active && <ActiveBadge>Atual</ActiveBadge>}
                    </TimelineLabel>
                    <TimelineDesc>{step.desc}</TimelineDesc>
                  </TimelineContent>
                </TimelineItem>
              )
            })
          )}
        </TimelineList>
      </TimelineWrapper>

      {/* Order details */}
      <OrderCard>
        <CardSection>
          <CardSectionTitle><Package size={14} /> Número do pedido</CardSectionTitle>
          <OrderId>#{order.id.toString().padStart(5, '0')}</OrderId>
          <OrderMeta>
            {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </OrderMeta>
        </CardSection>

        <CardSection>
          <CardSectionTitle>Itens do pedido</CardSectionTitle>
          <ItemsList>
            {order.items.map((item) => (
              <Item key={item.id}>
                <div>
                  <ItemName>{item.productName}</ItemName>
                  <ItemMeta>
                    {item.productBrand}
                    {item.size ? ` · ${item.size}` : ''}
                    {item.color ? ` · ${item.color}` : ''}
                    {` × ${item.quantity}`}
                  </ItemMeta>
                </div>
                <ItemPrice>{formatCurrency(Number(item.price) * item.quantity)}</ItemPrice>
              </Item>
            ))}
          </ItemsList>
          <TotalRow>
            <span>Total</span>
            <span>{formatCurrency(Number(order.totalPrice))}</span>
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
