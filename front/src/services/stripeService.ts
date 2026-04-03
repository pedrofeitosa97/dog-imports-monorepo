import api from './api'

export interface PaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

export const stripeService = {
  createPaymentIntent: (amount: number, paymentMethod: 'card' | 'pix' | 'boleto') =>
    api
      .post<PaymentIntentResponse>('/stripe/payment-intent', { amount, paymentMethod })
      .then((r) => r.data),
}
