import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import { Plus, Trash2, GripVertical, Upload, Link as LinkIcon, Eye, EyeOff, Info } from 'lucide-react'
import styled from 'styled-components'
import Button from '../../../ui/Button/Button'
import Modal from '../../../ui/Modal/Modal'
import { bannerService } from '../../../services/bannerService'
import { useToast } from '../../../hooks/useToast'
import { getImageUrl } from '../../../utils/getImageUrl'
import type { Banner, BannerFormData } from '../../../types/api'

/* ── Styles ─────────────────────────────────────────────────────────────── */

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

const BannerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const BannerCard = styled.div<{ $inactive?: boolean }>`
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

const DragHandle = styled.div`
  color: rgba(255,255,255,0.2);
  cursor: grab;
  flex-shrink: 0;
`

const BannerThumb = styled.div`
  width: 120px;
  height: 68px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const NoThumb = styled.div`
  width: 120px;
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

const BannerInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const BannerTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #f5f5f7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 2px;
`

const BannerSub = styled.p`
  font-size: 12px;
  color: rgba(235,235,245,0.35);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* ── Form modal ──────────────────────────────────────────────────────────── */

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

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const ImageTabs = styled.div`
  display: flex;
  gap: 8px;
`

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
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  height: 140px;
  background: rgba(255,255,255,0.05);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

const HintBox = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(249,115,22,0.07);
  border-radius: 8px;
  font-size: 12px;
  color: rgba(249,115,22,0.85);
  line-height: 1.55;
  svg { flex-shrink: 0; margin-top: 1px; }
`

const PageSubtitle = styled.p`
  font-size: 12px;
  color: rgba(235,235,245,0.35);
  margin: -16px 0 24px;
`

/* ── Component ───────────────────────────────────────────────────────────── */

const emptyForm = (): BannerFormData => ({
  imageUrl: '',
  eyebrow: '',
  title: '',
  subtitle: '',
  cta: 'Ver coleção',
  ctaUrl: '/produtos',
  order: 0,
  isActive: true,
})

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState<BannerFormData>(emptyForm())
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url')
  const [previewSrc, setPreviewSrc] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    bannerService.getAll()
      .then(setBanners)
      .catch(() => setBanners([]))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm())
    setPreviewSrc('')
    setImageTab('url')
    setModalOpen(true)
  }

  const openEdit = (b: Banner) => {
    setEditing(b)
    setForm({
      imageUrl: b.imageUrl,
      eyebrow: b.eyebrow ?? '',
      title: b.title,
      subtitle: b.subtitle ?? '',
      cta: b.cta,
      ctaUrl: b.ctaUrl,
      order: b.order,
      isActive: b.isActive,
    })
    setPreviewSrc(getImageUrl(b.imageUrl) ?? '')
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
    if (!form.title || !form.imageUrl) {
      toast('Preencha o título e a imagem', 'warning')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const updated = await bannerService.update(editing.id, form)
        setBanners((prev) => prev.map((b) => b.id === editing.id ? updated : b))
        toast('Banner atualizado', 'success')
      } else {
        const created = await bannerService.create(form)
        setBanners((prev) => [...prev, created])
        toast('Banner criado', 'success')
      }
      setModalOpen(false)
    } catch {
      toast('Erro ao salvar banner', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (b: Banner) => {
    if (!window.confirm(`Remover o banner "${b.title}"?`)) return
    try {
      await bannerService.remove(b.id)
      setBanners((prev) => prev.filter((x) => x.id !== b.id))
      toast('Banner removido', 'success')
    } catch {
      toast('Erro ao remover banner', 'error')
    }
  }

  const toggleActive = async (b: Banner) => {
    try {
      const updated = await bannerService.update(b.id, { ...b, isActive: !b.isActive })
      setBanners((prev) => prev.map((x) => x.id === b.id ? updated : x))
    } catch {
      toast('Erro ao atualizar banner', 'error')
    }
  }

  return (
    <>
      <PageHeader>
        <Title>Banners da homepage</Title>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus size={16} /> Novo banner
        </Button>
      </PageHeader>
      <PageSubtitle>Resolução mínima recomendada: 1440 × 520px · Proporção 16:4 · JPG ou WEBP</PageSubtitle>

      {loading
        ? <Empty>Carregando...</Empty>
        : banners.length === 0
          ? <Empty>Nenhum banner cadastrado. Clique em &quot;Novo banner&quot; para começar.</Empty>
          : (
            <BannerList>
              {banners.map((b) => {
                const img = getImageUrl(b.imageUrl)
                return (
                  <BannerCard key={b.id} $inactive={!b.isActive}>
                    <DragHandle><GripVertical size={18} /></DragHandle>

                    {img
                      ? <BannerThumb><img src={img} alt={b.title} /></BannerThumb>
                      : <NoThumb>Sem imagem</NoThumb>
                    }

                    <BannerInfo>
                      <BannerTitle>{b.title}</BannerTitle>
                      <BannerSub>{b.eyebrow || b.ctaUrl}</BannerSub>
                    </BannerInfo>

                    <CardActions>
                      <IconBtn onClick={() => toggleActive(b)} title={b.isActive ? 'Ocultar' : 'Mostrar'}>
                        {b.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                      </IconBtn>
                      <IconBtn onClick={() => openEdit(b)}>
                        <Upload size={15} />
                      </IconBtn>
                      <IconBtn $danger onClick={() => handleDelete(b)}>
                        <Trash2 size={15} />
                      </IconBtn>
                    </CardActions>
                  </BannerCard>
                )
              })}
            </BannerList>
          )
      }

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar banner' : 'Novo banner'}
        size="md"
      >
        <FormBody>
          {/* Imagem */}
          <FormRow>
            <Label>Imagem</Label>
            <HintBox>
              <Info size={14} />
              <span>Mínimo recomendado: <strong>1440 × 520px</strong>, proporção 16:4. Use JPG ou WEBP para melhor performance. A imagem é exibida com <em>object-fit: cover</em>, então evite elementos importantes nas bordas.</span>
            </HintBox>
            <ImageSection>
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
                  value={form.imageUrl}
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
            </ImageSection>
          </FormRow>

          {/* Texto */}
          <FormRow>
            <Label>Eyebrow (texto pequeno acima do título)</Label>
            <FieldInput placeholder="Ex: Nova coleção 2025" value={form.eyebrow ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))} />
          </FormRow>
          <FormRow>
            <Label>Título *</Label>
            <FieldInput placeholder="Ex: Estilo que fala por você" value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </FormRow>
          <FormRow>
            <Label>Subtítulo</Label>
            <FieldInput placeholder="Ex: As melhores marcas importadas..." value={form.subtitle ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} />
          </FormRow>

          {/* CTA */}
          <FormRow style={{ flexDirection: 'row', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Label>Botão (texto)</Label>
              <FieldInput placeholder="Ver coleção" value={form.cta ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))} />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Botão (URL)</Label>
              <FieldInput placeholder="/produtos" value={form.ctaUrl ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, ctaUrl: e.target.value }))} />
            </div>
          </FormRow>

          <FormRow style={{ flexDirection: 'row', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Label>Ordem</Label>
              <FieldInput type="number" min={0} value={form.order ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} />
            </div>
          </FormRow>
        </FormBody>

        <FormFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} loading={saving} disabled={!form.title || !form.imageUrl}>
            {editing ? 'Salvar' : 'Criar'}
          </Button>
        </FormFooter>
      </Modal>
    </>
  )
}
