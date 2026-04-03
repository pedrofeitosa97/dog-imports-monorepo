import { useState, useEffect } from 'react'
import { UserPlus, Shield, ShieldOff, Trash2, User } from 'lucide-react'
import { userService } from '../../../services/userService'
import { useAuth } from '../../../hooks/useAuth'
import type { User as UserType } from '../../../types/api'
import styled from 'styled-components'

/* ── Tokens ──────────────────────────────────────────────────────────────── */
const BG      = '#0d0d0f'
const SURFACE = '#141416'
const BORDER  = 'rgba(255,255,255,0.08)'
const TEXT    = '#f5f5f7'
const MUTED   = 'rgba(255,255,255,0.45)'
const BRAND   = '#f97316'

/* ── Styled ──────────────────────────────────────────────────────────────── */

const Grid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 340px;
    align-items: start;
  }
`

const Card = styled.div`
  background: ${SURFACE};
  border: 1px solid ${BORDER};
  border-radius: 12px;
  overflow: hidden;
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 20px;
  border-bottom: 1px solid ${BORDER};
`

const CardTitle = styled.h2`
  font-size: 13px;
  font-weight: 700;
  color: ${TEXT};
  letter-spacing: 0.04em;
  flex: 1;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: ${MUTED};
  padding: 10px 20px;
  text-align: left;
  border-bottom: 1px solid ${BORDER};
  white-space: nowrap;
`

const Td = styled.td`
  padding: 13px 20px;
  font-size: 13px;
  color: ${TEXT};
  border-bottom: 1px solid ${BORDER};

  tr:last-child & { border-bottom: none; }
`

const Badge = styled.span<{ $admin?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${({ $admin }) => $admin ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.07)'};
  color: ${({ $admin }) => $admin ? BRAND : MUTED};
`

const Actions = styled.div`
  display: flex;
  gap: 6px;
`

const IconBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  color: ${({ $danger }) => $danger ? '#f87171' : MUTED};
  transition: all 140ms;
  cursor: pointer;

  &:hover {
    background: ${({ $danger }) => $danger ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.07)'};
    color: ${({ $danger }) => $danger ? '#f87171' : TEXT};
  }

  &:disabled { opacity: 0.3; cursor: not-allowed; }
`

const EmptyRow = styled.tr`
  td {
    padding: 32px 20px;
    text-align: center;
    color: ${MUTED};
    font-size: 13px;
  }
`

/* ── Form ────────────────────────────────────────────────────────────────── */

const Form = styled.form`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const FieldLabel = styled.label`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${MUTED};
  display: block;
  margin-bottom: 6px;
`

const Input = styled.input`
  width: 100%;
  background: ${BG};
  border: 1px solid ${BORDER};
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: ${TEXT};
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  transition: border-color 140ms;

  &::placeholder { color: ${MUTED}; }
  &:focus { border-color: ${BRAND}; }
`

const SubmitBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${BRAND};
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 140ms;

  &:hover { opacity: 0.88; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const ErrorMsg = styled.p`
  font-size: 12px;
  color: #f87171;
  padding: 8px 12px;
  background: rgba(239,68,68,0.1);
  border-radius: 7px;
  border: 1px solid rgba(239,68,68,0.2);
`

const SuccessMsg = styled.p`
  font-size: 12px;
  color: #4ade80;
  padding: 8px 12px;
  background: rgba(74,222,128,0.1);
  border-radius: 7px;
  border: 1px solid rgba(74,222,128,0.2);
`

const MutedText = styled.span`
  font-size: 12px;
  color: ${MUTED};
`

/* ── Component ───────────────────────────────────────────────────────────── */

export default function AdminUsersPage() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const load = () => {
    setLoading(true)
    userService.list()
      .then(setUsers)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setFormLoading(true)
    try {
      await userService.createAdmin({ name, email, password })
      setFormSuccess('Administrador criado com sucesso!')
      setName('')
      setEmail('')
      setPassword('')
      load()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setFormError(msg ?? 'Erro ao criar administrador.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleAdmin = async (user: UserType) => {
    try {
      const updated = await userService.setAdmin(user.id, !user.isAdmin)
      setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u))
    } catch {
      alert('Erro ao alterar permissão.')
    }
  }

  const handleDelete = async (user: UserType) => {
    if (!confirm(`Deletar a conta de ${user.name}? Esta ação não pode ser desfeita.`)) return
    try {
      await userService.remove(user.id)
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
    } catch {
      alert('Erro ao deletar usuário.')
    }
  }

  return (
    <Grid>
      {/* Users table */}
      <Card>
        <CardHeader>
          <User size={16} color={MUTED} />
          <CardTitle>Usuários cadastrados</CardTitle>
          <MutedText>{users.length} contas</MutedText>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th>E-mail</Th>
              <Th>Tipo</Th>
              <Th>Desde</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <EmptyRow><td colSpan={5}>Carregando...</td></EmptyRow>
            ) : users.length === 0 ? (
              <EmptyRow><td colSpan={5}>Nenhum usuário encontrado.</td></EmptyRow>
            ) : users.map((u) => (
              <tr key={u.id}>
                <Td style={{ fontWeight: 600 }}>{u.name}</Td>
                <Td><MutedText>{u.email}</MutedText></Td>
                <Td>
                  <Badge $admin={u.isAdmin}>
                    {u.isAdmin ? <><Shield size={9} /> Admin</> : 'Cliente'}
                  </Badge>
                </Td>
                <Td><MutedText>{new Date(u.createdAt).toLocaleDateString('pt-BR')}</MutedText></Td>
                <Td>
                  <Actions>
                    <IconBtn
                      title={u.isAdmin ? 'Remover admin' : 'Tornar admin'}
                      onClick={() => handleToggleAdmin(u)}
                      disabled={u.id === me?.id}
                    >
                      {u.isAdmin ? <ShieldOff size={14} /> : <Shield size={14} />}
                    </IconBtn>
                    <IconBtn
                      $danger
                      title="Deletar conta"
                      onClick={() => handleDelete(u)}
                      disabled={u.id === me?.id}
                    >
                      <Trash2 size={14} />
                    </IconBtn>
                  </Actions>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Create admin form */}
      <Card>
        <CardHeader>
          <UserPlus size={16} color={MUTED} />
          <CardTitle>Novo administrador</CardTitle>
        </CardHeader>
        <Form onSubmit={handleCreate}>
          {formError && <ErrorMsg>{formError}</ErrorMsg>}
          {formSuccess && <SuccessMsg>{formSuccess}</SuccessMsg>}
          <div>
            <FieldLabel htmlFor="admin-name">Nome</FieldLabel>
            <Input id="admin-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome completo" />
          </div>
          <div>
            <FieldLabel htmlFor="admin-email">E-mail</FieldLabel>
            <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@email.com" />
          </div>
          <div>
            <FieldLabel htmlFor="admin-pass">Senha</FieldLabel>
            <Input id="admin-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres" minLength={6} />
          </div>
          <SubmitBtn type="submit" disabled={formLoading}>
            <UserPlus size={14} />
            {formLoading ? 'Criando...' : 'Criar administrador'}
          </SubmitBtn>
        </Form>
      </Card>
    </Grid>
  )
}
