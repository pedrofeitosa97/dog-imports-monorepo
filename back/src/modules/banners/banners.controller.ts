import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe,
  UseInterceptors, UploadedFile, ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { S3Service } from '../s3/s3.service';

const imageFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  cb(null, /\.(jpg|jpeg|png|webp)$/i.test(file.originalname));
};

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(
    private bannersService: BannersService,
    private s3Service: S3Service,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista banners ativos (homepage)' })
  findActive() {
    return this.bannersService.findActive();
  }

  @ApiBearerAuth()
  @Get('admin')
  @ApiOperation({ summary: '[Admin] Lista todos os banners' })
  findAll(@CurrentUser() user: any) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    return this.bannersService.findAll();
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage(), fileFilter: imageFilter }))
  @ApiOperation({ summary: '[Admin] Cria banner' })
  async create(
    @Body() dto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    let imageUrl: string | undefined;
    if (file && this.s3Service.isConfigured()) {
      imageUrl = await this.s3Service.uploadBuffer(file.buffer, file.originalname, file.mimetype, 'banners');
    }
    return this.bannersService.create(dto, imageUrl);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage(), fileFilter: imageFilter }))
  @ApiOperation({ summary: '[Admin] Atualiza banner' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBannerDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    let imageUrl: string | undefined;
    if (file && this.s3Service.isConfigured()) {
      imageUrl = await this.s3Service.uploadBuffer(file.buffer, file.originalname, file.mimetype, 'banners');
    }
    return this.bannersService.update(id, dto, imageUrl);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Remove banner' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    return this.bannersService.remove(id);
  }
}
