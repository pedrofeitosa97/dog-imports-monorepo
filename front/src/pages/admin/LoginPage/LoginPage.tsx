import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '../../../hooks/useAuth'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ── Page ─────────────────────────────────────────────────────────────── */

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  padding: 40px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Helvetica Neue', sans-serif;
`

const Glow = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`

/* ── Form area ─────────────────────────────────────────────────────────── */

const Wrap = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${fadeUp} 0.4s cubic-bezier(.22,.68,0,1.1) both;
`

/* ── Logo ─────────────────────────────────────────────────────────────── */

const LogoRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 40px;
`

const LogoMark = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
`

const Heading = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #f5f5f7;
  letter-spacing: -0.4px;
  margin: 0 0 6px;
`

const Sub = styled.p`
  font-size: 14px;
  color: rgba(235,235,245,0.4);
  letter-spacing: -0.1px;
`

/* ── Fields ───────────────────────────────────────────────────────────── */

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 16px;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  overflow: hidden;
`

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;

  & + & {
    border-top: 1px solid rgba(255,255,255,0.09);
  }
`

const FieldLabel = styled.label`
  font-size: 11px;
  font-weight: 500;
  color: rgba(235,235,245,0.35);
  letter-spacing: 0.6px;
  text-transform: uppercase;
  padding: 10px 16px 0;
`

const FieldInput = styled.input`
  height: 44px;
  padding: 0 16px 4px;
  background: rgba(255,255,255,0.04);
  border: none;
  font-size: 15px;
  color: #f5f5f7;
  font-family: inherit;
  letter-spacing: -0.2px;
  outline: none;
  width: 100%;
  transition: background 150ms;

  &::placeholder { color: rgba(235,235,245,0.18); }

  &:focus { background: rgba(249,115,22,0.05); }

  &:-webkit-autofill,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 100px #111 inset;
    -webkit-text-fill-color: #f5f5f7;
    caret-color: #f5f5f7;
  }
`

/* ── Error ────────────────────────────────────────────────────────────── */

const ErrorMsg = styled.p`
  font-size: 13px;
  color: #ff453a;
  letter-spacing: -0.1px;
  margin-bottom: 14px;
  padding: 10px 14px;
  background: rgba(255,59,48,0.08);
  border: 1px solid rgba(255,59,48,0.18);
  border-radius: 10px;
`

/* ── Button ───────────────────────────────────────────────────────────── */

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
  cursor: ${({ $loading }) => $loading ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  transition: background 140ms, transform 120ms;

  &:hover:not(:disabled) { background: #ea6c0a; }
  &:active:not(:disabled) { transform: scale(0.985); background: #dc6309; }
  &:disabled {
    background: rgba(255,255,255,0.07);
    color: rgba(235,235,245,0.22);
    cursor: not-allowed;
  }
`

const Spin = styled.span`
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: _s 0.65s linear infinite;
  @keyframes _s { to { transform: rotate(360deg); } }
`

const PawIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <ellipse cx="10" cy="12.5" rx="5" ry="4.5" fill="#fff"/>
    <ellipse cx="5"  cy="8"    rx="2.2" ry="3"   fill="#fff" opacity="0.8"/>
    <ellipse cx="15" cy="8"    rx="2.2" ry="3"   fill="#fff" opacity="0.8"/>
    <ellipse cx="7.5"  cy="5.5" rx="1.7" ry="2.2" fill="#fff" opacity="0.65"/>
    <ellipse cx="12.5" cy="5.5" rx="1.7" ry="2.2" fill="#fff" opacity="0.65"/>
  </svg>
)

/* ── Component ────────────────────────────────────────────────────────── */

interface LocationState { from?: { pathname: string } }

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
      const user = await login(email, password)
      if (!user.isAdmin) {
        setError('Acesso negado. Esta área é exclusiva para administradores.')
        return
      }
      navigate(from, { replace: true })
    } catch {
      setError('Email ou senha inválidos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <Glow />
      <Wrap>
        <LogoRow>
          <LogoMark><PawIcon /></LogoMark>
          <Heading>Entrar no painel</Heading>
          <Sub>Dog Imports · Área administrativa</Sub>
        </LogoRow>

        <form onSubmit={handleSubmit}>
          <Fields>
            <FieldRow>
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
            </FieldRow>
            <FieldRow>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <FieldInput
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                autoComplete="current-password"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </FieldRow>
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
      </Wrap>
    </Page>
  )
}
