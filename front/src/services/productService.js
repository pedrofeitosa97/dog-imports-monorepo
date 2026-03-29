import api from './api'

export const productService = {
  getAll(params) {
    return api.get('/products', { params }).then((r) => r.data)
  },

  getBySlug(slug) {
    return api.get(`/products/${slug}`).then((r) => r.data)
  },

  getById(id) {
    return api.get(`/products/${id}`).then((r) => r.data)
  },

  create(formData) {
    return api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  update(id, formData) {
    return api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  remove(id) {
    return api.delete(`/products/${id}`).then((r) => r.data)
  },

  getFeatured() {
    return api.get('/products/featured').then((r) => r.data)
  },
}
