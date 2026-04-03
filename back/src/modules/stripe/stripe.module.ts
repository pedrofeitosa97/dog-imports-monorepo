import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
