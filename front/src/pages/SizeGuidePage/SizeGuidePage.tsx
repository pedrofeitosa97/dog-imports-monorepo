import { useState } from 'react'
import styled from 'styled-components'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'

/* ── Layout ─────────────────────────────────────────────────────────────── */

const Page = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 64px clamp(20px, 5vw, 48px) 96px;
`

const HeroTag = styled.span`
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.brand};
  margin-bottom: 12px;
`

const HeroTitle = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 12px;
`

const HeroSub = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 48px;
`

/* ── Tabs ────────────────────────────────────────────────────────────────── */

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 36px;
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, $active }) => $active ? theme.colors.brand : theme.colors.textSecondary};
  border-bottom: 2px solid ${({ theme, $active }) => $active ? theme.colors.brand : 'transparent'};
  margin-bottom: -1px;
  cursor: pointer;
  transition: all 160ms ease;

  &:hover { color: ${({ theme }) => theme.colors.textPrimary}; }
`

/* ── How-to measure ─────────────────────────────────────────────────────── */

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`

const MeasureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`

const MeasureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: 20px 18px;
`

const MeasureLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.brand};
  margin-bottom: 6px;
`

const MeasureDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`

/* ── Table ──────────────────────────────────────────────────────────────── */

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`

const Th = styled.th`
  padding: 12px 16px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;

  &:first-child { text-align: left; }
`

const Td = styled.td<{ $highlight?: boolean }>`
  padding: 12px 16px;
  text-align: center;
  color: ${({ theme, $highlight }) => $highlight ? theme.colors.brand : theme.colors.textPrimary};
  font-weight: ${({ $highlight }) => $highlight ? '700' : '400'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:first-child { text-align: left; font-weight: 600; }

  tr:last-child & { border-bottom: none; }
`

const Tr = styled.tr`
  transition: background 120ms;
  &:hover { background: ${({ theme }) => theme.colors.surface}; }
`

/* ── Tip ─────────────────────────────────────────────────────────────────── */

const Tip = styled.div`
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.brand}12;
  border-left: 3px solid ${({ theme }) => theme.colors.brand};
  border-radius: 0 ${({ theme }) => theme.borderRadius.base} ${({ theme }) => theme.borderRadius.base} 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;

  strong { color: ${({ theme }) => theme.colors.textPrimary}; }
`

/* ── Data ────────────────────────────────────────────────────────────────── */

const NORMAL_SIZES = [
  { size: 'PP', chest: '86–90', shoulder: '42', length: '66', sleeve: '20' },
  { size: 'P',  chest: '90–96', shoulder: '44', length: '68', sleeve: '21' },
  { size: 'M',  chest: '96–102', shoulder: '46', length: '70', sleeve: '22' },
  { size: 'G',  chest: '102–108', shoulder: '48', length: '72', sleeve: '23' },
  { size: 'GG', chest: '108–116', shoulder: '50', length: '74', sleeve: '24' },
  { size: 'XGG', chest: '116–124', shoulder: '52', length: '76', sleeve: '25' },
]

const OVERSIZED_SIZES = [
  { size: 'P',   chest: '106–112', shoulder: '52', length: '74', sleeve: '25' },
  { size: 'M',   chest: '112–118', shoulder: '54', length: '77', sleeve: '26' },
  { size: 'G',   chest: '118–126', shoulder: '57', length: '80', sleeve: '27' },
  { size: 'GG',  chest: '126–134', shoulder: '60', length: '83', sleeve: '28' },
  { size: 'XGG', chest: '134–144', shoulder: '63', length: '86', sleeve: '29' },
]

const breadcrumb = [
  { label: 'Início', to: '/' },
  { label: 'Guia de tamanhos' },
]

type TabType = 'normal' | 'oversized'

export default function SizeGuidePage() {
  const [tab, setTab] = useState<TabType>('normal')

  const rows = tab === 'normal' ? NORMAL_SIZES : OVERSIZED_SIZES

  return (
    <Page>
      <Breadcrumb items={breadcrumb} />

      <div style={{ marginTop: 24, marginBottom: 48 }}>
        <HeroTag>Medidas & Tamanhos</HeroTag>
        <HeroTitle>Guia de tamanhos</HeroTitle>
        <HeroSub>
          Todas as medidas são em centímetros e referem-se às dimensões da peça, não do corpo.
          Para maior precisão, meça uma camiseta que já te cabe bem.
        </HeroSub>
      </div>

      <Section>
        {/* How to measure */}
        <div>
          <SectionTitle>Como medir corretamente</SectionTitle>
          <MeasureGrid style={{ marginTop: 16 }}>
            <MeasureCard>
              <MeasureLabel>Largura (Tórax)</MeasureLabel>
              <MeasureDesc>Meça de uma axila à outra pela parte frontal da camiseta, com a peça esticada sobre uma superfície plana. Multiplique por 2 para obter o tórax completo.</MeasureDesc>
            </MeasureCard>
            <MeasureCard>
              <MeasureLabel>Ombro</MeasureLabel>
              <MeasureDesc>Meça de uma costura de ombro à outra, passando pela parte superior das costas da peça.</MeasureDesc>
            </MeasureCard>
            <MeasureCard>
              <MeasureLabel>Comprimento</MeasureLabel>
              <MeasureDesc>Meça do ponto mais alto do ombro (próximo ao pescoço) até a barra inferior da peça.</MeasureDesc>
            </MeasureCard>
            <MeasureCard>
              <MeasureLabel>Manga</MeasureLabel>
              <MeasureDesc>Meça da costura do ombro até a barra da manga, com a manga esticada horizontalmente.</MeasureDesc>
            </MeasureCard>
          </MeasureGrid>
        </div>

        {/* Size table */}
        <div>
          <SectionTitle>Tabela de medidas</SectionTitle>
          <Tabs style={{ marginTop: 16 }}>
            <Tab $active={tab === 'normal'} onClick={() => setTab('normal')}>
              Camiseta Normal
            </Tab>
            <Tab $active={tab === 'oversized'} onClick={() => setTab('oversized')}>
              Camiseta Oversized
            </Tab>
          </Tabs>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Tamanho</Th>
                  <Th>Tórax (cm)</Th>
                  <Th>Ombro (cm)</Th>
                  <Th>Comprimento (cm)</Th>
                  <Th>Manga (cm)</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <Tr key={row.size}>
                    <Td $highlight>{row.size}</Td>
                    <Td>{row.chest}</Td>
                    <Td>{row.shoulder}</Td>
                    <Td>{row.length}</Td>
                    <Td>{row.sleeve}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </div>

        {/* Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tab === 'normal' ? (
            <Tip>
              <strong>Fit normal:</strong> caimento regular, sem folga excessiva. Se você está entre dois tamanhos, recomendamos o maior para mais conforto.
            </Tip>
          ) : (
            <Tip>
              <strong>Fit oversized:</strong> caimento amplo intencional — ombros caídos, corpo largo e comprimento maior. Se você usa M em camisetas normais, o P oversized já vai te dar o efeito largo. Para um oversized mais extremo, suba um tamanho.
            </Tip>
          )}
          <Tip>
            <strong>Dica de importados:</strong> peças americanas e europeias costumam ser maiores que o padrão brasileiro. Nossas medidas já foram ajustadas para refletir as dimensões reais de cada peça do nosso catálogo.
          </Tip>
        </div>
      </Section>
    </Page>
  )
}
