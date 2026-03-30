import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Package, Tag, CheckCircle, AlertTriangle, ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productService } from '../../../services/productService'
import { getImageUrl } from '../../../utils/getImageUrl'
import LazyImage from '../../../ui/LazyImage/LazyImage'
import type { ProductStats, Product } from '../../../types/api'

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

/* ── Recent products ─────────────────────────────────────────────────── */

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: rgba(235,235,245,0.35);
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin: 0;
`

const SectionLink = styled(Link)`
  font-size: 12px;
  color: rgba(235,235,245,0.4);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover { color: #60a5fa; }
`

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  border-radius: 12px;
  overflow: hidden;
`

const ProductRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.03);
  text-decoration: none;
  transition: background 130ms;

  &:hover { background: rgba(255,255,255,0.06); }

  @media (max-width: 480px) { padding: 10px 12px; gap: 10px; }
`

const ProductImgWrapper = styled.div`
  width: 64px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255,255,255,0.07);

  img { width: 100%; height: 100%; object-fit: cover; }

  @media (max-width: 480px) {
    width: 56px;
    height: 70px;
  }
`

const ProductImgPlaceholder = styled.div`
  width: 64px;
  height: 80px;
  border-radius: 8px;
  background: rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgba(255,255,255,0.2);

  @media (max-width: 480px) {
    width: 56px;
    height: 70px;
  }
`

const ProductInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ProductName = styled.p`
  font-size: 13.5px;
  font-weight: 500;
  color: #f5f5f7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 2px;
`

const ProductMeta = styled.p`
  font-size: 12px;
  color: rgba(235,235,245,0.35);
  margin: 0;
`

const ProductPrice = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: rgba(235,235,245,0.7);
  flex-shrink: 0;
`

const EmptyRow = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: rgba(235,235,245,0.25);
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
`

const NewProductBtn = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  background: rgba(249,115,22,0.12);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #f97316;
  text-decoration: none;
  transition: background 140ms;
  &:hover { background: rgba(249,115,22,0.2); }
`

const formatPrice = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

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

/* ── Component ─────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const [stats, setStats] = useState<ProductStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')

  const [recent, setRecent] = useState<Product[]>([])
  const [recentLoading, setRecentLoading] = useState(true)

  useEffect(() => {
    productService.getStats()
      .then(setStats)
      .catch(() => setStatsError('Não foi possível carregar as estatísticas.'))
      .finally(() => setStatsLoading(false))

    productService.getAll({ showAll: true, limit: 5, sortBy: 'newest' })
      .then((res) => {
        const arr = Array.isArray(res) ? res : (res.data ?? [])
        setRecent(arr)
      })
      .catch(() => setRecent([]))
      .finally(() => setRecentLoading(false))
  }, [])

  return (
    <Page>
      <Welcome>
        <WelcomeText>
          <WelcomeTitle>Visão geral</WelcomeTitle>
          <WelcomeSub>Resumo do seu catálogo</WelcomeSub>
        </WelcomeText>
        <NewProductBtn to="/admin/produtos/novo">
          <Plus size={14} /> Novo produto
        </NewProductBtn>
      </Welcome>

      <Grid>
        {statsError && <ErrorBanner>{statsError}</ErrorBanner>}
        {!statsError && statConfigs.map(({ key, label, color, Icon }) => (
          <Card key={key}>
            <CardTop>
              <IconBox $color={color}><Icon size={18} /></IconBox>
            </CardTop>
            <CardBottom>
              {statsLoading ? <Skeleton /> : <Value>{stats?.[key] ?? 0}</Value>}
              <Label>{label}</Label>
            </CardBottom>
          </Card>
        ))}
      </Grid>

      <Section>
        <SectionHeader>
          <SectionTitle>Produtos recentes</SectionTitle>
          <SectionLink to="/admin/produtos">
            Ver todos <ArrowRight size={12} />
          </SectionLink>
        </SectionHeader>

        <ProductList>
          {recentLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ProductRow key={i} to="#">
                  <ProductImgPlaceholder><Package size={16} /></ProductImgPlaceholder>
                  <ProductInfo>
                    <Skeleton style={{ width: '60%', height: '14px', marginBottom: 4 }} />
                    <Skeleton style={{ width: '35%', height: '12px' }} />
                  </ProductInfo>
                </ProductRow>
              ))
            : recent.length === 0
              ? <EmptyRow>Nenhum produto cadastrado ainda.</EmptyRow>
              : recent.map((p) => {
                  const img = getImageUrl(p.images?.[0])
                  return (
                    <ProductRow key={p.id} to={`/admin/produtos/${p.id}/editar`}>
                      {img
                        ? <ProductImgWrapper><LazyImage src={img} alt={p.name} /></ProductImgWrapper>
                        : <ProductImgPlaceholder><Package size={16} /></ProductImgPlaceholder>
                      }
                      <ProductInfo>
                        <ProductName>{p.name}</ProductName>
                        <ProductMeta>{p.brand}</ProductMeta>
                      </ProductInfo>
                      <ProductPrice>{formatPrice(p.price)}</ProductPrice>
                    </ProductRow>
                  )
                })
          }
        </ProductList>
      </Section>
    </Page>
  )
}
