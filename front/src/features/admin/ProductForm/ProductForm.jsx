import { useState, useEffect } from 'react'
import { slugify } from '../../../utils/slugify'
import Input from '../../../ui/Input/Input'
import Select from '../../../ui/Select/Select'
import Button from '../../../ui/Button/Button'
import ImageUploader from '../ImageUploader/ImageUploader'
import { FormWrapper, FormGrid, FormGroup, FormLabel, FormSection, SectionTitle, ActionsRow, TextArea, ToggleRow, ToggleLabel } from './ProductForm.styles'

export default function ProductForm({ initialValues = {}, onSubmit, categories = [], loading = false, mode = 'create' }) {
  const [values, setValues] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    brand: '',
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

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(values)
  }

  const handleAddImages = (newImages) => {
    set('images', [...values.images, ...newImages])
  }

  const handleRemoveImage = (idx) => {
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
          <Input label="Nome" value={values.name} onChange={(e) => set('name', e.target.value)} fullWidth dark required />
          <Input label="Slug (URL)" value={values.slug} onChange={(e) => set('slug', e.target.value)} fullWidth dark required />
          <Input label="Marca" value={values.brand} onChange={(e) => set('brand', e.target.value)} fullWidth dark required />
          <Select
            label="Categoria"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={values.category}
            onChange={(e) => set('category', e.target.value)}
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
          <Input label="Preço (R$)" type="number" value={values.price} onChange={(e) => set('price', e.target.value)} prefix="R$" fullWidth dark required />
          <Input label="Preço original (R$)" type="number" value={values.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} prefix="R$" fullWidth dark />
          <Input label="Estoque" type="number" value={values.stock} onChange={(e) => set('stock', e.target.value)} fullWidth dark required />
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
