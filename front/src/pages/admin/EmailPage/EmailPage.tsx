import { useState, useEffect, useCallback } from 'react'
import { Send, TestTube, Settings2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import styled from 'styled-components'
import Button from '../../../ui/Button/Button'
import { emailService, type EmailSettings } from '../../../services/emailService'
import { useToast } from '../../../hooks/useToast'

/* ── Styles ───────────────────────────────────────────────────────────────── */

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 800px;
`

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: rgba(235,235,245,0.4);
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin: 0 0 16px;
`

const Card = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const StatusBadge = styled.div<{ $ok: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ $ok }) => $ok ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'};
  color: ${({ $ok }) => $ok ? '#4ade80' : '#f87171'};
`

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

const Field = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #f5f5f7;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Input = styled.input`
  height: 40px;
  padding: 0 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 10px;
  font-size: 13px;
  color: #f5f5f7;
  font-family: inherit;
  outline: none;
  transition: border-color 150ms;
  &:focus { border-color: rgba(249,115,22,0.5); }
  &::placeholder { color: rgba(235,235,245,0.2); }
`

const Textarea = styled.textarea`
  padding: 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 10px;
  font-size: 12px;
  color: #f5f5f7;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  outline: none;
  resize: vertical;
  min-height: 260px;
  line-height: 1.6;
  transition: border-color 150ms;
  &:focus { border-color: rgba(249,115,22,0.5); }
`

const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  flex-wrap: wrap;
`

const HintText = styled.p`
  font-size: 12px;
  color: rgba(235,235,245,0.35);
  margin: 0;
  line-height: 1.5;
`

const VarChip = styled.code`
  display: inline-block;
  padding: 2px 7px;
  background: rgba(249,115,22,0.12);
  color: #f97316;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  margin: 2px 3px;
`

const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255,255,255,0.07);
  margin: 4px 0;
`

/* ── Component ────────────────────────────────────────────────────────────── */

const DEFAULT_SUBJECT = 'Pedido #{{orderId}} confirmado — Dog Imports'

export default function EmailPage() {
  const { toast } = useToast()
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [settings, setSettings] = useState<EmailSettings>({
    email_from_name: '',
    email_from_address: '',
    email_order_subject: DEFAULT_SUBJECT,
    email_order_template: '',
  })
  const [savingSettings, setSavingSettings] = useState(false)

  // Manual send
  const [orderId, setOrderId] = useState('')
  const [sending, setSending] = useState(false)

  // Test email
  const [testEmail, setTestEmail] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  const loadStatus = useCallback(async () => {
    try {
      const s = await emailService.getStatus()
      setConfigured(s.configured)
    } catch {
      setConfigured(false)
    }
  }, [])

  const loadSettings = useCallback(async () => {
    try {
      const s = await emailService.getSettings()
      setSettings((prev) => ({
        ...prev,
        ...s,
        email_order_subject: s.email_order_subject || DEFAULT_SUBJECT,
      }))
    } catch {
      // silently ignore
    }
  }, [])

  useEffect(() => {
    loadStatus()
    loadSettings()
  }, [loadStatus, loadSettings])

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    try {
      await emailService.saveSettings(settings)
      toast('Configurações de e-mail salvas', 'success')
    } catch {
      toast('Erro ao salvar configurações', 'error')
    } finally {
      setSavingSettings(false)
    }
  }

  const handleSendOrder = async () => {
    const id = parseInt(orderId)
    if (!id) { toast('Informe um ID de pedido válido', 'error'); return }
    setSending(true)
    try {
      const r = await emailService.sendOrderEmail(id)
      toast(r.message, 'success')
      setOrderId('')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast(msg || 'Erro ao enviar e-mail', 'error')
    } finally {
      setSending(false)
    }
  }

  const handleSendTest = async () => {
    if (!testEmail) { toast('Informe um e-mail de destino', 'error'); return }
    setSendingTest(true)
    try {
      const r = await emailService.sendTest(testEmail)
      toast(r.message, 'success')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast(msg || 'Erro ao enviar teste', 'error')
    } finally {
      setSendingTest(false)
    }
  }

  return (
    <Page>
      {/* Status */}
      <Card>
        <SectionTitle>Integração Resend</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {configured === null ? (
            <StatusBadge $ok={false}><RefreshCw size={14} /> Verificando...</StatusBadge>
          ) : configured ? (
            <StatusBadge $ok={true}><CheckCircle2 size={14} /> API Key configurada — e-mails ativos</StatusBadge>
          ) : (
            <StatusBadge $ok={false}><AlertCircle size={14} /> RESEND_API_KEY não configurada</StatusBadge>
          )}
        </div>
        {!configured && configured !== null && (
          <HintText>
            Adicione a variável de ambiente <VarChip>RESEND_API_KEY</VarChip> no Railway para ativar o envio de e-mails.
            Obtenha sua chave em <strong style={{ color: '#f97316' }}>resend.com</strong>.
          </HintText>
        )}
      </Card>

      {/* Sender config */}
      <Card>
        <SectionTitle>Remetente</SectionTitle>
        <Grid2>
          <Field>
            Nome do remetente
            <Input
              placeholder="Dog Imports"
              value={settings.email_from_name}
              onChange={(e) => setSettings((p) => ({ ...p, email_from_name: e.target.value }))}
            />
          </Field>
          <Field>
            E-mail remetente
            <Input
              type="email"
              placeholder="noreply@seudominio.com"
              value={settings.email_from_address}
              onChange={(e) => setSettings((p) => ({ ...p, email_from_address: e.target.value }))}
            />
          </Field>
        </Grid2>
        <HintText>
          O domínio do e-mail remetente deve estar verificado no Resend. Sem verificação, os e-mails podem cair no spam.
        </HintText>
      </Card>

      {/* Order confirmation template */}
      <Card>
        <SectionTitle>Template — Confirmação de Pedido</SectionTitle>

        <Field>
          Assunto do e-mail
          <Input
            placeholder={DEFAULT_SUBJECT}
            value={settings.email_order_subject}
            onChange={(e) => setSettings((p) => ({ ...p, email_order_subject: e.target.value }))}
          />
        </Field>

        <Field>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Corpo do e-mail (HTML)
            <span style={{ fontWeight: 400, color: 'rgba(235,235,245,0.35)', fontSize: 12 }}>
              — deixe em branco para usar o template padrão
            </span>
          </span>
          <Textarea
            placeholder="<!DOCTYPE html>..."
            value={settings.email_order_template}
            onChange={(e) => setSettings((p) => ({ ...p, email_order_template: e.target.value }))}
          />
        </Field>

        <HintText>
          Variáveis disponíveis: <VarChip>{'{{customerName}}'}</VarChip>
          <VarChip>{'{{orderId}}'}</VarChip> <VarChip>{'{{totalPrice}}'}</VarChip>
          <VarChip>{'{{paymentMethod}}'}</VarChip> <VarChip>{'{{address}}'}</VarChip>
          <VarChip>{'{{itemsHtml}}'}</VarChip>
        </HintText>

        <SaveRow>
          <Button variant="primary" size="sm" onClick={handleSaveSettings} loading={savingSettings}>
            <Settings2 size={14} /> Salvar configurações
          </Button>
        </SaveRow>
      </Card>

      <Divider />

      {/* Manual trigger */}
      <Card>
        <SectionTitle>Disparar e-mail de confirmação</SectionTitle>
        <HintText>
          Reenvia o e-mail de confirmação para o cliente de um pedido específico. Útil para pedidos antigos ou quando o envio automático falhou.
        </HintText>
        <Row>
          <Field style={{ flex: 1, minWidth: 160 }}>
            ID do pedido
            <Input
              type="number"
              min="1"
              placeholder="ex: 42"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </Field>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSendOrder}
            loading={sending}
            disabled={!configured}
          >
            <Send size={14} /> Enviar confirmação
          </Button>
        </Row>
      </Card>

      {/* Test email */}
      <Card>
        <SectionTitle>E-mail de teste</SectionTitle>
        <HintText>Envia um e-mail simples para verificar se a integração está funcionando.</HintText>
        <Row>
          <Field style={{ flex: 1, minWidth: 200 }}>
            Destinatário
            <Input
              type="email"
              placeholder="seu@email.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </Field>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSendTest}
            loading={sendingTest}
            disabled={!configured}
          >
            <TestTube size={14} /> Enviar teste
          </Button>
        </Row>
      </Card>
    </Page>
  )
}
