import styled from 'styled-components'
import { RefreshCw, Clock, PackageCheck, Phone } from 'lucide-react'

/* ── Layout ───────────────────────────────────────────────────────────────── */

const Page = styled.div`
  max-width: 800px;
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
  margin-bottom: 16px;
`

const HeroTitle = styled.h1`
  font-size: clamp(1.8rem, 4.5vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
`

const HeroLead = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin-bottom: 48px;
`

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 56px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const QuickCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const QuickIcon = styled.div`
  color: ${({ theme }) => theme.colors.brand};
`

const QuickValue = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
`

const QuickLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`

const Section = styled.section`
  margin-bottom: 48px;
`

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const BodyText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.75;
  margin-bottom: 12px;

  &:last-child { margin-bottom: 0; }
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ListItem = styled.li`
  display: flex;
  gap: 10px;
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;

  &::before {
    content: '—';
    color: ${({ theme }) => theme.colors.brand};
    font-weight: 700;
    flex-shrink: 0;
  }
`

const Highlight = styled.div`
  background: ${({ theme }) => theme.colors.brandLight};
  border-left: 3px solid ${({ theme }) => theme.colors.brand};
  border-radius: 0 ${({ theme }) => theme.borderRadius.sm} ${({ theme }) => theme.borderRadius.sm} 0;
  padding: 16px 20px;
  margin: 20px 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 48px 0;
`

const ContactCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ContactTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const ContactLine = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`

const ContactLink = styled.a`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.brand};
  font-weight: 600;
  text-decoration: none;

  &:hover { opacity: 0.75; }
`

/* ── Component ────────────────────────────────────────────────────────────── */

export default function ReturnPolicyPage() {
  return (
    <Page>
      <HeroTag>Política de trocas e devoluções</HeroTag>
      <HeroTitle>Sem complicação,<br />sem burocracia.</HeroTitle>
      <HeroLead>
        A sua satisfação é inegociável para nós. Se algo não ficou certo, estamos aqui para resolver.
      </HeroLead>

      <QuickGrid>
        <QuickCard>
          <QuickIcon><Clock size={18} /></QuickIcon>
          <QuickValue>30 dias</QuickValue>
          <QuickLabel>Prazo para solicitar troca ou devolução</QuickLabel>
        </QuickCard>
        <QuickCard>
          <QuickIcon><RefreshCw size={18} /></QuickIcon>
          <QuickValue>Grátis</QuickValue>
          <QuickLabel>Frete de retorno em caso de defeito</QuickLabel>
        </QuickCard>
        <QuickCard>
          <QuickIcon><PackageCheck size={18} /></QuickIcon>
          <QuickValue>100%</QuickValue>
          <QuickLabel>Reembolso garantido por defeito de fabricação</QuickLabel>
        </QuickCard>
        <QuickCard>
          <QuickIcon><Phone size={18} /></QuickIcon>
          <QuickValue>24h</QuickValue>
          <QuickLabel>Tempo máximo de resposta ao seu pedido</QuickLabel>
        </QuickCard>
      </QuickGrid>

      <Section>
        <SectionTitle>Troca por tamanho ou modelo</SectionTitle>
        <BodyText>
          Você pode solicitar a troca por tamanho ou modelo diferente em até <strong>30 dias corridos</strong> a
          partir da data de recebimento do pedido.
        </BodyText>
        <List>
          <ListItem>O produto deve estar sem uso, com etiquetas originais e na embalagem original.</ListItem>
          <ListItem>O frete de retorno é por conta do cliente, exceto quando o erro for nosso.</ListItem>
          <ListItem>Após a chegada e conferência do item, enviamos o novo no prazo de até 5 dias úteis.</ListItem>
          <ListItem>A troca está sujeita à disponibilidade de estoque do item desejado.</ListItem>
        </List>
        <Highlight>
          Dica: confira sempre a nossa Tabela de Tamanhos antes de finalizar o pedido para evitar a necessidade de troca.
        </Highlight>
      </Section>

      <Section>
        <SectionTitle>Devolução por defeito ou divergência</SectionTitle>
        <BodyText>
          Se você recebeu um produto com defeito de fabricação, danificado no transporte ou diferente
          do anunciado, cubrimos todo o processo sem custo algum para você.
        </BodyText>
        <List>
          <ListItem>Prazo: até 30 dias corridos após o recebimento.</ListItem>
          <ListItem>O frete de retorno é por nossa conta — enviamos a etiqueta por e-mail.</ListItem>
          <ListItem>Após conferência, você escolhe entre reembolso integral ou reenvio do item correto.</ListItem>
          <ListItem>Reembolsos via Pix são processados em até 3 dias úteis. Cartão de crédito pode levar até 2 faturas.</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>O que não é coberto</SectionTitle>
        <List>
          <ListItem>Produtos com sinais de uso, lavagem ou alterações.</ListItem>
          <ListItem>Danos causados por mau uso ou armazenamento inadequado.</ListItem>
          <ListItem>Solicitações fora do prazo de 30 dias.</ListItem>
          <ListItem>Produtos sem etiqueta ou embalagem original (exceto em caso de defeito visível).</ListItem>
        </List>
        <BodyText style={{ marginTop: 16 }}>
          Caso tenha dúvida se a sua situação é coberta, entre em contato — analisamos caso a caso
          com bom senso e transparência.
        </BodyText>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Garantia de autenticidade</SectionTitle>
        <BodyText>
          Todos os produtos Dog Imports são 100% originais, adquiridos diretamente de fornecedores
          homologados nos EUA e Europa. Em caso de questionamento sobre autenticidade, realizamos a
          verificação e, se confirmada qualquer irregularidade, efetuamos o reembolso integral
          sem necessidade de devolução do item.
        </BodyText>
      </Section>

      <Divider />

      <ContactCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <RefreshCw size={18} color="var(--color-brand, #f97316)" />
          <ContactTitle>Precisa iniciar uma troca?</ContactTitle>
        </div>
        <ContactLine>
          Fale com a gente pelo WhatsApp ou e-mail. Respondemos em até 24 horas úteis.
        </ContactLine>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <ContactLink href="mailto:trocas@dogimports.com.br">trocas@dogimports.com.br</ContactLink>
          <ContactLine>ou pelo WhatsApp no rodapé da página</ContactLine>
        </div>
      </ContactCard>
    </Page>
  )
}
