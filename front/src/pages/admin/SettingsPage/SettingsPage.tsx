import { useState, useRef, type ChangeEvent } from 'react'
import { Upload, Info, Check } from 'lucide-react'
import styled from 'styled-components'
import Button from '../../../ui/Button/Button'
import { settingsService } from '../../../services/settingsService'
import { useSiteSettings } from '../../../hooks/useSiteSettings'
import { useToast } from '../../../hooks/useToast'

/* ── Styles ─────────────────────────────────────────────────────────────── */

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 720px;
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
  gap: 20px;
`

const LogoRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
`

const PreviewBox = styled.div<{ $w: number; $h: number }>`
  width: ${({ $w }) => $w}px;
  height: ${({ $h }) => $h}px;
  border-radius: 12px;
  background: rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

const PreviewLabel = styled.p`
  font-size: 10px;
  font-weight: 600;
  color: rgba(235,235,245,0.25);
  text-align: center;
  margin-top: 6px;
  letter-spacing: 0.4px;
`

const PreviewWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Controls = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #f5f5f7;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldInput = styled.input`
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

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: rgba(235,235,245,0.2);
  &::before, &::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
`

const DropZone = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1.5px dashed rgba(255,255,255,0.12);
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  color: rgba(235,235,245,0.5);
  transition: all 150ms;
  &:hover { border-color: rgba(249,115,22,0.4); color: #f97316; background: rgba(249,115,22,0.05); }
  input { display: none; }
`

const HintBox = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(249,115,22,0.07);
  border-radius: 8px;
  font-size: 12px;
  color: rgba(249,115,22,0.8);
  line-height: 1.5;

  svg { flex-shrink: 0; margin-top: 1px; }
`

const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
`

/* ── component ───────────────────────────────────────────────────────────── */

interface LogoFieldProps {
  settingKey: string
  label: string
  hint: string
  previewW: number
  previewH: number
  previewLabel: string
  currentUrl: string | null | undefined
}

function LogoField({ settingKey, label, hint, previewW, previewH, previewLabel, currentUrl }: LogoFieldProps) {
  const { refresh } = useSiteSettings()
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState(currentUrl ?? '')
  const [preview, setPreview] = useState<string>(currentUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [savedKey, setSavedKey] = useState<string | null>(currentUrl ?? null)

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setSaving(true)
    settingsService.uploadImage(settingKey, file)
      .then((s) => {
        const url = s[settingKey] ?? ''
        setSavedKey(url)
        setUrlInput(url)
        refresh()
        toast(`${label} atualizada`, 'success')
      })
      .catch(() => toast(`Erro ao enviar ${label}`, 'error'))
      .finally(() => setSaving(false))
  }

  const handleSaveUrl = () => {
    if (!urlInput.trim()) return
    setSaving(true)
    settingsService.setValue(settingKey, urlInput.trim())
      .then((s) => {
        const url = s[settingKey] ?? ''
        setSavedKey(url)
        setPreview(url)
        refresh()
        toast(`${label} atualizada`, 'success')
      })
      .catch(() => toast(`Erro ao salvar ${label}`, 'error'))
      .finally(() => setSaving(false))
  }

  const displayPreview = preview || '/logo.png'
  const isSaved = savedKey === urlInput.trim() && !!savedKey

  return (
    <Card>
      <SectionTitle>{label}</SectionTitle>
      <LogoRow>
        <PreviewWrap>
          <PreviewBox $w={previewW} $h={previewH}>
            <img
              src={displayPreview}
              alt={label}
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png' }}
            />
          </PreviewBox>
          <PreviewLabel>{previewLabel}</PreviewLabel>
        </PreviewWrap>

        <Controls>
          <HintBox>
            <Info size={14} />
            <span>{hint}</span>
          </HintBox>

          <FieldLabel>
            URL da imagem
            <FieldInput
              type="url"
              placeholder="https://exemplo.com/logo.png"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setPreview(e.target.value) }}
            />
          </FieldLabel>

          <SaveRow>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveUrl}
              loading={saving}
              disabled={!urlInput.trim() || isSaved}
            >
              {isSaved ? <><Check size={14} /> Salvo</> : 'Salvar URL'}
            </Button>
          </SaveRow>

          <OrDivider>ou faça upload direto para o S3</OrDivider>

          <DropZone>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleFile} />
            <Upload size={16} />
            Clique para enviar arquivo (PNG, SVG, WEBP)
          </DropZone>
        </Controls>
      </LogoRow>
    </Card>
  )
}

/* ── main page ───────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  const { settings } = useSiteSettings()

  return (
    <Page>
      <LogoField
        settingKey="logo_header"
        label="Logo do Header"
        hint="Recomendado: 200×200px ou maior, quadrado, PNG com fundo transparente. Exibido a 64×64px no header e 42×42px na sidebar do admin."
        previewW={64}
        previewH={64}
        previewLabel="64 × 64px"
        currentUrl={settings.logo_header}
      />

      <LogoField
        settingKey="logo_footer"
        label="Logo do Footer"
        hint="Recomendado: 200×200px ou maior, quadrado, PNG com fundo transparente. Exibido a 72×72px no rodapé do site."
        previewW={72}
        previewH={72}
        previewLabel="72 × 72px"
        currentUrl={settings.logo_footer}
      />
    </Page>
  )
}
