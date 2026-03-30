import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  eyebrow: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ default: 'Ver coleção' })
  cta: string;

  @Column({ default: '/produtos' })
  ctaUrl: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
