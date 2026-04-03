import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const StripeSDK = require('stripe');

export type StripePaymentMethod = 'card' | 'pix' | 'boleto';

export interface PaymentIntentResult {
  id: string;
  client_secret: string;
  status: string;
  next_action: Record<string, unknown> | null;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly sdk: any;
  private readonly webhookSecret: string | null;

  constructor(private config: ConfigService) {
    this.sdk = new StripeSDK(config.getOrThrow<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-03-31.basil',
    });
    this.webhookSecret = config.get<string>('STRIPE_WEBHOOK_SECRET') ?? null;
  }

  async createPaymentIntent(
    amountBRL: number,
    method: StripePaymentMethod,
    metadata: Record<string, string> = {},
  ): Promise<PaymentIntentResult> {
    const params: Record<string, unknown> = {
      amount: Math.round(amountBRL * 100),
      currency: 'brl',
      payment_method_types: [method],
      metadata,
    };

    if (method === 'boleto') {
      params.payment_method_options = { boleto: { expires_after_days: 3 } };
    }

    return this.sdk.paymentIntents.create(params);
  }

  constructWebhookEvent(rawBody: Buffer, signature: string): Record<string, unknown> {
    if (!this.webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET não configurada');
    }
    return this.sdk.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
  }
}
