import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductSize } from './entities/product-size.entity';
import { ProductColor } from './entities/product-color.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductSize, ProductColor])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
