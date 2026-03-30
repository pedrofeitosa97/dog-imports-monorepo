import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Package, Tag, XCircle } from 'lucide-react'
import { productService } from '../../../services/productService'
import Spinner from '../../../ui/Spinner/Spinner'

const BORDER = 'rgba(255,255,255,0.07)'
const MUTED  = 'rgba(255,255,255,0.45)'

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px)  { grid-template-columns: 1fr; }
`

const Card = styled.div`
  background: #141416;
  border: 1px solid ${BORDER};
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
`

const Icon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $color }) => $color}22;
  border: 1px solid ${({ $color }) => $color}44;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`

const CardValue = styled.p`
  font-size: 26px;
  font-weight: 700;
  color: #f5f5f7;
  line-height: 1;
`

const CardLabel = styled.p`
  font-size: 12px;
  color: ${MUTED};
  margin-top: 3px;
  font-weight: 500;
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  padding: 80px;
`

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.getStats()
      .then(setStats)
      .catch(() => setStats({ totalProducts: 0, activeProducts: 0, outOfStock: 0, lowStock: 0, totalCategories: 0 }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Center><Spinner size="lg" color="#fff" /></Center>

  const cards = [
    { label: 'Total de Produtos', value: stats.totalProducts, icon: <Package size={20} />, color: '#60a5fa' },
    { label: 'Produtos Ativos',   value: stats.activeProducts, icon: <Package size={20} />, color: '#34d399' },
    { label: 'Categorias',        value: stats.totalCategories, icon: <Tag size={20} />, color: '#a78bfa' },
    { label: 'Estoque Esgotado',  value: stats.outOfStock, icon: <XCircle size={20} />, color: '#f87171' },
  ]

  return (
    <CardsGrid>
      {cards.map((c) => (
        <Card key={c.label}>
          <Icon $color={c.color}>{c.icon}</Icon>
          <div>
            <CardValue>{c.value}</CardValue>
            <CardLabel>{c.label}</CardLabel>
          </div>
        </Card>
      ))}
    </CardsGrid>
  )
}
