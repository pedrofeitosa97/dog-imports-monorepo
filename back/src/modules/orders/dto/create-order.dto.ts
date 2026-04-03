import { IsString, IsEmail, IsNumber, IsArray, ValidateNested, IsOptional, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsString()
  productName: string;

  @IsString()
  productBrand: string;

  @IsOptional()
  @IsString()
  productImage?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  customerName: string;

  @ApiProperty()
  @IsEmail()
  customerEmail: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ enum: ['cartao', 'pix', 'boleto'] })
  @IsIn(['cartao', 'pix', 'boleto'])
  paymentMethod: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiProperty({ required: false, description: 'ID do PaymentIntent Stripe (cartão/pix/boleto)' })
  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
