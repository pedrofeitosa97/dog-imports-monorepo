import api from './api'
import type { Banner, BannerFormData } from '../types/api'

function toFormData(data: BannerFormData): FormData {
  const fd = new FormData()
  if (data.imageFile) fd.append('image', data.imageFile)
  fd.append('imageUrl', data.imageUrl)
  fd.append('title', data.title)
  if (data.eyebrow)  fd.append('eyebrow', data.eyebrow)
  if (data.subtitle) fd.append('subtitle', data.subtitle)
  if (data.cta)      fd.append('cta', data.cta)
  if (data.ctaUrl)   fd.append('ctaUrl', data.ctaUrl)
  if (data.order !== undefined) fd.append('order', String(data.order))
  if (data.isActive !== undefined) fd.append('isActive', String(data.isActive))
  return fd
}

export const bannerService = {
  getActive(): Promise<Banner[]> {
    return api.get<Banner[]>('/banners').then((r) => r.data)
  },

  getAll(): Promise<Banner[]> {
    return api.get<Banner[]>('/banners/admin').then((r) => r.data)
  },

  create(data: BannerFormData): Promise<Banner> {
    return api.post<Banner>('/banners', toFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  update(id: number, data: BannerFormData): Promise<Banner> {
    return api.put<Banner>(`/banners/${id}`, toFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  remove(id: number): Promise<void> {
    return api.delete(`/banners/${id}`).then(() => undefined)
  },
}
