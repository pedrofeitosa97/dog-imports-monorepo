import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, LogOut, User, Package, ChevronRight } from 'lucide-react'
import Button from '../../ui/Button/Button'
import Spinner from '../../ui/Spinner/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { useWishlist } from '../../hooks/useWishlist'
import { useCart } from '../../hooks/useCart'
import { orderService } from '../../services/orderService'
import { formatCurrency } from '../../utils/formatCurrency'
import type { Order } from '../../types/api'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} 8px`};

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[10]} clamp(16px, 5vw, 48px)`};
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
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

const ProfileCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[5]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.brand};
  flex-shrink: 0;
`

const ProfileName = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const ProfileEmail = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`

const QuickLinks = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const QuickCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover { border-color: ${({ theme }) => theme.colors.brand}; }
`

const QuickIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
`

const QuickTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const QuickSub = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 1px;
`

/* ── Orders section ──────────────────────────────────────────────────────── */

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

const OrderCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover { border-color: ${({ theme }) => theme.colors.brand}; }
`

const OrderIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
`

const OrderInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const OrderId = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const OrderMeta = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`

const OrderRight = styled.div`
  text-align: right;
  flex-shrink: 0;
`

const OrderTotal = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 10px;
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
  margin-top: 4px;
`

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  em_preparo: 'Em preparo',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

const EmptyOrders = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[8]} 0`};
`

const breadcrumb = [
  { label: 'Início', to: '/' },
  { label: 'Minha conta' },
]

export default function AccountPage() {
  const { user, logout } = useAuth()
  const { items: wishItems } = useWishlist()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    orderService.myOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false))
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumb} />
      <PageLabel>Minha conta</PageLabel>
      <Title>Olá, {user.name?.split(' ')[0] ?? 'Cliente'}</Title>

      <ProfileCard>
        <Avatar><User size={22} /></Avatar>
        <div style={{ flex: 1 }}>
          <ProfileName>{user.name ?? 'Cliente'}</ProfileName>
          <ProfileEmail>{user.email}</ProfileEmail>
        </div>
      </ProfileCard>

      <QuickLinks>
        <QuickCard to="/favoritos">
          <QuickIcon><Heart size={18} /></QuickIcon>
          <div>
            <QuickTitle>Favoritos</QuickTitle>
            <QuickSub>{wishItems.length} {wishItems.length === 1 ? 'item' : 'itens'}</QuickSub>
          </div>
        </QuickCard>
        <QuickCard to="/carrinho">
          <QuickIcon><ShoppingBag size={18} /></QuickIcon>
          <div>
            <QuickTitle>Carrinho</QuickTitle>
            <QuickSub>{totalItems} {totalItems === 1 ? 'item' : 'itens'}</QuickSub>
          </div>
        </QuickCard>
      </QuickLinks>

      {/* Orders */}
      <SectionTitle>Meus pedidos</SectionTitle>
      {ordersLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        <OrdersList>
          <EmptyOrders>Você ainda não fez nenhum pedido.</EmptyOrders>
        </OrdersList>
      ) : (
        <OrdersList>
          {orders.map((order) => (
            <OrderCard key={order.id} to={`/pedido-confirmado/${order.id}`}>
              <OrderIcon><Package size={18} /></OrderIcon>
              <OrderInfo>
                <OrderId>Pedido #{order.id.toString().padStart(5, '0')}</OrderId>
                <OrderMeta>
                  {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  {' · '}
                  {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                </OrderMeta>
              </OrderInfo>
              <OrderRight>
                <OrderTotal>{formatCurrency(Number(order.totalPrice))}</OrderTotal>
                <StatusBadge $status={order.status}>{STATUS_LABELS[order.status]}</StatusBadge>
              </OrderRight>
              <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
            </OrderCard>
          ))}
        </OrdersList>
      )}

      <Button variant="ghost" size="md" onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <LogOut size={16} /> Sair da conta
      </Button>
    </PageWrapper>
  )
}
