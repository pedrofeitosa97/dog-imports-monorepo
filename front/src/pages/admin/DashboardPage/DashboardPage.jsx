import styled from 'styled-components'
import { Package, Tag, TrendingUp, ShoppingBag } from 'lucide-react'

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #fff;
`

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.adminSidebar};
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.adminAccent};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
`

const CardInfo = styled.div``

const CardValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
`

const CardLabel = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  margin-top: 4px;
`

const stats = [
  { label: 'Produtos', value: '48', icon: <Package size={22} /> },
  { label: 'Categorias', value: '12', icon: <Tag size={22} /> },
  { label: 'Vendas (mês)', value: 'R$ 24.850', icon: <TrendingUp size={22} /> },
  { label: 'Pedidos', value: '137', icon: <ShoppingBag size={22} /> },
]

export default function DashboardPage() {
  return (
    <>
      <Title>Dashboard</Title>
      <CardsGrid>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardIcon>{stat.icon}</CardIcon>
            <CardInfo>
              <CardValue>{stat.value}</CardValue>
              <CardLabel>{stat.label}</CardLabel>
            </CardInfo>
          </Card>
        ))}
      </CardsGrid>
    </>
  )
}
