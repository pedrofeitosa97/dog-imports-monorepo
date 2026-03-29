import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe, ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista todas as categorias' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: '[Admin] Cria categoria' })
  create(@Body() dto: CreateCategoryDto, @CurrentUser() user: any) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    return this.categoriesService.create(dto);
  }

  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: '[Admin] Edita categoria' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    return this.categoriesService.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Remove categoria' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    return this.categoriesService.remove(id);
  }
}
