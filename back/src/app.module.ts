import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BannersModule } from './modules/banners/banners.module';
import { PopupsModule } from './modules/popups/popups.module';
import { SettingsModule } from './modules/settings/settings.module';
import { OrdersModule } from './modules/orders/orders.module';
import { Order } from './modules/orders/entities/order.entity';
import { OrderItem } from './modules/orders/entities/order-item.entity';
import { S3Module } from './modules/s3/s3.module';
import { EmailModule } from './modules/email/email.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { User } from './modules/users/entities/user.entity';
import { Product } from './modules/products/entities/product.entity';
import { ProductSize } from './modules/products/entities/product-size.entity';
import { ProductColor } from './modules/products/entities/product-color.entity';
import { Category } from './modules/categories/entities/category.entity';
import { Banner } from './modules/banners/entities/banner.entity';
import { Popup } from './modules/popups/entities/popup.entity';
import { Setting } from './modules/settings/entities/setting.entity';
import { SeedService } from './database/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().min(16).required(),
        DATABASE_URL: Joi.string().optional(),
        RESEND_API_KEY: Joi.string().optional(),
        AWS_ACCESS_KEY_ID: Joi.string().optional(),
        AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
        AWS_REGION: Joi.string().optional(),
        AWS_S3_BUCKET: Joi.string().optional(),
        STRIPE_SECRET_KEY: Joi.string().optional(),
        STRIPE_WEBHOOK_SECRET: Joi.string().optional(),
      }),
      validationOptions: { abortEarly: false },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        if (databaseUrl) {
          console.log('🐘 Banco: PostgreSQL (Railway)');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Product, ProductSize, ProductColor, Category, Banner, Popup, Setting, Order, OrderItem],
            synchronize: config.get('NODE_ENV') !== 'production',
            ssl: { rejectUnauthorized: false },
            extra: {
              max: 10,
              idleTimeoutMillis: 30000,
              connectionTimeoutMillis: 5000,
            },
          };
        }

        console.warn('⚠️  DATABASE_URL não encontrado — usando SQLite local. Dados NÃO persistem no Railway!');
        return {
          type: 'sqlite',
          database: 'dog_imports.db',
          entities: [User, Product, ProductSize, ProductColor, Category, Banner, Popup, Setting, Order, OrderItem],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([User, Product, ProductSize, ProductColor, Category]),
    S3Module,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    BannersModule,
    PopupsModule,
    SettingsModule,
    OrdersModule,
    EmailModule,
    StripeModule,
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
