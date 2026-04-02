import { useState, useEffect } from 'react'
import { orderService } from '../../../services/orderService'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { Order, OrderStatus } from '../../../types/api'
import styled from 'styled-components'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const TopRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #f5f5f7;
  letter-spacing: -0.01em;
`

const PageSub = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.45);
  margin-top: 3px;
`

const Table = styled.div`
  background: #141416;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  overflow: hidden;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 140px 120px 160px 140px;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.07);

  @media (max-width: 1024px) {
    grid-template-columns: 70px 1fr 120px 120px;
  }
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 140px 120px 160px 140px;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  align-items: center;
  transition: background 140ms;

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(255,255,255,0.025); }

  @media (max-width: 1024px) {
    grid-template-columns: 70px 1fr 120px 120px;
  }
`

const ColHead = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
`

const OrderNum = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #f97316;
`

const CustomerName = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #f5f5f7;
`

const CustomerEmail = styled.p`
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  margin-top: 2px;
`

const DateText = styled.span`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
`

const TotalText = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #f5f5f7;
`

const HideOnMobile = styled.span`
  @media (max-width: 1024px) { display: none; }
`

const StatusSelect = styled.select<{ $status: string }>`
  background: ${({ $status }) =>
    $status === 'entregue' ? 'rgba(34,197,94,0.12)' :
    $status === 'cancelado' ? 'rgba(239,68,68,0.12)' :
    $status === 'enviado' ? 'rgba(59,130,246,0.12)' :
    'rgba(249,115,22,0.1)'};
  color: ${({ $status }) =>
    $status === 'entregue' ? '#22c55e' :
    $status === 'cancelado' ? '#ef4444' :
    $status === 'enviado' ? '#60a5fa' :
    '#f97316'};
  border: 1px solid ${({ $status }) =>
    $status === 'entregue' ? 'rgba(34,197,94,0.25)' :
    $status === 'cancelado' ? 'rgba(239,68,68,0.25)' :
    $status === 'enviado' ? 'rgba(59,130,246,0.25)' :
    'rgba(249,115,22,0.25)'};
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.04em;
  cursor: pointer;
  outline: none;
  width: 100%;

  option {
    background: #141416;
    color: #f5f5f7;
  }
`

const ItemsCount = styled.span`
  font-size: 11px;
  color: rgba(255,255,255,0.4);
`

const EmptyRow = styled.div`
  padding: 48px 20px;
  text-align: center;
  color: rgba(255,255,255,0.3);
  font-size: 13px;
`

const LoadingRow = styled.div`
  padding: 48px 20px;
  text-align: center;
  color: rgba(255,255,255,0.3);
  font-size: 13px;
`

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'em_preparo', label: 'Em preparo' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    orderService.adminList(1, 50)
      .then((res) => {
        setOrders(res.data)
        setTotal(res.total)
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      const updated = await orderService.updateStatus(orderId, status)
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: updated.status } : o))
    } catch {
      // silently fail — user can retry
    }
  }

  return (
    <Page>
      <TopRow>
        <div>
          <PageTitle>Pedidos</PageTitle>
          <PageSub>{total} pedido{total !== 1 ? 's' : ''} no total</PageSub>
        </div>
      </TopRow>

      <Table>
        <TableHeader>
          <ColHead>Pedido</ColHead>
          <ColHead>Cliente</ColHead>
          <ColHead>Data</ColHead>
          <ColHead>Total</ColHead>
          <HideOnMobile as={ColHead}>Itens</HideOnMobile>
          <ColHead>Status</ColHead>
        </TableHeader>

        {loading ? (
          <LoadingRow>Carregando pedidos...</LoadingRow>
        ) : orders.length === 0 ? (
          <EmptyRow>Nenhum pedido ainda.</EmptyRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <OrderNum>#{order.id.toString().padStart(5, '0')}</OrderNum>
              <div>
                <CustomerName>{order.customerName}</CustomerName>
                <CustomerEmail>{order.customerEmail}</CustomerEmail>
              </div>
              <DateText>
                {new Date(order.createdAt).toLocaleDateString('pt-BR')}
              </DateText>
              <TotalText>{formatCurrency(Number(order.totalPrice))}</TotalText>
              <HideOnMobile>
                <ItemsCount>
                  {order.items?.length ?? 0} {(order.items?.length ?? 0) === 1 ? 'item' : 'itens'}
                </ItemsCount>
              </HideOnMobile>
              <StatusSelect
                $status={order.status}
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </StatusSelect>
            </TableRow>
          ))
        )}
      </Table>
    </Page>
  )
}
