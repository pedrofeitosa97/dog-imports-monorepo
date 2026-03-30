import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Popup } from './entities/popup.entity';
import { PopupsService } from './popups.service';
import { PopupsController } from './popups.controller';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Popup]), S3Module],
  providers: [PopupsService],
  controllers: [PopupsController],
})
export class PopupsModule {}
