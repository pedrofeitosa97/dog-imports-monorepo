import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/users/entities/user.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { Product } from '../modules/products/entities/product.entity';
import { ProductSize } from '../modules/products/entities/product-size.entity';
import { ProductColor } from '../modules/products/entities/product-color.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductSize) private sizeRepo: Repository<ProductSize>,
    @InjectRepository(ProductColor) private colorRepo: Repository<ProductColor>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
    await this.seedCategories();
    await this.seedProducts();
  }

  private async seedAdmin() {
    const exists = await this.userRepo.findOne({ where: { email: 'admin@dogimports.com' } });
    if (exists) return;
    const password = await bcrypt.hash('admin123', 10);
    await this.userRepo.save(
      this.userRepo.create({ name: 'Admin', email: 'admin@dogimports.com', password, isAdmin: true }),
    );
    console.log('Seed: admin criado — admin@dogimports.com / admin123');
  }

  private async seedCategories() {
    const count = await this.categoryRepo.count();
    if (count > 0) return;
    await this.categoryRepo.save([
      { name: 'Camisetas', slug: 'camisetas' },
      { name: 'Calçados', slug: 'calcados' },
      { name: 'Acessórios', slug: 'acessorios' },
      { name: 'Perfumes', slug: 'perfumes' },
    ]);
    console.log('Seed: 4 categorias criadas');
  }

  private async seedProducts() {
    const count = await this.productRepo.count();
    if (count > 0) return;

    const camisetas = await this.categoryRepo.findOne({ where: { slug: 'camisetas' } });
    const calcados = await this.categoryRepo.findOne({ where: { slug: 'calcados' } });

    const productsData = [
      {
        slug: 'camiseta-nike-dri-fit-preta',
        name: 'Camiseta Nike Dri-FIT Preta',
        brand: 'Nike',
        gender: 'unissex',
        price: 189.9,
        originalPrice: 249.9,
        description: 'Camiseta Nike Dri-FIT para treinos de alta performance. Tecnologia que afasta o suor do corpo.',
        badge: 'Promoção',
        stock: 50,
        isActive: true,
        isFeatured: true,
        rating: 4.8,
        reviewCount: 124,
        images: [],
        categoryId: camisetas?.id,
      },
      {
        slug: 'tenis-adidas-ultraboost-22',
        name: 'Tênis Adidas Ultraboost 22',
        brand: 'Adidas',
        gender: 'masculino',
        price: 899.9,
        originalPrice: 1199.9,
        description: 'Tênis Adidas Ultraboost 22 com amortecimento Boost para corrida de longa distância.',
        badge: 'Lançamento',
        stock: 20,
        isActive: true,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 89,
        images: [],
        categoryId: calcados?.id,
      },
      {
        slug: 'camiseta-polo-ralph-lauren-branca',
        name: 'Camiseta Polo Ralph Lauren Branca',
        brand: 'Ralph Lauren',
        gender: 'masculino',
        price: 459.9,
        originalPrice: null,
        description: 'Polo clássica Ralph Lauren. 100% algodão pima, corte slim fit.',
        badge: null,
        stock: 30,
        isActive: true,
        isFeatured: false,
        rating: 4.7,
        reviewCount: 56,
        images: [],
        categoryId: camisetas?.id,
      },
      {
        slug: 'tenis-nike-air-force-1-branco',
        name: 'Tênis Nike Air Force 1 Branco',
        brand: 'Nike',
        gender: 'unissex',
        price: 749.9,
        originalPrice: 899.9,
        description: 'O icônico Nike Air Force 1. Solado Air-Sole para amortecimento duradouro.',
        badge: 'Mais Vendido',
        stock: 40,
        isActive: true,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 312,
        images: [],
        categoryId: calcados?.id,
      },
      {
        slug: 'camiseta-off-white-preta',
        name: 'Camiseta Off-White Arrows Preta',
        brand: 'Off-White',
        gender: 'unissex',
        price: 1290.0,
        originalPrice: null,
        description: 'Camiseta Off-White com estampa Arrows. 100% algodão.',
        badge: 'Importado',
        stock: 15,
        isActive: true,
        isFeatured: true,
        rating: 4.6,
        reviewCount: 38,
        images: [],
        categoryId: camisetas?.id,
      },
    ];

    for (const data of productsData) {
      const product = await this.productRepo.save(this.productRepo.create(data));

      await this.sizeRepo.save([
        { label: 'P', available: true, productId: product.id },
        { label: 'M', available: true, productId: product.id },
        { label: 'G', available: true, productId: product.id },
        { label: 'GG', available: false, productId: product.id },
      ]);

      await this.colorRepo.save([
        { name: 'Preto', hex: '#000000', available: true, productId: product.id },
        { name: 'Branco', hex: '#FFFFFF', available: true, productId: product.id },
      ]);
    }

    console.log('Seed: 5 produtos de exemplo criados');
  }
}
