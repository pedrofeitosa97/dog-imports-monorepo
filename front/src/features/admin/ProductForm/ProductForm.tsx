import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { slugify } from '../../../utils/slugify'
import Input from '../../../ui/Input/Input'
import Select from '../../../ui/Select/Select'
import Button from '../../../ui/Button/Button'
import ImageUploader, { type ImagePreview } from '../ImageUploader/ImageUploader'
import type { Category } from '../../../types/api'
import {
  FormWrapper, FormGrid, FormGroup, FormLabel, FormSection,
  SectionTitle, ActionsRow, TextArea, ToggleRow, ToggleLabel,
} from './ProductForm.styles'

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
  isActive: boolean
  isFeatured: boolean
  images: ImagePreview[]
}

const GENDER_OPTIONS = [
  { value: '', label: 'Selecione...' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'unissex', label: 'Unissex' },
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
    gender: '',
    category: '',
    isActive: true,
    isFeatured: false,
    images: [],
    ...initialValues,
  })

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
          <Input label="Nome" value={values.name} onChange={(e: ChangeEvent<HTMLInputElement>) => set('name', e.target.value)} fullWidth dark required />
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
          <Input label="Estoque" type="number" value={values.stock} onChange={(e: ChangeEvent<HTMLInputElement>) => set('stock', e.target.value)} fullWidth dark required />
        </FormGrid>
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
      </FormSection>

      <ActionsRow>
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          {mode === 'create' ? 'Criar produto' : 'Salvar alterações'}
        </Button>
      </ActionsRow>
    </FormWrapper>
  )
}
