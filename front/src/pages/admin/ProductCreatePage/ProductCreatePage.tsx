import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductForm from '../../../features/admin/ProductForm/ProductForm'
import { productService } from '../../../services/productService'
import { categoryService } from '../../../services/categoryService'
import type { Category } from '../../../types/api'
import type { ProductFormValues } from '../../../features/admin/ProductForm/ProductForm'
import styled from 'styled-components'

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 24px;
`

export default function ProductCreatePage() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    categoryService.getAll()
      .then(setCategories)
      .catch(() => setCategories([
        { id: 1, name: 'Masculino', slug: 'masculino' },
        { id: 2, name: 'Feminino', slug: 'feminino' },
        { id: 3, name: 'Unissex', slug: 'unissex' },
      ]))
  }, [])

  const handleSubmit = async (values: ProductFormValues) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (key === 'images') {
          const imgs = val as Array<{ file?: File; url?: string }>
          imgs.forEach((img) => { if (img.file) formData.append('images', img.file) })
        } else if (key === 'category') {
          const catId = typeof val === 'object' && val !== null ? (val as { id?: number }).id : val
          if (catId != null && catId !== '') formData.append('categoryId', String(catId))
        } else if (val == null) {
          // não envia null/undefined
        } else {
          formData.append(key, String(val))
        }
      })
      await productService.create(formData)
      navigate('/admin/produtos')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Title>Novo produto</Title>
      <ProductForm categories={categories} onSubmit={handleSubmit} loading={loading} mode="create" />
    </>
  )
}
