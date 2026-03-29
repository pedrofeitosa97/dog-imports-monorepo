import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductSize } from './entities/product-size.entity';
import { ProductColor } from './entities/product-color.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import slugify from 'slugify';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductSize) private sizeRepo: Repository<ProductSize>,
    @InjectRepository(ProductColor) private colorRepo: Repository<ProductColor>,
  ) {}

  async findAll(filters: ProductFiltersDto) {
    const { brand, category, sizes, priceMin, priceMax, gender, sortBy, page = 1, limit = 12 } = filters;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.sizes', 'sizes')
      .leftJoinAndSelect('product.colors', 'colors')
      .where('product.isActive = :isActive', { isActive: true });

    if (brand) qb.andWhere('product.brand = :brand', { brand });
    if (category) qb.andWhere('category.slug = :category', { category });
    if (priceMin !== undefined) qb.andWhere('product.price >= :priceMin', { priceMin });
    if (priceMax !== undefined) qb.andWhere('product.price <= :priceMax', { priceMax });
    if (gender?.length) qb.andWhere('product.gender IN (:...genders)', { genders: gender });
    if (sizes?.length) {
      qb.innerJoin(
        'product.sizes',
        'filterSize',
        'filterSize.label IN (:...filterSizes) AND filterSize.available = :av',
        { filterSizes: sizes, av: true },
      );
    }

    switch (sortBy) {
      case 'price_asc': qb.orderBy('product.price', 'ASC'); break;
      case 'price_desc': qb.orderBy('product.price', 'DESC'); break;
      case 'newest': qb.orderBy('product.createdAt', 'DESC'); break;
      default: qb.orderBy('product.id', 'DESC');
    }

    const [data, total] = await qb
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit))
      .getManyAndCount();

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  findFeatured() {
    return this.productRepo.find({
      where: { isFeatured: true, isActive: true },
      relations: ['category', 'sizes', 'colors'],
      take: 12,
    });
  }

  async findBySlug(slug: string) {
    const product = await this.productRepo.findOne({
      where: { slug, isActive: true },
      relations: ['category', 'sizes', 'colors'],
    });
    if (!product) throw new NotFoundException(`Produto "${slug}" não encontrado`);
    return product;
  }

  async findById(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'sizes', 'colors'],
    });
    if (!product) throw new NotFoundException(`Produto #${id} não encontrado`);
    return product;
  }

  async create(dto: CreateProductDto, imagePaths: string[]) {
    const slug = await this.generateSlug(dto.name);
    const { sizes, colors, ...rest } = dto;

    const product = this.productRepo.create({ ...rest, slug, images: imagePaths });
    const saved = await this.productRepo.save(product);

    if (sizes?.length) {
      await this.sizeRepo.save(sizes.map((s) => this.sizeRepo.create({ ...s, productId: saved.id })));
    }
    if (colors?.length) {
      await this.colorRepo.save(colors.map((c) => this.colorRepo.create({ ...c, productId: saved.id })));
    }

    return this.findById(saved.id);
  }

  async update(id: number, dto: UpdateProductDto, imagePaths?: string[]) {
    const product = await this.findById(id);
    const { sizes, colors, ...rest } = dto;

    if (rest.name && rest.name !== product.name) {
      rest['slug'] = await this.generateSlug(rest.name);
    }

    Object.assign(product, rest);
    if (imagePaths?.length) product.images = imagePaths;
    await this.productRepo.save(product);

    if (sizes !== undefined) {
      await this.sizeRepo.delete({ productId: id });
      if (sizes.length) {
        await this.sizeRepo.save(sizes.map((s) => this.sizeRepo.create({ ...s, productId: id })));
      }
    }
    if (colors !== undefined) {
      await this.colorRepo.delete({ productId: id });
      if (colors.length) {
        await this.colorRepo.save(colors.map((c) => this.colorRepo.create({ ...c, productId: id })));
      }
    }

    return this.findById(id);
  }

  async remove(id: number) {
    const product = await this.findById(id);
    await this.productRepo.remove(product);
    return { message: 'Produto removido com sucesso' };
  }

  private async generateSlug(name: string): Promise<string> {
    let slug = slugify(name, { lower: true, strict: true });
    const existing = await this.productRepo.findOne({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;
    return slug;
  }
}
