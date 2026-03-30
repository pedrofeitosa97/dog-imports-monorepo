import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../../features/admin/ProductForm/ProductForm'
import Spinner from '../../../ui/Spinner/Spinner'
import { productService } from '../../../services/productService'
import { categoryService } from '../../../services/categoryService'
import type { Category } from '../../../types/api'
import type { ProductFormValues, SizeRow } from '../../../features/admin/ProductForm/ProductForm'
import styled from 'styled-components'

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 24px;
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px;
`

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductFormValues | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      productService.getById(Number(id)),
      categoryService.getAll().catch(() => [
        { id: 1, name: 'Masculino', slug: 'masculino' },
        { id: 2, name: 'Feminino', slug: 'feminino' },
      ]),
    ]).then(([prod, cats]) => {
      const catValue = typeof prod.category === 'object' && prod.category !== null
        ? (prod.category as { id?: number }).id ?? ''
        : prod.category ?? ''
      const loadedSizes: SizeRow[] = (prod.sizes ?? []).map((s: { label: string; stock?: number; available?: boolean }) => ({
        label: s.label,
        stock: s.stock ?? 0,
        available: s.available ?? true,
      }))
      setProduct({
        name: prod.name ?? '',
        slug: prod.slug ?? '',
        description: prod.description ?? '',
        price: String(prod.price ?? ''),
        originalPrice: prod.originalPrice != null ? String(prod.originalPrice) : '',
        stock: String(prod.stock ?? ''),
        brand: prod.brand ?? '',
        gender: prod.gender ?? '',
        category: catValue,
        sizes: loadedSizes,
        isActive: prod.isActive ?? true,
        isFeatured: prod.isFeatured ?? false,
        isPromotion: prod.isPromotion ?? false,
        images: (prod.images ?? []).map((url: string) => ({ url, preview: url })),
      })
      setCategories(cats)
    }).catch(() => {
      setProduct({ name: '', slug: '', description: '', price: '', originalPrice: '', stock: '', brand: '', gender: '', category: '', sizes: [], isActive: true, isFeatured: false, isPromotion: false, images: [] })
    }).finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (values: ProductFormValues) => {
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (key === 'images') {
          const imgs = val as Array<{ file?: File; url?: string }>
          imgs.forEach((img) => { if (img.file) formData.append('images', img.file) })
          const existingUrls = imgs.filter((img) => img.url && !img.file).map((img) => img.url!)
          formData.append('existingImages', JSON.stringify(existingUrls))
        } else if (key === 'category') {
          const catId = typeof val === 'object' && val !== null ? (val as { id?: number }).id : val
          if (catId != null && catId !== '') formData.append('categoryId', String(catId))
        } else if (key === 'sizes') {
          formData.append('sizes', JSON.stringify(val))
        } else if (key === 'stock' && values.sizes.length > 0) {
          const total = values.sizes.reduce((acc, s) => acc + (Number(s.stock) || 0), 0)
          formData.append('stock', String(total))
        } else if (val == null) {
          // não envia null/undefined
        } else {
          formData.append(key, String(val))
        }
      })
      await productService.update(Number(id), formData)
      navigate('/admin/produtos')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Center><Spinner size="lg" color="#fff" /></Center>

  return (
    <>
      <Title>Editar produto</Title>
      <ProductForm initialValues={product ?? undefined} categories={categories} onSubmit={handleSubmit} loading={saving} mode="edit" />
    </>
  )
}
