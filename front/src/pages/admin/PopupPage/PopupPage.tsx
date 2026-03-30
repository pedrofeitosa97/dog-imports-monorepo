import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import { Plus, Trash2, Upload, Link as LinkIcon, Eye, EyeOff, Edit2 } from 'lucide-react'
import styled from 'styled-components'
import Button from '../../../ui/Button/Button'
import Modal from '../../../ui/Modal/Modal'
import { popupService } from '../../../services/popupService'
import { useToast } from '../../../hooks/useToast'
import { getImageUrl } from '../../../utils/getImageUrl'
import type { Popup, PopupFormData } from '../../../types/api'

/* ── Styles ──────────────────────────────────────────────────────────────── */

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #f5f5f7;
`

const Hint = styled.p`
  font-size: 13px;
  color: rgba(235,235,245,0.4);
  margin-bottom: 20px;
`

const PopupList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PopupCard = styled.div<{ $inactive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  padding: 14px 16px;
  opacity: ${({ $inactive }) => $inactive ? 0.5 : 1};
  transition: opacity 150ms;

  @media (max-width: 640px) { flex-wrap: wrap; }
`

const PopupThumb = styled.div`
  width: 100px;
  height: 68px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255,255,255,0.07);
  img { width: 100%; height: 100%; object-fit: cover; }
`

const NoThumb = styled.div`
  width: 100px;
  height: 68px;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.2);
  font-size: 11px;
  flex-shrink: 0;
`

const PopupInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const PopupTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #f5f5f7;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const PopupMeta = styled.p`
  font-size: 12px;
  color: rgba(235,235,245,0.35);
  margin: 0;
`

const ActiveBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4ade80;
  background: rgba(74,222,128,0.12);
  border-radius: 4px;
  padding: 2px 7px;
`

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`

const IconBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: ${({ $danger }) => $danger ? '#ff6b6b' : 'rgba(255,255,255,0.5)'};
  cursor: pointer;
  transition: all 150ms;
  &:hover {
    background: rgba(255,255,255,0.08);
    color: ${({ $danger }) => $danger ? '#ff4444' : '#fff'};
  }
`

const Empty = styled.div`
  padding: 48px;
  text-align: center;
  color: rgba(235,235,245,0.25);
  font-size: 14px;
  background: rgba(255,255,255,0.02);
  border-radius: 14px;
`

/* ── Form ─────────────────────────────────────────────────────────────────── */

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: rgba(235,235,245,0.4);
  letter-spacing: 0.5px;
  text-transform: uppercase;
`

const FieldInput = styled.input`
  height: 40px;
  padding: 0 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 8px;
  font-size: 14px;
  color: #f5f5f7;
  font-family: inherit;
  outline: none;
  transition: border-color 150ms;
  &:focus { border-color: rgba(249,115,22,0.5); }
  &::placeholder { color: rgba(235,235,245,0.2); }
`

const ImageTabs = styled.div`display: flex; gap: 8px;`

const TabBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: ${({ $active }) => $active ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)'};
  color: ${({ $active }) => $active ? '#f97316' : 'rgba(235,235,245,0.5)'};
  transition: all 150ms;
  &:hover { background: rgba(255,255,255,0.08); color: #f5f5f7; }
`

const PreviewImg = styled.div`
  border-radius: 10px;
  overflow: hidden;
  height: 140px;
  background: rgba(255,255,255,0.05);
  img { width: 100%; height: 100%; object-fit: cover; }
`

const DropZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100px;
  border: 2px dashed rgba(255,255,255,0.1);
  border-radius: 10px;
  cursor: pointer;
  color: rgba(235,235,245,0.35);
  font-size: 13px;
  transition: border-color 150ms;
  &:hover { border-color: rgba(249,115,22,0.4); color: #f97316; }
  input { display: none; }
`

const FormFooter = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 4px;
`

/* ── Component ───────────────────────────────────────────────────────────── */

const emptyForm = (): PopupFormData => ({
  title: '',
  imageUrl: '',
  subtitle: '',
  cta: '',
  ctaUrl: '/produtos',
  isActive: true,
  delaySeconds: 3,
  cooldownHours: 24,
})

export default function PopupPage() {
  const [popups, setPopups] = useState<Popup[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Popup | null>(null)
  const [form, setForm] = useState<PopupFormData>(emptyForm())
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url')
  const [previewSrc, setPreviewSrc] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    popupService.getAll()
      .then(setPopups)
      .catch(() => setPopups([]))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm())
    setPreviewSrc('')
    setImageTab('url')
    setModalOpen(true)
  }

  const openEdit = (p: Popup) => {
    setEditing(p)
    setForm({
      title: p.title,
      imageUrl: p.imageUrl ?? '',
      subtitle: p.subtitle ?? '',
      cta: p.cta ?? '',
      ctaUrl: p.ctaUrl ?? '',
      isActive: p.isActive,
      delaySeconds: p.delaySeconds,
      cooldownHours: p.cooldownHours,
    })
    setPreviewSrc(getImageUrl(p.imageUrl ?? '') ?? '')
    setImageTab('url')
    setModalOpen(true)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((f) => ({ ...f, imageFile: file, imageUrl: file.name }))
    setPreviewSrc(URL.createObjectURL(file))
  }

  const handleUrlChange = (url: string) => {
    setForm((f) => ({ ...f, imageUrl: url, imageFile: undefined }))
    setPreviewSrc(url)
  }

  const handleSave = async () => {
    if (!form.title) { toast('Preencha o título', 'warning'); return }
    setSaving(true)
    try {
      if (editing) {
        const updated = await popupService.update(editing.id, form)
        setPopups((prev) => prev.map((p) => p.id === editing.id ? updated : p))
        toast('Popup atualizado', 'success')
      } else {
        const created = await popupService.create(form)
        setPopups((prev) => [created, ...prev])
        toast('Popup criado', 'success')
      }
      setModalOpen(false)
    } catch {
      toast('Erro ao salvar popup', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (p: Popup) => {
    if (!window.confirm(`Remover o popup "${p.title}"?`)) return
    try {
      await popupService.remove(p.id)
      setPopups((prev) => prev.filter((x) => x.id !== p.id))
      toast('Popup removido', 'success')
    } catch {
      toast('Erro ao remover popup', 'error')
    }
  }

  const toggleActive = async (p: Popup) => {
    try {
      const updated = await popupService.update(p.id, { ...p, isActive: !p.isActive })
      setPopups((prev) => prev.map((x) => x.id === p.id ? updated : x))
    } catch {
      toast('Erro ao atualizar popup', 'error')
    }
  }

  return (
    <>
      <PageHeader>
        <Title>Popups promocionais</Title>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus size={16} /> Novo popup
        </Button>
      </PageHeader>

      <Hint>
        Apenas um popup pode estar ativo por vez. O popup aparece para o visitante após o delay configurado,
        e só volta a aparecer após o cooldown (em horas).
      </Hint>

      {loading
        ? <Empty>Carregando...</Empty>
        : popups.length === 0
          ? <Empty>Nenhum popup criado. Clique em &quot;Novo popup&quot; para começar.</Empty>
          : (
            <PopupList>
              {popups.map((p) => {
                const img = getImageUrl(p.imageUrl ?? '')
                return (
                  <PopupCard key={p.id} $inactive={!p.isActive}>
                    {img
                      ? <PopupThumb><img src={img} alt={p.title} /></PopupThumb>
                      : <NoThumb>Sem imagem</NoThumb>
                    }
                    <PopupInfo>
                      <PopupTitle>
                        {p.title}
                        {p.isActive && <ActiveBadge style={{ marginLeft: 8 }}>Ativo</ActiveBadge>}
                      </PopupTitle>
                      <PopupMeta>
                        Delay: {p.delaySeconds}s · Cooldown: {p.cooldownHours}h
                        {p.ctaUrl ? ` · ${p.ctaUrl}` : ''}
                      </PopupMeta>
                    </PopupInfo>
                    <CardActions>
                      <IconBtn onClick={() => toggleActive(p)} title={p.isActive ? 'Desativar' : 'Ativar'}>
                        {p.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                      </IconBtn>
                      <IconBtn onClick={() => openEdit(p)} title="Editar">
                        <Edit2 size={15} />
                      </IconBtn>
                      <IconBtn $danger onClick={() => handleDelete(p)} title="Remover">
                        <Trash2 size={15} />
                      </IconBtn>
                    </CardActions>
                  </PopupCard>
                )
              })}
            </PopupList>
          )
      }

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar popup' : 'Novo popup'}
        size="md"
      >
        <FormBody>
          <FormRow>
            <Label>Imagem</Label>
            <ImageTabs>
              <TabBtn $active={imageTab === 'url'} onClick={() => setImageTab('url')}>
                <LinkIcon size={13} /> URL
              </TabBtn>
              <TabBtn $active={imageTab === 'upload'} onClick={() => setImageTab('upload')}>
                <Upload size={13} /> Upload S3
              </TabBtn>
            </ImageTabs>

            {imageTab === 'url' ? (
              <FieldInput
                placeholder="https://exemplo.com/imagem.jpg"
                value={form.imageUrl ?? ''}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            ) : (
              <DropZone>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} />
                <Upload size={20} />
                <span>Clique para selecionar (vai para S3)</span>
              </DropZone>
            )}

            {previewSrc && (
              <PreviewImg>
                <img src={previewSrc} alt="preview" onError={() => setPreviewSrc('')} />
              </PreviewImg>
            )}
          </FormRow>

          <FormRow>
            <Label>Título *</Label>
            <FieldInput
              placeholder="Ex: Ganhe 10% na primeira compra"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </FormRow>

          <FormRow>
            <Label>Subtítulo</Label>
            <FieldInput
              placeholder="Ex: Use o código BEMVINDO no checkout"
              value={form.subtitle ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            />
          </FormRow>

          <FormRow style={{ flexDirection: 'row', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Label>Botão (texto)</Label>
              <FieldInput
                placeholder="Ver produtos"
                value={form.cta ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Botão (URL)</Label>
              <FieldInput
                placeholder="/produtos"
                value={form.ctaUrl ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, ctaUrl: e.target.value }))}
              />
            </div>
          </FormRow>

          <FormRow style={{ flexDirection: 'row', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Label>Delay (segundos)</Label>
              <FieldInput
                type="number" min={0} max={60}
                value={form.delaySeconds ?? 3}
                onChange={(e) => setForm((f) => ({ ...f, delaySeconds: Number(e.target.value) }))}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Cooldown (horas)</Label>
              <FieldInput
                type="number" min={0}
                value={form.cooldownHours ?? 24}
                onChange={(e) => setForm((f) => ({ ...f, cooldownHours: Number(e.target.value) }))}
              />
            </div>
          </FormRow>
        </FormBody>

        <FormFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} loading={saving} disabled={!form.title}>
            {editing ? 'Salvar' : 'Criar'}
          </Button>
        </FormFooter>
      </Modal>
    </>
  )
}
