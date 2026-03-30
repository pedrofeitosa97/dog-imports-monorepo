import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '../../../hooks/useAuth'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  position: relative;
  overflow: hidden;
`

const Blob1 = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%);
  top: -200px;
  right: -150px;
  pointer-events: none;
`

const Blob2 = styled.div`
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%);
  bottom: -150px;
  left: -100px;
  pointer-events: none;
`

const Card = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  background: rgba(28, 28, 30, 0.82);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.04),
    0 8px 32px rgba(0,0,0,0.6),
    0 32px 80px rgba(0,0,0,0.5);
  padding: 44px 36px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeUp} 0.5s cubic-bezier(.22,.68,0,1.15) both;
`

const AppIcon = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 20px;
  background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
  border: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
  box-shadow:
    0 4px 16px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.07);
`

const PawIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="24" rx="9.5" ry="8.5" fill="#f97316"/>
    <ellipse cx="10.5" cy="15.5" rx="4.2" ry="5.5" fill="#f97316" opacity="0.85"/>
    <ellipse cx="29.5" cy="15.5" rx="4.2" ry="5.5" fill="#f97316" opacity="0.85"/>
    <ellipse cx="15.5" cy="10.5" rx="3.2" ry="4.2" fill="#f97316" opacity="0.7"/>
    <ellipse cx="24.5" cy="10.5" rx="3.2" ry="4.2" fill="#f97316" opacity="0.7"/>
  </svg>
)

const AppName = styled.h1`
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #f5f5f7;
  margin: 0 0 5px;
`

const Subtitle = styled.p`
  font-size: 14px;
  color: rgba(235, 235, 245, 0.45);
  margin: 0 0 32px;
  letter-spacing: -0.1px;
`

const FieldGroup = styled.div`
  width: 100%;
  background: rgba(118, 118, 128, 0.18);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 20px;
`

const FieldRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }
`

const FieldLabel = styled.label`
  position: absolute;
  left: 16px;
  font-size: 15px;
  font-weight: 500;
  color: #f5f5f7;
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
  color: #f5f5f7;
  font-family: inherit;
  letter-spacing: -0.2px;

  &::placeholder { color: rgba(235, 235, 245, 0.25); }

  &:-webkit-autofill,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 100px rgba(28, 28, 30, 0.82) inset;
    -webkit-text-fill-color: #f5f5f7;
    caret-color: #f5f5f7;
  }
`

const ErrorBubble = styled.div`
  width: 100%;
  background: rgba(255, 59, 48, 0.12);
  border: 1px solid rgba(255, 59, 48, 0.28);
  border-radius: 12px;
  padding: 11px 16px;
  font-size: 13.5px;
  color: #ff453a;
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
    ? 'rgba(249, 115, 22, 0.5)'
    : 'linear-gradient(160deg, #fb923c 0%, #f97316 100%)'};
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
  transition: all 150ms ease;
  box-shadow: ${({ $loading }) => $loading ? 'none' : '0 4px 20px rgba(249, 115, 22, 0.35)'};

  &:active:not(:disabled) {
    transform: scale(0.97);
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(235, 235, 245, 0.3);
    box-shadow: none;
    cursor: not-allowed;
  }
`

const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
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
      <Blob1 />
      <Blob2 />
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
