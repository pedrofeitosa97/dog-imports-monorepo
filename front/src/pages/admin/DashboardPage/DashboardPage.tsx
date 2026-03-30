import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Package, Tag, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productService } from '../../../services/productService'
import type { ProductStats } from '../../../types/api'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;

  @media (max-width: 640px) { gap: 20px; }
`

const Welcome = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

const WelcomeText = styled.div``

const WelcomeTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #f5f5f7;
  letter-spacing: -0.3px;
  margin: 0 0 4px;

  @media (max-width: 640px) { font-size: 17px; }
`

const WelcomeSub = styled.p`
  font-size: 13px;
  color: rgba(235,235,245,0.4);
  margin: 0;
`

const QuickLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #60a5fa;
  text-decoration: none;
  white-space: nowrap;
  &:hover { color: #93c5fd; }
`

/* ── Stat cards ───────────────────────────────────────────────────────── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
`

const Card = styled.div`
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (min-width: 900px) {
    padding: 24px 22px;
  }
`

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const IconBox = styled.div<{ $color: string }>`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color}1a;
  color: ${({ $color }) => $color};

  @media (min-width: 900px) {
    width: 42px;
    height: 42px;
  }
`

const CardBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Value = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: #f5f5f7;
  letter-spacing: -0.5px;
  line-height: 1;

  @media (min-width: 900px) { font-size: 30px; }
`

const Label = styled.div`
  font-size: 12px;
  color: rgba(235,235,245,0.4);
  letter-spacing: 0.1px;

  @media (min-width: 900px) { font-size: 13px; }
`

const Skeleton = styled.div`
  height: 30px;
  width: 50px;
  border-radius: 6px;
  background: rgba(255,255,255,0.07);
  animation: ${pulse} 1.4s ease-in-out infinite;
`

const ErrorBanner = styled.div`
  grid-column: 1 / -1;
  padding: 14px 18px;
  background: rgba(255,59,48,0.08);
  border: 1px solid rgba(255,59,48,0.18);
  border-radius: 10px;
  font-size: 13px;
  color: #ff453a;
`

/* ── Quick actions ────────────────────────────────────────────────────── */

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: rgba(235,235,245,0.35);
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin: 0;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ActionCard = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  text-decoration: none;
  color: rgba(235,235,245,0.7);
  font-size: 13px;
  font-weight: 500;
  transition: background 140ms, border-color 140ms, color 140ms;

  &:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.12);
    color: #f5f5f7;
  }
`

/* ── Data ─────────────────────────────────────────────────────────────── */

interface StatConfig {
  key: keyof ProductStats
  label: string
  color: string
  Icon: React.ElementType
}

const statConfigs: StatConfig[] = [
  { key: 'totalProducts',   label: 'Total de produtos', color: '#4f9cf9', Icon: Package },
  { key: 'activeProducts',  label: 'Produtos ativos',   color: '#34d399', Icon: CheckCircle },
  { key: 'totalCategories', label: 'Categorias',        color: '#a78bfa', Icon: Tag },
  { key: 'outOfStock',      label: 'Sem estoque',       color: '#f87171', Icon: AlertTriangle },
]

const quickActions = [
  { to: '/admin/produtos/novo', label: 'Novo produto' },
  { to: '/admin/produtos',      label: 'Ver produtos' },
  { to: '/admin/categorias',    label: 'Categorias' },
]

/* ── Component ─────────────────────────────────────────────────────────── */

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
    <Page>
      <Welcome>
        <WelcomeText>
          <WelcomeTitle>Visão geral</WelcomeTitle>
          <WelcomeSub>Resumo do seu catálogo</WelcomeSub>
        </WelcomeText>
        <QuickLink to="/admin/produtos/novo">
          Novo produto <ArrowRight size={14} />
        </QuickLink>
      </Welcome>

      <Grid>
        {error && <ErrorBanner>{error}</ErrorBanner>}
        {!error && statConfigs.map(({ key, label, color, Icon }) => (
          <Card key={key}>
            <CardTop>
              <IconBox $color={color}><Icon size={18} /></IconBox>
            </CardTop>
            <CardBottom>
              {loading ? <Skeleton /> : <Value>{stats?.[key] ?? 0}</Value>}
              <Label>{label}</Label>
            </CardBottom>
          </Card>
        ))}
      </Grid>

      <Section>
        <SectionTitle>Ações rápidas</SectionTitle>
        <Actions>
          {quickActions.map(({ to, label }) => (
            <ActionCard key={to} to={to}>
              {label}
              <ArrowRight size={14} />
            </ActionCard>
          ))}
        </Actions>
      </Section>
    </Page>
  )
}
