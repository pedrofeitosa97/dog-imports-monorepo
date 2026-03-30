import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';

export type SettingsMap = Record<string, string | null>;

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private repo: Repository<Setting>,
  ) {}

  async getAll(): Promise<SettingsMap> {
    const rows = await this.repo.find();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async get(key: string): Promise<string | null> {
    const row = await this.repo.findOne({ where: { key } });
    return row?.value ?? null;
  }

  async set(key: string, value: string | null): Promise<SettingsMap> {
    await this.repo.upsert({ key, value }, ['key']);
    return this.getAll();
  }
}
