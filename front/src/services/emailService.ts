import api from './api'

export interface EmailSettings {
  email_from_name: string
  email_from_address: string
  email_order_subject: string
  email_order_template: string
  email_status_subject: string
  email_status_template: string
}

export const emailService = {
  getStatus: () =>
    api.get<{ configured: boolean }>('/email/status').then((r) => r.data),

  getSettings: () =>
    api.get<EmailSettings>('/email/settings').then((r) => r.data),

  saveSettings: (data: Partial<EmailSettings>) =>
    api.put<{ ok: boolean }>('/email/settings', data).then((r) => r.data),

  sendOrderEmail: (orderId: number) =>
    api.post<{ ok: boolean; message: string }>(`/email/send-order/${orderId}`).then((r) => r.data),

  sendTest: (to: string) =>
    api.post<{ ok: boolean; message: string }>('/email/send-test', { to }).then((r) => r.data),
}
