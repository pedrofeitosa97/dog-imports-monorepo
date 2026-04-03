import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  findAll(): Promise<Omit<User, 'password'>[]> {
    return this.userRepo.find({ order: { createdAt: 'DESC' }, select: ['id', 'name', 'email', 'isAdmin', 'createdAt'] });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(data: { name: string; email: string; password: string; isAdmin?: boolean }): Promise<User> {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({ ...data, password: hashed });
    return this.userRepo.save(user);
  }

  async setAdmin(id: number, isAdmin: boolean): Promise<Omit<User, 'password'>> {
    await this.userRepo.update(id, { isAdmin });
    const { password: _pw, ...user } = await this.userRepo.findOne({ where: { id } });
    return user;
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
