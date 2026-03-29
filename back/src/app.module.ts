import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { User } from './modules/users/entities/user.entity';
import { Product } from './modules/products/entities/product.entity';
import { ProductSize } from './modules/products/entities/product-size.entity';
import { ProductColor } from './modules/products/entities/product-color.entity';
import { Category } from './modules/categories/entities/category.entity';
import { SeedService } from './database/seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dog_imports.db',
      entities: [User, Product, ProductSize, ProductColor, Category],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Product, ProductSize, ProductColor, Category]),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    SeedService,
  ],
})
export class AppModule {}
