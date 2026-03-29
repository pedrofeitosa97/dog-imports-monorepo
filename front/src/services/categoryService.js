import api from './api'

export const categoryService = {
  getAll() {
    return api.get('/categories').then((r) => r.data)
  },

  create(data) {
    return api.post('/categories', data).then((r) => r.data)
  },

  update(id, data) {
    return api.put(`/categories/${id}`, data).then((r) => r.data)
  },

  remove(id) {
    return api.delete(`/categories/${id}`).then((r) => r.data)
  },
}
