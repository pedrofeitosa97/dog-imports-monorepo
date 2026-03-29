import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../../features/admin/ProductForm/ProductForm'
import Spinner from '../../../ui/Spinner/Spinner'
import { productService } from '../../../services/productService'
import { categoryService } from '../../../services/categoryService'
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
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      productService.getById(id),
      categoryService.getAll().catch(() => [{ id: 1, name: 'Masculino' }, { id: 2, name: 'Feminino' }]),
    ]).then(([prod, cats]) => {
      setProduct({ ...prod, images: prod.images?.map((url) => ({ url, preview: url })) || [] })
      setCategories(cats)
    }).catch(() => {
      setProduct({ name: '', slug: '', description: '', price: '', originalPrice: '', stock: '', brand: '', category: '', isActive: true, isFeatured: false, images: [] })
    }).finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (values) => {
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (key === 'images') {
          val.forEach((img) => { if (img.file) formData.append('newImages', img.file) })
          const existingUrls = val.filter((img) => img.url && !img.file).map((img) => img.url)
          formData.append('existingImages', JSON.stringify(existingUrls))
        } else {
          formData.append(key, val)
        }
      })
      await productService.update(id, formData)
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
      <ProductForm initialValues={product} categories={categories} onSubmit={handleSubmit} loading={saving} mode="edit" />
    </>
  )
}
