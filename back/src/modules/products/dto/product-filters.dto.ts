import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductFiltersDto {
  @ApiPropertyOptional({ example: 'Nike' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'camisetas', description: 'Slug da categoria' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ type: [String], example: ['M', 'G'] })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : undefined))
  sizes?: string[];

  @ApiPropertyOptional({ type: [String], example: ['masculino', 'feminino'] })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : undefined))
  gender?: string[];

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMin?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number;

  @ApiPropertyOptional({ enum: ['relevance', 'price_asc', 'price_desc', 'newest'] })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 12;

  @ApiPropertyOptional({ description: 'Admin: lista todos os produtos incluindo inativos' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  showAll?: boolean;
}
