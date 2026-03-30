import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '../../../hooks/useAuth'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ── Layout ─────────────────────────────────────────────────────────── */

const Page = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0a0a0a;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Helvetica Neue', sans-serif;
`

/* Left panel — branding */
const Panel = styled.aside`
  display: none;

  @media (min-width: 900px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 46%;
    flex-shrink: 0;
    background: #0d0d0d;
    border-right: 1px solid rgba(255,255,255,0.06);
    padding: 48px 56px;
    position: relative;
    overflow: hidden;
  }
`

const PanelGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 65%);
  top: 50%;
  left: 50%;
  transform: translate(-60%, -50%);
  pointer-events: none;
`

const PanelGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
`

const PanelLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
`

const PanelLogoIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PanelLogoName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #f5f5f7;
  letter-spacing: -0.3px;
`

const PanelCenter = styled.div`
  position: relative;
  z-index: 1;
`

const PanelHeadline = styled.h2`
  font-size: 34px;
  font-weight: 700;
  color: #f5f5f7;
  letter-spacing: -0.8px;
  line-height: 1.18;
  margin: 0 0 16px;
`

const PanelSub = styled.p`
  font-size: 15px;
  color: rgba(235,235,245,0.45);
  line-height: 1.6;
  letter-spacing: -0.1px;
  max-width: 320px;
`

const PanelFooter = styled.p`
  position: relative;
  z-index: 1;
  font-size: 12px;
  color: rgba(235,235,245,0.2);
  letter-spacing: 0.2px;
`

/* Right panel — form */
const FormSide = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
`

const FormWrap = styled.div`
  width: 100%;
  max-width: 360px;
  animation: ${fadeIn} 0.45s cubic-bezier(.22,.68,0,1.1) both;
`

const FormHeader = styled.div`
  margin-bottom: 36px;

  @media (min-width: 900px) { margin-bottom: 40px; }
`

/* Mobile-only logo */
const MobileLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;

  @media (min-width: 900px) { display: none; }
`

const MobileLogoIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MobileLogoName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #f5f5f7;
  letter-spacing: -0.3px;
`

const FormTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #f5f5f7;
  letter-spacing: -0.5px;
  margin: 0 0 6px;
`

const FormSubtitle = styled.p`
  font-size: 14px;
  color: rgba(235,235,245,0.4);
  letter-spacing: -0.1px;
`

/* Fields */
const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: rgba(235,235,245,0.5);
  letter-spacing: 0.5px;
  text-transform: uppercase;
`

const FieldInput = styled.input`
  height: 46px;
  padding: 0 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  font-size: 15px;
  color: #f5f5f7;
  font-family: inherit;
  letter-spacing: -0.2px;
  outline: none;
  transition: border-color 160ms ease, background 160ms ease;

  &::placeholder { color: rgba(235,235,245,0.2); }

  &:focus {
    border-color: rgba(249,115,22,0.5);
    background: rgba(249,115,22,0.04);
  }

  &:-webkit-autofill,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 100px #111 inset;
    -webkit-text-fill-color: #f5f5f7;
    caret-color: #f5f5f7;
  }
`

/* Error */
const ErrorMsg = styled.p`
  font-size: 13px;
  color: #ff453a;
  letter-spacing: -0.1px;
  margin-bottom: 16px;
  padding: 10px 14px;
  background: rgba(255,59,48,0.08);
  border: 1px solid rgba(255,59,48,0.2);
  border-radius: 8px;
`

/* Submit */
const SubmitBtn = styled.button<{ $loading: boolean }>`
  width: 100%;
  height: 46px;
  border-radius: 10px;
  border: none;
  background: #f97316;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
  cursor: ${({ $loading }) => $loading ? 'default' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  transition: background 150ms, transform 120ms, box-shadow 150ms;
  box-shadow: ${({ $loading }) => $loading ? 'none' : '0 1px 2px rgba(0,0,0,0.3)'};

  &:hover:not(:disabled) { background: #ea6c0a; }

  &:active:not(:disabled) {
    transform: scale(0.98);
    background: #dc6309;
  }

  &:disabled {
    background: rgba(255,255,255,0.07);
    color: rgba(235,235,245,0.25);
    box-shadow: none;
    cursor: not-allowed;
  }
`

const Spin = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: _spin 0.65s linear infinite;
  @keyframes _spin { to { transform: rotate(360deg); } }
`

const SmallPaw = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <ellipse cx="10" cy="12.5" rx="5" ry="4.5" fill="#fff"/>
    <ellipse cx="5" cy="8" rx="2.3" ry="3" fill="#fff" opacity="0.8"/>
    <ellipse cx="15" cy="8" rx="2.3" ry="3" fill="#fff" opacity="0.8"/>
    <ellipse cx="7.5" cy="5.5" rx="1.8" ry="2.3" fill="#fff" opacity="0.65"/>
    <ellipse cx="12.5" cy="5.5" rx="1.8" ry="2.3" fill="#fff" opacity="0.65"/>
  </svg>
)

/* ── Component ───────────────────────────────────────────────────────── */

interface LocationState {
  from?: { pathname: string }
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const from = state?.from?.pathname ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch {
      setError('Email ou senha inválidos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      {/* Left panel */}
      <Panel>
        <PanelGrid />
        <PanelGlow />
        <PanelLogo>
          <PanelLogoIcon><SmallPaw /></PanelLogoIcon>
          <PanelLogoName>Dog Imports</PanelLogoName>
        </PanelLogo>

        <PanelCenter>
          <PanelHeadline>
            Gerencie seu<br />
            negócio com<br />
            precisão.
          </PanelHeadline>
          <PanelSub>
            Painel administrativo completo para controle de produtos, categorias e estoque.
          </PanelSub>
        </PanelCenter>

        <PanelFooter>© {new Date().getFullYear()} Dog Imports · Todos os direitos reservados</PanelFooter>
      </Panel>

      {/* Right form */}
      <FormSide>
        <FormWrap>
          <MobileLogo>
            <MobileLogoIcon><SmallPaw /></MobileLogoIcon>
            <MobileLogoName>Dog Imports</MobileLogoName>
          </MobileLogo>

          <FormHeader>
            <FormTitle>Entrar</FormTitle>
            <FormSubtitle>Acesse o painel com suas credenciais</FormSubtitle>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <Fields>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldInput
                  id="email"
                  type="email"
                  value={email}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  autoFocus
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <FieldInput
                  id="password"
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </Field>
            </Fields>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <SubmitBtn
              type="submit"
              $loading={loading}
              disabled={loading || !email || !password}
            >
              {loading ? <><Spin /> Entrando…</> : 'Entrar'}
            </SubmitBtn>
          </form>
        </FormWrap>
      </FormSide>
    </Page>
  )
}
