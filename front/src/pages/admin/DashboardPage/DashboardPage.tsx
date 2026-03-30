import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Package, Tag, CheckCircle, AlertTriangle } from 'lucide-react'
import { productService } from '../../../services/productService'
import type { ProductStats } from '../../../types/api'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`

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

const Skeleton = styled.div`
  height: 28px;
  width: 60px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.border};
  animation: ${pulse} 1.4s ease-in-out infinite;
`

const ErrorMsg = styled.p`
  color: #ff453a;
  font-size: 13px;
  margin: 0;
`

interface StatConfig {
  key: keyof ProductStats
  label: string
  color: string
  Icon: React.ElementType
}

const statConfigs: StatConfig[] = [
  { key: 'totalProducts',   label: 'Produtos',        color: '#4f9cf9', Icon: Package },
  { key: 'activeProducts',  label: 'Ativos',          color: '#34d399', Icon: CheckCircle },
  { key: 'totalCategories', label: 'Categorias',      color: '#a78bfa', Icon: Tag },
  { key: 'outOfStock',      label: 'Sem estoque',     color: '#f87171', Icon: AlertTriangle },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<ProductStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    productService.getStats()
      .then(setStats)
      .catch(() => setError('Não foi possível carregar as estatísticas.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Grid>
      {statConfigs.map(({ key, label, color, Icon }) => (
        <Card key={key}>
          <IconBox $color={color}><Icon size={20} /></IconBox>
          {loading
            ? <Skeleton />
            : error
              ? <ErrorMsg>{error}</ErrorMsg>
              : <Value>{stats?.[key] ?? 0}</Value>
          }
          <Label>{label}</Label>
        </Card>
      ))}
    </Grid>
  )
}
