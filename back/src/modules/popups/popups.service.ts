import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Popup } from './entities/popup.entity';
import { CreatePopupDto, UpdatePopupDto } from './dto/popup.dto';

@Injectable()
export class PopupsService {
  constructor(
    @InjectRepository(Popup) private repo: Repository<Popup>,
  ) {}

  findAll(): Promise<Popup[]> {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  findActive(): Promise<Popup | null> {
    return this.repo.findOne({ where: { isActive: true }, order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Popup> {
    const popup = await this.repo.findOne({ where: { id } });
    if (!popup) throw new NotFoundException(`Popup #${id} não encontrado`);
    return popup;
  }

  async create(dto: CreatePopupDto, imageUrl?: string): Promise<Popup> {
    const popup = this.repo.create({ ...dto, imageUrl: imageUrl ?? dto.imageUrl });
    return this.repo.save(popup);
  }

  async update(id: number, dto: UpdatePopupDto, imageUrl?: string): Promise<Popup> {
    const popup = await this.findOne(id);
    Object.assign(popup, dto);
    if (imageUrl) popup.imageUrl = imageUrl;
    return this.repo.save(popup);
  }

  async remove(id: number): Promise<void> {
    const popup = await this.findOne(id);
    await this.repo.remove(popup);
  }
}
