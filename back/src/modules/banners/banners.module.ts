import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Banner]), S3Module],
  providers: [BannersService],
  controllers: [BannersController],
})
export class BannersModule {}
