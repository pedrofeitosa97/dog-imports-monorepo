import styled from 'styled-components'
import { ShieldCheck, Star, Globe, Users } from 'lucide-react'

/* ── Layout ───────────────────────────────────────────────────────────────── */

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
  margin-bottom: 16px;
`

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 20px;
`

const HeroLead = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  max-width: 620px;
  margin-bottom: 56px;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 56px 0;
`

const StorySection = styled.section`
  margin-bottom: 56px;
`

const SectionLabel = styled.h2`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.brand};
  margin-bottom: 12px;
`

const SectionTitle = styled.h3`
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
`

const BodyText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.75;
  margin-bottom: 14px;

  &:last-child { margin-bottom: 0; }
`

const FriendsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const FriendCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FriendInitial = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandLight};
  color: ${({ theme }) => theme.colors.brand};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 4px;
`

const FriendName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const FriendRole = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.04em;
`

const PillarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`

const PillarCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const PillarIcon = styled.div`
  color: ${({ theme }) => theme.colors.brand};
`

const PillarTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const PillarText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`

const CtaStrip = styled.div`
  margin-top: 56px;
  background: ${({ theme }) => theme.colors.brand};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const CtaText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const CtaTitle = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.01em;
`

const CtaSub = styled.span`
  font-size: 13px;
  color: rgba(255,255,255,0.7);
`

const CtaBtn = styled.a`
  padding: 12px 28px;
  background: #fff;
  color: ${({ theme }) => theme.colors.brand};
  font-size: 13px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 140ms ease;

  &:hover { opacity: 0.9; }
`

/* ── Component ────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <Page>
      <HeroTag>Nossa história</HeroTag>
      <HeroTitle>Três amigos,<br />uma visão de bairro.</HeroTitle>
      <HeroLead>
        A Dog Imports nasceu de uma conversa simples entre três amigos que cresceram juntos
        e enxergaram uma oportunidade real: trazer roupas de grife importadas com autenticidade
        total para quem antes não tinha acesso.
      </HeroLead>

      <StorySection>
        <SectionLabel>Como tudo começou</SectionLabel>
        <SectionTitle>Do bairro para o mundo</SectionTitle>
        <BodyText>
          Tudo começou em 2023, quando Lucas, Rafael e Mateus — três amigos de infância do mesmo
          bairro em São Paulo — perceberam que marcas como Tommy Hilfiger, Ralph Lauren e Calvin Klein
          chegavam ao Brasil por caminhos pouco confiáveis. Produtos falsos circulavam livremente,
          e quem queria o original pagava absurdos em importações duvidosas.
        </BodyText>
        <BodyText>
          Com economia própria, muita pesquisa e uma rede de fornecedores internacionais construída
          ao longo de meses, eles decidiram resolver isso. Criaram a Dog Imports com um compromisso
          simples e inegociável: <strong style={{ color: 'inherit' }}>só produto 100% original ou não saiu daqui.</strong>
        </BodyText>
        <BodyText>
          Hoje atendemos clientes em todo o Brasil, mas o espírito é o mesmo de sempre — aquela
          honestidade de quem cresce junto, cuida do outro e faz questão de que cada peça que chega
          na sua porta seja exatamente o que você pagou.
        </BodyText>

        <FriendsGrid>
          {[
            { initial: 'L', name: 'Lucas', role: 'Fundador · Operações' },
            { initial: 'R', name: 'Rafael', role: 'Fundador · Importação' },
            { initial: 'M', name: 'Mateus', role: 'Fundador · Comercial' },
          ].map((f) => (
            <FriendCard key={f.name}>
              <FriendInitial>{f.initial}</FriendInitial>
              <FriendName>{f.name}</FriendName>
              <FriendRole>{f.role}</FriendRole>
            </FriendCard>
          ))}
        </FriendsGrid>
      </StorySection>

      <Divider />

      <StorySection>
        <SectionLabel>O que nos guia</SectionLabel>
        <SectionTitle>Nossos pilares</SectionTitle>

        <PillarsGrid>
          <PillarCard>
            <PillarIcon><ShieldCheck size={22} /></PillarIcon>
            <PillarTitle>Autenticidade absoluta</PillarTitle>
            <PillarText>
              Todo produto passa por verificação antes de sair. Nota fiscal, etiquetas e
              embalagens originais incluídas. Se tiver qualquer dúvida, devolvemos sem perguntas.
            </PillarText>
          </PillarCard>

          <PillarCard>
            <PillarIcon><Star size={22} /></PillarIcon>
            <PillarTitle>As melhores marcas</PillarTitle>
            <PillarText>
              Trabalhamos com as maiores grifes do mundo: Tommy Hilfiger, Ralph Lauren,
              Calvin Klein, Gucci, Burberry e muito mais. Curadoria constante para você.
            </PillarText>
          </PillarCard>

          <PillarCard>
            <PillarIcon><Globe size={22} /></PillarIcon>
            <PillarTitle>Importação direta</PillarTitle>
            <PillarText>
              Fornecedores homologados nos EUA e Europa. Sem intermediários desnecessários,
              mais qualidade por um preço mais justo.
            </PillarText>
          </PillarCard>

          <PillarCard>
            <PillarIcon><Users size={22} /></PillarIcon>
            <PillarTitle>Atendimento humano</PillarTitle>
            <PillarText>
              Somos um time pequeno que cuida de verdade. Você fala com pessoas reais que
              conhecem cada produto e se importam com a sua experiência.
            </PillarText>
          </PillarCard>
        </PillarsGrid>
      </StorySection>

      <CtaStrip>
        <CtaText>
          <CtaTitle>Pronto para conhecer a coleção?</CtaTitle>
          <CtaSub>Autenticidade garantida em cada peça.</CtaSub>
        </CtaText>
        <CtaBtn href="/produtos">Ver produtos</CtaBtn>
      </CtaStrip>
    </Page>
  )
}
