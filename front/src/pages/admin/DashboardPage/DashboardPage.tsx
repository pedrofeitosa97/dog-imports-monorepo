import styled from 'styled-components'
import { Package, Tag, ShoppingBag } from 'lucide-react'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const IconBox = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
`

const Value = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const Label = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const stats = [
  { label: 'Produtos', value: 42, color: '#4f9cf9', Icon: Package },
  { label: 'Categorias', value: 6, color: '#a78bfa', Icon: Tag },
  { label: 'Pedidos hoje', value: 3, color: '#34d399', Icon: ShoppingBag },
]

export default function DashboardPage() {
  return (
    <Grid>
      {stats.map(({ label, value, color, Icon }) => (
        <Card key={label}>
          <IconBox $color={color}><Icon size={20} /></IconBox>
          <Value>{value}</Value>
          <Label>{label}</Label>
        </Card>
      ))}
    </Grid>
  )
}
