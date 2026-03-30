import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePopupDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

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
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  delaySeconds?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  cooldownHours?: number;
}

export class UpdatePopupDto extends CreatePopupDto {}
