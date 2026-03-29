import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Camisetas' })
  @IsString()
  @MinLength(2)
  name: string;
}
