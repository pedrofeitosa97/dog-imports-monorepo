import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Package, MapPin, CreditCard, ChevronLeft, MessageCircle, CheckCircle, Clock, Truck, Box, XCircle } from 'lucide-react'
import Button from '../../ui/Button/Button'
import Spinner from '../../ui/Spinner/Spinner'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import { orderService } from '../../services/orderService'
import { formatCurrency } from '../../utils/formatCurrency'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import type { Order } from '../../types/api'
import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ── Layout ──────────────────────────────────────────────────────────────── */

const PageWrapper = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} 8px`};
  animation: ${fadeUp} 350ms ease;

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[10]} clamp(16px, 5vw, 48px)`};
  }
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  transition: color 140ms;

  &:hover { color: ${({ theme }) => theme.colors.textPrimary}; }
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: ${({ theme }) => theme.spacing[7]};
  flex-wrap: wrap;
`

const HeaderLeft = styled.div``

const PageLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
`

const Title = styled.h1`
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 800;
  letter-spacing: -0.03em;
`

const OrderDate = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`

/* ── Status badge ────────────────────────────────────────────────────────── */

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  flex-shrink: 0;
  background: ${({ $status }) =>
    $status === 'entregue'   ? 'rgba(34,197,94,0.15)'  :
    $status === 'cancelado'  ? 'rgba(239,68,68,0.12)'  :
    $status === 'enviado'    ? 'rgba(59,130,246,0.15)' :
    $status === 'em_preparo' ? 'rgba(168,85,247,0.15)' :
    $status === 'confirmado' ? 'rgba(34,197,94,0.12)'  :
    'rgba(249,115,22,0.12)'};
  color: ${({ $status }) =>
    $status === 'entregue'   ? '#22c55e' :
    $status === 'cancelado'  ? '#ef4444' :
    $status === 'enviado'    ? '#3b82f6' :
    $status === 'em_preparo' ? '#a855f7' :
    $status === 'confirmado' ? '#4ade80' :
    '#f97316'};
`

/* ── Timeline ────────────────────────────────────────────────────────────── */

const TimelineCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[5]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const TimelineCardTitle = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
`

const TimelineItem = styled.div<{ $done: boolean; $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 15px;
    top: 30px;
    width: 2px;
    height: calc(100% - 8px);
    background: ${({ $done, theme }) => $done ? theme.colors.accentGreen : theme.colors.border};
  }
`

const TimelineDot = styled.div<{ $done: boolean; $active: boolean; $cancelled?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  background: ${({ $done, $active, $cancelled, theme }) =>
    $cancelled ? 'rgba(239,68,68,0.12)' :
    $done || $active ? theme.colors.accentGreen :
    theme.colors.surface};
  border: 2px solid ${({ $done, $active, $cancelled, theme }) =>
    $cancelled ? '#ef4444' :
    $done || $active ? theme.colors.accentGreen :
    theme.colors.border};
  color: ${({ $done, $active, $cancelled }) =>
    $cancelled ? '#ef4444' :
    $done || $active ? '#fff' :
    'rgba(255,255,255,0.2)'};
`

const TimelineContent = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing[5]};
  flex: 1;
`

const TimelineLabel = styled.p<{ $active: boolean; $done: boolean }>`
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? 700 : 600};
  color: ${({ $done, $active, theme }) =>
    $done || $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  padding-top: 6px;
`

const TimelineDesc = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`

const ActiveTag = styled.span`
  display: inline-flex;
  padding: 1px 7px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(249,115,22,0.15);
  color: #f97316;
  margin-left: 8px;
  vertical-align: middle;
`

/* ── Info cards ──────────────────────────────────────────────────────────── */

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`

const InfoCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[5]};
`

const InfoCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`

const InfoText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
`

/* ── Items ───────────────────────────────────────────────────────────────── */

const ItemsCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const ItemsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-of-type { border-bottom: none; }
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
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 15px;
  font-weight: 800;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

/* ── WhatsApp CTA ────────────────────────────────────────────────────────── */

const WhatsAppCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[5]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

const WhatsAppInfo = styled.div``

const WhatsAppTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 3px;
`

const WhatsAppDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const WhatsAppBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: #25d366;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 140ms;
  flex-shrink: 0;

  &:hover { opacity: 0.88; }
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
  { key: 'pendente',   label: 'Pedido recebido',  desc: 'Aguardando confirmação',          icon: <Clock size={14} /> },
  { key: 'confirmado', label: 'Confirmado',        desc: 'Pagamento aprovado',              icon: <CheckCircle size={14} /> },
  { key: 'em_preparo', label: 'Em preparo',        desc: 'Seu pedido está sendo separado',  icon: <Box size={14} /> },
  { key: 'enviado',    label: 'Enviado',            desc: 'A caminho do destino',            icon: <Truck size={14} /> },
  { key: 'entregue',   label: 'Entregue',           desc: 'Pedido recebido com sucesso',    icon: <CheckCircle size={14} /> },
]

const STATUS_ORDER = ['pendente', 'confirmado', 'em_preparo', 'enviado', 'entregue']

const breadcrumb = [
  { label: 'Início', to: '/' },
  { label: 'Minha conta', to: '/minha-conta' },
  { label: 'Pedido' },
]

/* ── Component ───────────────────────────────────────────────────────────── */

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { settings } = useSiteSettings()

  const whatsappNumber = settings.whatsapp_number || '5511999999999'

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
        <BackLink to="/minha-conta"><ChevronLeft size={14} /> Minha conta</BackLink>
        <Title>Pedido não encontrado</Title>
        <Button as={Link} to="/minha-conta" variant="primary" style={{ marginTop: 24 }}>Voltar</Button>
      </PageWrapper>
    )
  }

  const isCancelled = order.status === 'cancelado'
  const currentIdx = STATUS_ORDER.indexOf(order.status)

  const whatsappMsg = encodeURIComponent(
    `Olá! Gostaria de ajuda com o meu pedido #${order.id.toString().padStart(5, '0')} realizado em ${new Date(order.createdAt).toLocaleDateString('pt-BR')}.`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumb} />
      <BackLink to="/minha-conta"><ChevronLeft size={14} /> Minha conta</BackLink>

      <Header>
        <HeaderLeft>
          <PageLabel>Detalhes do pedido</PageLabel>
          <Title>Pedido #{order.id.toString().padStart(5, '0')}</Title>
          <OrderDate>
            {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            {' · '}
            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
          </OrderDate>
        </HeaderLeft>
        <StatusBadge $status={order.status}>
          {order.status === 'entregue'   && <CheckCircle size={11} />}
          {order.status === 'cancelado'  && <XCircle size={11} />}
          {order.status === 'enviado'    && <Truck size={11} />}
          {order.status === 'em_preparo' && <Box size={11} />}
          {order.status === 'pendente'   && <Clock size={11} />}
          {order.status === 'confirmado' && <CheckCircle size={11} />}
          {{
            pendente: 'Pendente', confirmado: 'Confirmado', em_preparo: 'Em preparo',
            enviado: 'Enviado', entregue: 'Entregue', cancelado: 'Cancelado',
          }[order.status] ?? order.status}
        </StatusBadge>
      </Header>

      {/* Timeline */}
      <TimelineCard>
        <TimelineCardTitle>Acompanhamento da entrega</TimelineCardTitle>
        <TimelineList>
          {isCancelled ? (
            <TimelineItem $done={false} $active={false}>
              <TimelineDot $done={false} $active={false} $cancelled>
                <XCircle size={14} />
              </TimelineDot>
              <TimelineContent>
                <TimelineLabel $done={false} $active style={{ color: '#ef4444' }}>Pedido cancelado</TimelineLabel>
                <TimelineDesc>Entre em contato para mais informações</TimelineDesc>
              </TimelineContent>
            </TimelineItem>
          ) : TIMELINE_STEPS.map((step, idx) => {
            const done   = idx < currentIdx
            const active = idx === currentIdx
            return (
              <TimelineItem key={step.key} $done={done} $active={active}>
                <TimelineDot $done={done} $active={active}>
                  {done ? <CheckCircle size={14} /> : step.icon}
                </TimelineDot>
                <TimelineContent>
                  <TimelineLabel $done={done} $active={active}>
                    {step.label}
                    {active && <ActiveTag>Agora</ActiveTag>}
                  </TimelineLabel>
                  <TimelineDesc>{step.desc}</TimelineDesc>
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </TimelineList>
      </TimelineCard>

      {/* Items */}
      <ItemsCard>
        <ItemsHeader>
          <Package size={13} /> Itens do pedido
        </ItemsHeader>
        {order.items.map((item) => (
          <ItemRow key={item.id}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ItemName>{item.productName}</ItemName>
              <ItemMeta>
                {item.productBrand}
                {item.size  ? ` · ${item.size}`  : ''}
                {item.color ? ` · ${item.color}` : ''}
                {` · Qtd: ${item.quantity}`}
              </ItemMeta>
            </div>
            <ItemPrice>{formatCurrency(Number(item.price) * item.quantity)}</ItemPrice>
          </ItemRow>
        ))}
        <TotalRow>
          <span>Total</span>
          <span>{formatCurrency(Number(order.totalPrice))}</span>
        </TotalRow>
      </ItemsCard>

      {/* Address + Payment */}
      <Grid>
        <InfoCard>
          <InfoCardTitle><MapPin size={13} /> Endereço de entrega</InfoCardTitle>
          <InfoText>{order.address}</InfoText>
        </InfoCard>
        <InfoCard>
          <InfoCardTitle><CreditCard size={13} /> Forma de pagamento</InfoCardTitle>
          <InfoText>{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</InfoText>
        </InfoCard>
      </Grid>

      {/* WhatsApp CTA */}
      <WhatsAppCard>
        <WhatsAppInfo>
          <WhatsAppTitle>Precisa de ajuda com este pedido?</WhatsAppTitle>
          <WhatsAppDesc>Fale com a gente pelo WhatsApp — respondemos rapidinho.</WhatsAppDesc>
        </WhatsAppInfo>
        <WhatsAppBtn href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={16} />
          Falar no WhatsApp
        </WhatsAppBtn>
      </WhatsAppCard>

      <Actions>
        <Button as={Link} to="/minha-conta" variant="ghost">
          <ChevronLeft size={15} style={{ marginRight: 4 }} /> Meus pedidos
        </Button>
        <Button as={Link} to="/produtos" variant="primary">Continuar comprando</Button>
      </Actions>
    </PageWrapper>
  )
}
