import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '../../../hooks/useAuth'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f2f2f7;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
`

const Blobs = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
  }

  &::before {
    width: 520px;
    height: 520px;
    background: radial-gradient(circle, #a8c8ff 0%, #c3b1e1 100%);
    top: -140px;
    right: -120px;
  }

  &::after {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #fde68a 0%, #fca5a5 100%);
    bottom: -100px;
    left: -80px;
  }
`

const Card = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    0 2px 4px rgba(0,0,0,0.04),
    0 8px 24px rgba(0,0,0,0.08),
    0 24px 64px rgba(0,0,0,0.10);
  padding: 44px 36px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  animation: ${fadeUp} 0.55s cubic-bezier(.22,.68,0,1.2) both;
`

const AppIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: linear-gradient(145deg, #1c1c1e 0%, #2c2c2e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow:
    0 4px 12px rgba(0,0,0,0.18),
    inset 0 1px 0 rgba(255,255,255,0.08);
`

const PawIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <ellipse cx="19" cy="23" rx="9" ry="8" fill="#f97316" opacity="0.95"/>
    <ellipse cx="10" cy="15" rx="4" ry="5.5" fill="#f97316" opacity="0.85"/>
    <ellipse cx="28" cy="15" rx="4" ry="5.5" fill="#f97316" opacity="0.85"/>
    <ellipse cx="15" cy="10" rx="3" ry="4" fill="#f97316" opacity="0.7"/>
    <ellipse cx="23" cy="10" rx="3" ry="4" fill="#f97316" opacity="0.7"/>
  </svg>
)

const AppName = styled.h1`
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #1c1c1e;
  margin: 0 0 4px;
`

const Subtitle = styled.p`
  font-size: 14px;
  color: #8e8e93;
  margin: 0 0 32px;
  letter-spacing: -0.1px;
`

const FieldGroup = styled.div`
  width: 100%;
  background: rgba(118, 118, 128, 0.12);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 20px;
`

const FieldRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  & + & {
    border-top: 1px solid rgba(0, 0, 0, 0.07);
  }
`

const FieldLabel = styled.label`
  position: absolute;
  left: 16px;
  font-size: 15px;
  font-weight: 500;
  color: #1c1c1e;
  pointer-events: none;
  width: 64px;
  flex-shrink: 0;
  letter-spacing: -0.2px;
`

const FieldInput = styled.input`
  flex: 1;
  height: 52px;
  padding: 0 16px 0 88px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1c1c1e;
  font-family: inherit;
  letter-spacing: -0.2px;

  &::placeholder { color: #c7c7cc; }

  &:-webkit-autofill,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 100px rgba(118, 118, 128, 0.12) inset;
    -webkit-text-fill-color: #1c1c1e;
    caret-color: #1c1c1e;
  }
`

const ErrorBubble = styled.div`
  width: 100%;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.22);
  border-radius: 12px;
  padding: 11px 16px;
  font-size: 13.5px;
  color: #d70015;
  text-align: center;
  letter-spacing: -0.1px;
  margin-bottom: 16px;
`

const SignInBtn = styled.button<{ $loading: boolean }>`
  width: 100%;
  height: 52px;
  border-radius: 14px;
  border: none;
  background: ${({ $loading }) => $loading
    ? 'rgba(0, 122, 255, 0.65)'
    : 'linear-gradient(160deg, #0a84ff 0%, #007aff 100%)'};
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
  cursor: ${({ $loading }) => $loading ? 'default' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  transition: all 160ms ease;
  box-shadow: ${({ $loading }) => $loading ? 'none' : '0 4px 16px rgba(0, 122, 255, 0.38)'};

  &:active:not(:disabled) {
    transform: scale(0.97);
    box-shadow: 0 2px 8px rgba(0, 122, 255, 0.28);
  }

  &:disabled {
    background: rgba(118, 118, 128, 0.2);
    color: #aeaeb2;
    box-shadow: none;
    cursor: not-allowed;
  }
`

const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;

  @keyframes spin { to { transform: rotate(360deg); } }
`

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
      <Blobs />
      <Card>
        <AppIcon><PawIcon /></AppIcon>
        <AppName>Dog Imports</AppName>
        <Subtitle>Acesse o painel administrativo</Subtitle>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <FieldGroup>
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
          </FieldGroup>

          {error && <ErrorBubble>{error}</ErrorBubble>}

          <SignInBtn
            type="submit"
            $loading={loading}
            disabled={loading || !email || !password}
          >
            {loading ? <><Spinner /> Entrando…</> : 'Entrar'}
          </SignInBtn>
        </form>
      </Card>
    </Page>
  )
}
