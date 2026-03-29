import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Input from '../../../ui/Input/Input'
import Button from '../../../ui/Button/Button'
import styled from 'styled-components'

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: #fff;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`

const ErrorMsg = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.accentRed};
  text-align: center;
`

const StyledInput = styled(Input)`
  input { color: #fff; }
`

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch {
      setError('Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Title>DOG IMPORTS</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@dogimports.com"
          fullWidth
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          fullWidth
          required
        />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Entrar
        </Button>
      </Form>
    </>
  )
}
