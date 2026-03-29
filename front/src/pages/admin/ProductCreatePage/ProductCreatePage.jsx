import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductForm from '../../../features/admin/ProductForm/ProductForm'
import { productService } from '../../../services/productService'
import { categoryService } from '../../../services/categoryService'
import styled from 'styled-components'

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 24px;
`

export default function ProductCreatePage() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    categoryService.getAll()
      .then(setCategories)
      .catch(() => setCategories([{ id: 1, name: 'Masculino' }, { id: 2, name: 'Feminino' }, { id: 3, name: 'Unissex' }]))
  }, [])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (key === 'images') {
          val.forEach((img) => { if (img.file) formData.append('images', img.file) })
        } else {
          formData.append(key, val)
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
