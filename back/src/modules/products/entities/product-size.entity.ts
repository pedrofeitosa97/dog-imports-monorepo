import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_sizes')
export class ProductSize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => Product, (product) => product.sizes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;
}
