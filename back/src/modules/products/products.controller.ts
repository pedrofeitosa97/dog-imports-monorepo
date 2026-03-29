import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, ParseIntPipe,
  UseInterceptors, UploadedFiles, ForbiddenException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

const multerConfig = {
  storage: diskStorage({
    destination: join(process.cwd(), 'uploads', 'products'),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    const allowed = /\.(jpg|jpeg|png|webp)$/i;
    cb(null, allowed.test(file.originalname));
  },
};

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista produtos com filtros e paginação' })
  findAll(@Query() filters: ProductFiltersDto) {
    return this.productsService.findAll(filters);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Produtos em destaque (homepage)' })
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Public()
  @Get(':slugOrId')
  @ApiOperation({ summary: 'Busca produto por slug (público) ou ID (admin)' })
  findOne(@Param('slugOrId') slugOrId: string) {
    const id = parseInt(slugOrId, 10);
    if (!isNaN(id)) return this.productsService.findById(id);
    return this.productsService.findBySlug(slugOrId);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  @ApiOperation({ summary: '[Admin] Cria produto (multipart/form-data)' })
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    const imagePaths = (files || []).map((f) => `/uploads/products/${f.filename}`);
    return this.productsService.create(dto, imagePaths);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  @ApiOperation({ summary: '[Admin] Edita produto (multipart/form-data)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    const imagePaths = files?.length ? files.map((f) => `/uploads/products/${f.filename}`) : undefined;
    return this.productsService.update(id, dto, imagePaths);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Remove produto' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    return this.productsService.remove(id);
  }
}
