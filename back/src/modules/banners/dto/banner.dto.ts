import { IsString, IsOptional, IsBoolean, IsNumber, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBannerDto {
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  eyebrow?: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  cta?: string;

  @IsOptional()
  @IsString()
  ctaUrl?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  order?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateBannerDto extends CreateBannerDto {}
