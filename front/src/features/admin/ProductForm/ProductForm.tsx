import { useState, useEffect, type FormEvent, type ChangeEvent, type FocusEvent } from 'react'
import { X, Plus } from 'lucide-react'
import { slugify } from '../../../utils/slugify'
import Input from '../../../ui/Input/Input'
import Select from '../../../ui/Select/Select'
import Button from '../../../ui/Button/Button'
import ImageUploader, { type ImagePreview } from '../ImageUploader/ImageUploader'
import type { Category } from '../../../types/api'
import {
  FormWrapper, FormGrid, FormGroup, FormLabel, FormSection,
  SectionTitle, ActionsRow, TextArea, ToggleRow, ToggleLabel,
  PresetGroup, PresetGroupLabel, PresetChips, PresetChip,
  SizeList, SizeRow, SizeBadge, SizeStockInput, SizeAvailToggle,
  SizeRemoveBtn, AddCustomRow, AddCustomInput, StockSummary,
} from './ProductForm.styles'

export interface SizeRow {
  label: string
  stock: number
  available: boolean
}

export interface ProductFormValues {
  name: string
  slug: string
  description: string
  price: string
  originalPrice: string
  stock: string
  brand: string
  gender: string
  category: string | number
  sizes: SizeRow[]
  isActive: boolean
  isFeatured: boolean
  isPromotion: boolean
  images: ImagePreview[]
}

const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
]

const SIZE_PRESETS = [
  { label: 'Roupas', sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'] },
  { label: 'Calçados', sizes: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'] },
  { label: 'Infantil', sizes: ['2', '4', '6', '8', '10', '12', '14', '16'] },
]

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>
  onSubmit: (values: ProductFormValues) => void
  categories?: Category[]
  loading?: boolean
  mode?: 'create' | 'edit'
}

export default function ProductForm({
  initialValues = {},
  onSubmit,
  categories = [],
  loading = false,
  mode = 'create',
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    brand: '',
    gender: 'masculino',
    category: '',
    sizes: [],
    isActive: true,
    isFeatured: false,
    isPromotion: false,
    images: [],
    ...initialValues,
  })
  const [customLabel, setCustomLabel] = useState('')

  useEffect(() => {
    if (mode === 'create' && values.name) {
      setValues((v) => ({ ...v, slug: slugify(v.name) }))
    }
  }, [values.name, mode])

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  const handleAddImages = (newImages: ImagePreview[]) => {
    set('images', [...values.images, ...newImages])
  }

  const handleRemoveImage = (idx: number) => {
    set('images', values.images.filter((_, i) => i !== idx))
  }

  /* ── size helpers ──────────────────────────────────────────────────────── */

  const hasSize = (label: string) => values.sizes.some((s) => s.label === label)

  const togglePreset = (label: string) => {
    if (hasSize(label)) {
      set('sizes', values.sizes.filter((s) => s.label !== label))
    } else {
      set('sizes', [...values.sizes, { label, stock: 0, available: true }])
    }
  }

  const addCustom = () => {
    const label = customLabel.trim().toUpperCase()
    if (!label || hasSize(label)) return
    set('sizes', [...values.sizes, { label, stock: 0, available: true }])
    setCustomLabel('')
  }

  const updateSize = (idx: number, patch: Partial<SizeRow>) => {
    set('sizes', values.sizes.map((s, i) => i === idx ? { ...s, ...patch } : s))
  }

  const removeSize = (idx: number) => {
    set('sizes', values.sizes.filter((_, i) => i !== idx))
  }

  const totalSizeStock = values.sizes.reduce((acc, s) => acc + (Number(s.stock) || 0), 0)

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <FormSection>
        <SectionTitle>Fotos do produto</SectionTitle>
        <ImageUploader
          images={values.images}
          onAdd={handleAddImages}
          onRemove={handleRemoveImage}
        />
      </FormSection>

      <FormSection>
        <SectionTitle>Informações básicas</SectionTitle>
        <FormGrid>
          <Input label="Nome" value={values.name} onChange={(e: ChangeEvent<HTMLInputElement>) => set('name', e.target.value)} onFocus={(e: FocusEvent<HTMLInputElement>) => { const len = e.target.value.length; e.target.setSelectionRange(len, len) }} fullWidth dark required />
          <Input label="Slug (URL)" value={values.slug} onChange={(e: ChangeEvent<HTMLInputElement>) => set('slug', e.target.value)} fullWidth dark required />
          <Input label="Marca" value={values.brand} onChange={(e: ChangeEvent<HTMLInputElement>) => set('brand', e.target.value)} fullWidth dark required />
          <Select
            label="Categoria"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={values.category}
            onChange={(e) => set('category', e.target.value)}
            fullWidth
            dark
          />
          <Select
            label="Público-alvo"
            options={GENDER_OPTIONS}
            value={values.gender}
            onChange={(e) => set('gender', e.target.value)}
            fullWidth
            dark
          />
        </FormGrid>
        <FormGroup>
          <FormLabel htmlFor="description">Descrição</FormLabel>
          <TextArea
            id="description"
            rows={4}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </FormGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>Preço e estoque</SectionTitle>
        <FormGrid>
          <Input label="Preço (R$)" type="number" value={values.price} onChange={(e: ChangeEvent<HTMLInputElement>) => set('price', e.target.value)} prefix="R$" fullWidth dark required />
          <Input label="Preço original (R$)" type="number" value={values.originalPrice} onChange={(e: ChangeEvent<HTMLInputElement>) => set('originalPrice', e.target.value)} prefix="R$" fullWidth dark />
          <Input
            label={values.sizes.length > 0 ? 'Estoque geral (fallback)' : 'Estoque'}
            type="number"
            value={values.sizes.length > 0 ? String(totalSizeStock) : values.stock}
            onChange={(e: ChangeEvent<HTMLInputElement>) => set('stock', e.target.value)}
            fullWidth
            dark
            required={values.sizes.length === 0}
            disabled={values.sizes.length > 0}
          />
        </FormGrid>
        {values.sizes.length > 0 && (
          <StockSummary>Estoque total calculado automaticamente pela soma dos tamanhos: {totalSizeStock} unidades</StockSummary>
        )}
      </FormSection>

      <FormSection>
        <SectionTitle>Tamanhos e estoque por tamanho</SectionTitle>

        {/* Presets */}
        {SIZE_PRESETS.map((group) => (
          <PresetGroup key={group.label}>
            <PresetGroupLabel>{group.label}</PresetGroupLabel>
            <PresetChips>
              {group.sizes.map((s) => (
                <PresetChip key={s} $added={hasSize(s)} type="button" onClick={() => togglePreset(s)}>
                  {s}
                </PresetChip>
              ))}
            </PresetChips>
          </PresetGroup>
        ))}

        {/* Custom size */}
        <AddCustomRow>
          <AddCustomInput
            placeholder="Ex: XXXG, 45…"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
          />
          <Button type="button" variant="ghost" size="sm" onClick={addCustom} disabled={!customLabel.trim()}>
            <Plus size={14} /> Adicionar
          </Button>
        </AddCustomRow>

        {/* Size list */}
        {values.sizes.length > 0 && (
          <SizeList>
            {values.sizes.map((s, idx) => (
              <SizeRow key={s.label}>
                <SizeBadge>{s.label}</SizeBadge>
                <SizeStockInput
                  type="number"
                  min={0}
                  value={s.stock}
                  onChange={(e) => updateSize(idx, { stock: Math.max(0, Number(e.target.value)) })}
                  title="Estoque deste tamanho"
                />
                <SizeAvailToggle>
                  <input
                    type="checkbox"
                    checked={s.available}
                    onChange={(e) => updateSize(idx, { available: e.target.checked })}
                  />
                  Disponível
                </SizeAvailToggle>
                <SizeRemoveBtn type="button" onClick={() => removeSize(idx)} title="Remover tamanho">
                  <X size={14} />
                </SizeRemoveBtn>
              </SizeRow>
            ))}
          </SizeList>
        )}
      </FormSection>

      <FormSection>
        <SectionTitle>Visibilidade</SectionTitle>
        <ToggleRow>
          <input type="checkbox" id="isActive" checked={values.isActive} onChange={(e) => set('isActive', e.target.checked)} />
          <ToggleLabel htmlFor="isActive">Produto ativo (visível na loja)</ToggleLabel>
        </ToggleRow>
        <ToggleRow>
          <input type="checkbox" id="isFeatured" checked={values.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} />
          <ToggleLabel htmlFor="isFeatured">Produto em destaque</ToggleLabel>
        </ToggleRow>
        <ToggleRow>
          <input type="checkbox" id="isPromotion" checked={values.isPromotion} onChange={(e) => set('isPromotion', e.target.checked)} />
          <ToggleLabel htmlFor="isPromotion">Produto em promoção (aparece na aba Promoções)</ToggleLabel>
        </ToggleRow>
      </FormSection>

      <ActionsRow>
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          {mode === 'create' ? 'Criar produto' : 'Salvar alterações'}
        </Button>
      </ActionsRow>
    </FormWrapper>
  )
}
