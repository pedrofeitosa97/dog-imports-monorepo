import api from './api'

export const authService = {
  login(email, password) {
    return api.post('/auth/login', { email, password }).then((r) => r.data)
  },

  me() {
    return api.get('/auth/me').then((r) => r.data)
  },

  logout() {
    return api.post('/auth/logout').then((r) => r.data)
  },
}
