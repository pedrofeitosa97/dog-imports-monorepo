import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner) private repo: Repository<Banner>,
  ) {}

  findAll(): Promise<Banner[]> {
    return this.repo.find({ order: { order: 'ASC', id: 'ASC' } });
  }

  findActive(): Promise<Banner[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { order: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Banner> {
    const banner = await this.repo.findOne({ where: { id } });
    if (!banner) throw new NotFoundException(`Banner #${id} não encontrado`);
    return banner;
  }

  async create(dto: CreateBannerDto, imageUrl?: string): Promise<Banner> {
    const banner = this.repo.create({ ...dto, imageUrl: imageUrl ?? dto.imageUrl });
    return this.repo.save(banner);
  }

  async update(id: number, dto: UpdateBannerDto, imageUrl?: string): Promise<Banner> {
    const banner = await this.findOne(id);
    Object.assign(banner, dto);
    if (imageUrl) banner.imageUrl = imageUrl;
    return this.repo.save(banner);
  }

  async remove(id: number): Promise<void> {
    const banner = await this.findOne(id);
    await this.repo.remove(banner);
  }
}
