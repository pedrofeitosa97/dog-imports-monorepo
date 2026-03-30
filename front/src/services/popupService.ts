import api from './api'
import type { Popup, PopupFormData } from '../types/api'

function toFormData(data: PopupFormData): FormData {
  const fd = new FormData()
  if (data.imageFile) fd.append('image', data.imageFile)
  if (data.imageUrl)  fd.append('imageUrl', data.imageUrl)
  fd.append('title', data.title)
  if (data.subtitle)                    fd.append('subtitle', data.subtitle)
  if (data.cta)                         fd.append('cta', data.cta)
  if (data.ctaUrl)                      fd.append('ctaUrl', data.ctaUrl)
  if (data.isActive !== undefined)      fd.append('isActive', String(data.isActive))
  if (data.delaySeconds !== undefined)  fd.append('delaySeconds', String(data.delaySeconds))
  if (data.cooldownHours !== undefined) fd.append('cooldownHours', String(data.cooldownHours))
  return fd
}

export const popupService = {
  getActive(): Promise<Popup | null> {
    return api.get<Popup | null>('/popups/active').then((r) => r.data)
  },

  getAll(): Promise<Popup[]> {
    return api.get<Popup[]>('/popups').then((r) => r.data)
  },

  create(data: PopupFormData): Promise<Popup> {
    return api.post<Popup>('/popups', toFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  update(id: number, data: PopupFormData): Promise<Popup> {
    return api.put<Popup>(`/popups/${id}`, toFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  remove(id: number): Promise<void> {
    return api.delete(`/popups/${id}`).then(() => undefined)
  },
}
