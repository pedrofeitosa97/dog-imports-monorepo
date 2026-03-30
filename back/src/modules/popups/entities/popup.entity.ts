import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('popups')
export class Popup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ nullable: true })
  cta: string;

  @Column({ nullable: true })
  ctaUrl: string;

  @Column({ default: true })
  isActive: boolean;

  /** Delay em segundos antes de exibir o popup */
  @Column({ default: 3 })
  delaySeconds: number;

  /** Quantas horas esperar antes de mostrar novamente ao mesmo usuário */
  @Column({ default: 24 })
  cooldownHours: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
