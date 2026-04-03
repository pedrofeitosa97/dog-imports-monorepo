import { useState, useEffect, useCallback } from 'react'
import { Send, TestTube, Settings2, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react'
import styled from 'styled-components'
import Button from '../../../ui/Button/Button'
import { emailService, type EmailSettings } from '../../../services/emailService'
import { useToast } from '../../../hooks/useToast'

/* ── Styles ───────────────────────────────────────────────────────────────── */

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 900px;
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
  min-height: 280px;
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
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255,255,255,0.07);
  margin: 4px 0;
`

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  padding: 4px;
`

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 16px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 150ms;
  background: ${({ $active }) => $active ? 'rgba(249,115,22,0.18)' : 'transparent'};
  color: ${({ $active }) => $active ? '#f97316' : 'rgba(235,235,245,0.4)'};
  border: 1px solid ${({ $active }) => $active ? 'rgba(249,115,22,0.35)' : 'transparent'};

  &:hover {
    color: ${({ $active }) => $active ? '#f97316' : 'rgba(235,235,245,0.7)'};
  }
`

const PreviewFrame = styled.iframe`
  width: 100%;
  height: 600px;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 10px;
  background: #ffffff;
`

const EditorActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

/* ── Default templates ────────────────────────────────────────────────────── */

const DEFAULT_ORDER_SUBJECT = 'Pedido #{{orderId}} confirmado — Dog Imports'
const DEFAULT_STATUS_SUBJECT = 'Pedido #{{orderId}} — {{statusLabel}}'

const SAMPLE_ITEMS_HTML = `
  <tr>
    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">Camiseta Tommy Hilfiger — M / Branco</td>
    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center;">1x</td>
    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">R$ 599,00</td>
  </tr>
  <tr>
    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">Calça Ralph Lauren — 38 / Azul</td>
    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center;">1x</td>
    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">R$ 849,00</td>
  </tr>`

const SAMPLE_VARS_ORDER: Record<string, string> = {
  customerName: 'Maria Silva',
  orderId: '00042',
  totalPrice: '1.448,00',
  paymentMethod: 'Cartão de crédito',
  address: 'Rua das Flores, 123, Apto 4 — Centro, São Paulo/SP, CEP 01310-100',
  itemsHtml: SAMPLE_ITEMS_HTML,
}

const SAMPLE_VARS_STATUS: Record<string, string> = {
  customerName: 'Maria Silva',
  orderId: '00042',
  statusLabel: 'Enviado',
  statusMessage: 'Seu pedido foi despachado e está a caminho!',
}

function renderPreview(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

/* ── Component ────────────────────────────────────────────────────────────── */

export default function EmailPage() {
  const { toast } = useToast()
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [settings, setSettings] = useState<EmailSettings>({
    email_from_name: '',
    email_from_address: '',
    email_order_subject: DEFAULT_ORDER_SUBJECT,
    email_order_template: '',
    email_status_subject: DEFAULT_STATUS_SUBJECT,
    email_status_template: '',
  })
  const [savingSettings, setSavingSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'confirmacao' | 'status'>('confirmacao')
  const [showPreview, setShowPreview] = useState(false)

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
        email_order_subject: s.email_order_subject || DEFAULT_ORDER_SUBJECT,
        email_status_subject: s.email_status_subject || DEFAULT_STATUS_SUBJECT,
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

  const previewHtml = (() => {
    if (activeTab === 'confirmacao') {
      return renderPreview(settings.email_order_template || DEFAULT_ORDER_TEMPLATE, SAMPLE_VARS_ORDER)
    }
    return renderPreview(settings.email_status_template || DEFAULT_STATUS_TEMPLATE, SAMPLE_VARS_STATUS)
  })()

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

      {/* Templates */}
      <Card>
        <SectionTitle>Templates de E-mail</SectionTitle>

        <Tabs>
          <Tab $active={activeTab === 'confirmacao'} onClick={() => { setActiveTab('confirmacao'); setShowPreview(false) }}>
            Confirmação de Pedido
          </Tab>
          <Tab $active={activeTab === 'status'} onClick={() => { setActiveTab('status'); setShowPreview(false) }}>
            Atualização de Status
          </Tab>
        </Tabs>

        {activeTab === 'confirmacao' && (
          <>
            <Field>
              Assunto do e-mail
              <Input
                placeholder={DEFAULT_ORDER_SUBJECT}
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
              Variáveis: <VarChip>{'{{customerName}}'}</VarChip>
              <VarChip>{'{{orderId}}'}</VarChip> <VarChip>{'{{totalPrice}}'}</VarChip>
              <VarChip>{'{{paymentMethod}}'}</VarChip> <VarChip>{'{{address}}'}</VarChip>
              <VarChip>{'{{itemsHtml}}'}</VarChip>
            </HintText>
          </>
        )}

        {activeTab === 'status' && (
          <>
            <Field>
              Assunto do e-mail
              <Input
                placeholder={DEFAULT_STATUS_SUBJECT}
                value={settings.email_status_subject}
                onChange={(e) => setSettings((p) => ({ ...p, email_status_subject: e.target.value }))}
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
                value={settings.email_status_template}
                onChange={(e) => setSettings((p) => ({ ...p, email_status_template: e.target.value }))}
              />
            </Field>
            <HintText>
              Variáveis: <VarChip>{'{{customerName}}'}</VarChip>
              <VarChip>{'{{orderId}}'}</VarChip> <VarChip>{'{{statusLabel}}'}</VarChip>
              <VarChip>{'{{statusMessage}}'}</VarChip>
            </HintText>
          </>
        )}

        {showPreview && (
          <div>
            <HintText style={{ marginBottom: 8 }}>
              Prévia com dados de exemplo — campos em branco usam o template padrão
            </HintText>
            <PreviewFrame
              srcDoc={previewHtml}
              title="Prévia do e-mail"
              sandbox="allow-same-origin"
            />
          </div>
        )}

        <SaveRow>
          <EditorActions>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPreview ? 'Fechar prévia' : 'Ver prévia'}
            </Button>
          </EditorActions>
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

/* ── Default templates (inline, used for preview when field is empty) ─────── */

const DEFAULT_ORDER_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
        <tr><td style="background:#111827;padding:24px 32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">Dog Imports</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">Pedido Confirmado!</h2>
          <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Olá, {{customerName}}! Recebemos seu pedido e estamos preparando tudo com carinho.</p>
          <div style="background:#f3f4f6;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:#6b7280;">Número do pedido</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#111827;">#{{orderId}}</p>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <th style="text-align:left;font-size:13px;color:#6b7280;padding-bottom:8px;font-weight:600;">Produto</th>
              <th style="text-align:center;font-size:13px;color:#6b7280;padding-bottom:8px;font-weight:600;">Qtd</th>
              <th style="text-align:right;font-size:13px;color:#6b7280;padding-bottom:8px;font-weight:600;">Valor</th>
            </tr>
            {{itemsHtml}}
          </table>
          <div style="text-align:right;margin-bottom:24px;">
            <span style="font-size:16px;font-weight:700;color:#111827;">Total: R$ {{totalPrice}}</span>
          </div>
          <p style="margin:0;color:#6b7280;font-size:14px;">Em caso de dúvidas, entre em contato conosco.</p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© Dog Imports — Todos os direitos reservados</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

const DEFAULT_STATUS_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
        <tr><td style="background:#111827;padding:24px 32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">Dog Imports</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">Atualização do pedido #{{orderId}}</h2>
          <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Olá, {{customerName}}! {{statusMessage}}</p>
          <div style="background:#f3f4f6;border-radius:8px;padding:16px 20px;margin-bottom:24px;display:inline-block;">
            <p style="margin:0;font-size:13px;color:#6b7280;">Status atual</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#111827;">{{statusLabel}}</p>
          </div>
          <p style="margin:0;color:#6b7280;font-size:14px;">Em caso de dúvidas, entre em contato conosco.</p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© Dog Imports — Todos os direitos reservados</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
