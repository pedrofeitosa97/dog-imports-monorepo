import { IsNumber, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({ description: 'Valor total do pedido em BRL', example: 299.90 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: ['card', 'pix', 'boleto'] })
  @IsIn(['card', 'pix', 'boleto'])
  paymentMethod: 'card' | 'pix' | 'boleto';
}
