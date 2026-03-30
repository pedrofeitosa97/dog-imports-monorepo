import api from './api'
import type { SiteSettings } from '../types/api'

export const settingsService = {
  getAll(): Promise<SiteSettings> {
    return api.get<SiteSettings>('/settings').then((r) => r.data)
  },

  setValue(key: string, value: string): Promise<SiteSettings> {
    return api.put<SiteSettings>(`/settings/${key}`, { value }).then((r) => r.data)
  },

  uploadImage(key: string, file: File): Promise<SiteSettings> {
    const fd = new FormData()
    fd.append('image', file)
    return api.put<SiteSettings>(`/settings/${key}/upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },
}
