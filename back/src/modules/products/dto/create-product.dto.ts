import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SizeDto {
  label: string;
  available: boolean;
}

export class ColorDto {
  name: string;
  hex: string;
  available: boolean;
}

const parseBool = ({ value }: any) => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return value;
};

const parseJson = ({ value }: any) => {
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return []; }
  }
  return value ?? [];
};

export class CreateProductDto {
  @ApiProperty({ example: 'Camiseta Nike Dri-FIT' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Nike' })
  @IsString()
  brand: string;

  @ApiPropertyOptional({ example: 'unissex', enum: ['masculino', 'feminino', 'unissex'] })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 189.9 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 249.9 })
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  originalPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Promoção' })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : 0))
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Transform(parseBool)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(parseBool)
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'JSON string: [{"label":"M","available":true}]',
    example: '[{"label":"M","available":true},{"label":"G","available":true}]',
  })
  @IsOptional()
  @Transform(parseJson)
  sizes?: SizeDto[];

  @ApiPropertyOptional({
    description: 'JSON string: [{"name":"Preto","hex":"#000000","available":true}]',
    example: '[{"name":"Preto","hex":"#000000","available":true}]',
  })
  @IsOptional()
  @Transform(parseJson)
  colors?: ColorDto[];
}
