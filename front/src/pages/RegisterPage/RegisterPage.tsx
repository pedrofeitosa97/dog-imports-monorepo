import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Button from '../../ui/Button/Button'
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/authService'
import { STORAGE_KEYS } from '../../utils/constants'
import styled from 'styled-components'

const Wrapper = styled.div`
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[4]}`};
`

const Card = styled.div`
  width: 100%;
  max-width: 420px;
`

const Label = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`

const Title = styled.h1`
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const InputWrapper = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: 12px 16px;
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  box-sizing: border-box;

  &::placeholder { color: ${({ theme }) => theme.colors.textSecondary}; }
  &:focus { border-color: ${({ theme }) => theme.colors.brand}; }
`

const PasswordInput = styled(Input)`
  padding-right: 48px;
`

const EyeBtn = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover { color: ${({ theme }) => theme.colors.textPrimary}; }
`

const ErrorMsg = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.accentRed};
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.08);
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: 1px solid rgba(239, 68, 68, 0.18);
`

const Terms = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  text-align: center;
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: ${({ theme }) => `${theme.spacing[2]} 0`};

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`

const DividerText = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  transition: border-color ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast};

  strong { color: ${({ theme }) => theme.colors.brand}; font-weight: 700; }

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    try {
      const data = await authService.register(name, email, password)
      localStorage.setItem(STORAGE_KEYS.token, data.token)
      await login(email, password)
      navigate('/minha-conta', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrapper>
      <Card>
        <Label>Novo cliente</Label>
        <Title>Criar conta</Title>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <Field>
            <FieldLabel htmlFor="name">Nome completo</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <InputWrapper>
              <PasswordInput
                id="password"
                type={showPw ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <EyeBtn type="button" onClick={() => setShowPw((v) => !v)} aria-label="Mostrar senha">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </EyeBtn>
            </InputWrapper>
          </Field>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>

          <Terms>
            Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
          </Terms>
        </Form>

        <Divider style={{ marginTop: '8px' }}>
          <DividerText>ou</DividerText>
        </Divider>

        <LoginLink to="/login">
          Já tem conta? <strong>Entrar</strong>
        </LoginLink>
      </Card>
    </Wrapper>
  )
}
