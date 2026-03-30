import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe,
  UseInterceptors, UploadedFile, ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { PopupsService } from './popups.service';
import { CreatePopupDto, UpdatePopupDto } from './dto/popup.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { S3Service } from '../s3/s3.service';

const imageFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  cb(null, /\.(jpg|jpeg|png|webp)$/i.test(file.originalname));
};

@ApiTags('Popups')
@Controller('popups')
export class PopupsController {
  constructor(
    private popupsService: PopupsService,
    private s3Service: S3Service,
  ) {}

  @Public()
  @Get('active')
  @ApiOperation({ summary: 'Retorna o popup ativo (site público)' })
  findActive() {
    return this.popupsService.findActive();
  }

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: '[Admin] Lista todos os popups' })
  findAll(@CurrentUser() user: any) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    return this.popupsService.findAll();
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage(), fileFilter: imageFilter }))
  @ApiOperation({ summary: '[Admin] Cria popup' })
  async create(
    @Body() dto: CreatePopupDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    let imageUrl: string | undefined;
    if (file && this.s3Service.isConfigured()) {
      imageUrl = await this.s3Service.uploadBuffer(file.buffer, file.originalname, file.mimetype, 'popups');
    }
    return this.popupsService.create(dto, imageUrl);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage(), fileFilter: imageFilter }))
  @ApiOperation({ summary: '[Admin] Atualiza popup' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePopupDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    let imageUrl: string | undefined;
    if (file && this.s3Service.isConfigured()) {
      imageUrl = await this.s3Service.uploadBuffer(file.buffer, file.originalname, file.mimetype, 'popups');
    }
    return this.popupsService.update(id, dto, imageUrl);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Remove popup' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    return this.popupsService.remove(id);
  }
}
