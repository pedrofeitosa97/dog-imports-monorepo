import {
  Controller, Get, Put, Param, Body,
  UseInterceptors, UploadedFile, ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { S3Service } from '../s3/s3.service';

const imageFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  cb(null, /\.(jpg|jpeg|png|webp|svg)$/i.test(file.originalname));
};

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(
    private settingsService: SettingsService,
    private s3Service: S3Service,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Retorna todas as configurações públicas do site' })
  getAll() {
    return this.settingsService.getAll();
  }

  @ApiBearerAuth()
  @Put(':key')
  @ApiOperation({ summary: '[Admin] Atualiza uma configuração por key' })
  async set(
    @Param('key') key: string,
    @Body('value') value: string,
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    return this.settingsService.set(key, value ?? null);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Put(':key/upload')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage(), fileFilter: imageFilter }))
  @ApiOperation({ summary: '[Admin] Faz upload de imagem e salva URL na configuração' })
  async uploadImage(
    @Param('key') key: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    if (!file) throw new ForbiddenException('Nenhum arquivo enviado');

    let url: string;
    if (this.s3Service.isConfigured()) {
      url = await this.s3Service.uploadBuffer(file.buffer, file.originalname, file.mimetype, 'settings');
    } else {
      throw new Error('S3 não configurado. Defina as variáveis AWS_* no Railway.');
    }

    return this.settingsService.set(key, url);
  }
}
