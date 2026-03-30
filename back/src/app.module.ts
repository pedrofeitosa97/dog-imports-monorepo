import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        if (databaseUrl) {
          console.log('🐘 Banco: PostgreSQL (Railway)');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Product, ProductSize, ProductColor, Category],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          };
        }

        console.warn('⚠️  DATABASE_URL não encontrado — usando SQLite local. Dados NÃO persistem no Railway!');
        return {
          type: 'sqlite',
          database: 'dog_imports.db',
          entities: [User, Product, ProductSize, ProductColor, Category],
          synchronize: true,
        };
      },
      inject: [ConfigService],
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
