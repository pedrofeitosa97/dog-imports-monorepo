import {
  Controller, Post, Body, Headers, Req,
  BadRequestException, Logger, HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { OrdersService } from '../orders/orders.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(
    private stripeService: StripeService,
    private ordersService: OrdersService,
  ) {}

  @Public()
  @Post('payment-intent')
  @ApiOperation({ summary: 'Cria um PaymentIntent Stripe' })
  async createPaymentIntent(@Body() dto: CreatePaymentIntentDto) {
    const intent = await this.stripeService.createPaymentIntent(
      dto.amount,
      dto.paymentMethod,
    );
    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    };
  }

  @Public()
  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook Stripe (uso interno)' })
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!req.rawBody) throw new BadRequestException('Raw body não disponível');

    let event: Record<string, unknown>;
    try {
      event = this.stripeService.constructWebhookEvent(req.rawBody, signature);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Webhook inválido';
      this.logger.error('Stripe webhook error', msg);
      throw new BadRequestException(msg);
    }

    const type = event.type as string;
    const pi = (event.data as Record<string, unknown>)?.object as Record<string, string>;

    if (type === 'payment_intent.succeeded') {
      await this.ordersService.updatePaymentStatus(pi.id, 'paid');
      this.logger.log(`PaymentIntent ${pi.id} pago`);
    } else if (type === 'payment_intent.payment_failed') {
      await this.ordersService.updatePaymentStatus(pi.id, 'failed');
      this.logger.warn(`PaymentIntent ${pi.id} falhou`);
    }

    return { received: true };
  }
}
