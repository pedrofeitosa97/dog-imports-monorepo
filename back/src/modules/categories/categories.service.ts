import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async findById(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Categoria #${id} não encontrada`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });
    const exists = await this.categoryRepo.findOne({ where: [{ name: dto.name }, { slug }] });
    if (exists) throw new ConflictException('Categoria já existe');
    const category = this.categoryRepo.create({ name: dto.name, slug });
    return this.categoryRepo.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findById(id);
    if (dto.name) {
      category.name = dto.name;
      category.slug = slugify(dto.name, { lower: true, strict: true });
    }
    return this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.findById(id);
    await this.categoryRepo.remove(category);
    return { message: 'Categoria removida com sucesso' };
  }
}
