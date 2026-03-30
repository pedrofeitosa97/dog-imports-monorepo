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
  @Transform(({ value }) => { const n = parseFloat(value); return isNaN(n) ? 0 : n; })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 249.9 })
  @IsOptional()
  @Transform(({ value }) => { if (value === null || value === undefined || value === '' || value === 'null') return null; const n = parseFloat(value); return isNaN(n) ? null : n; })
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
  @Transform(({ value }) => { if (value === null || value === undefined || value === '') return 0; const n = parseInt(value); return isNaN(n) ? 0 : n; })
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
  @Transform(({ value }) => { if (!value || value === 'null' || value === '') return null; const n = parseInt(value); return isNaN(n) ? null : n; })
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
