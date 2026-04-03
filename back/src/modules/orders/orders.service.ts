import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    @Inject(forwardRef(() => EmailService)) private emailService: EmailService,
  ) {}

  async create(dto: CreateOrderDto, userId?: number): Promise<Order> {
    const order = this.orderRepo.create({
      userId: userId ?? null,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      address: dto.address,
      paymentMethod: dto.paymentMethod,
      totalPrice: dto.totalPrice,
      status: 'pendente',
      stripePaymentIntentId: dto.stripePaymentIntentId ?? null,
      paymentStatus: dto.stripePaymentIntentId ? 'pending' : 'not_required',
    });

    const saved = await this.orderRepo.save(order);

    const items = dto.items.map((i) =>
      this.itemRepo.create({
        orderId: saved.id,
        productId: i.productId,
        productName: i.productName,
        productBrand: i.productBrand,
        productImage: i.productImage ?? null,
        price: i.price,
        quantity: i.quantity,
        size: i.size ?? null,
        color: i.color ?? null,
      }),
    );

    await this.itemRepo.save(items);

    const created = await this.orderRepo.findOne({ where: { id: saved.id }, relations: ['items'] });

    // Enviar e-mail de confirmação (fire-and-forget)
    this.emailService.sendOrderConfirmation(created).catch(() => null);

    return created;
  }

  async findMyOrders(userId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findMyOrder(orderId: number, userId: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Pedido não encontrado');
    if (order.userId !== userId) throw new ForbiddenException();

    return order;
  }

  async findAll(page = 1, limit = 20): Promise<{ data: Order[]; total: number; totalPages: number }> {
    const [data, total] = await this.orderRepo.findAndCount({
      relations: ['items'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id: orderId }, relations: ['items'] });
    if (!order) throw new NotFoundException('Pedido não encontrado');

    order.status = status;
    const saved = await this.orderRepo.save(order);

    // Notificar cliente por e-mail (fire-and-forget)
    this.emailService.sendStatusUpdate(saved, status).catch(() => null);

    return saved;
  }

  async updatePaymentStatus(paymentIntentId: string, paymentStatus: 'paid' | 'failed'): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { stripePaymentIntentId: paymentIntentId } });
    if (!order) return;

    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid') order.status = 'confirmado';
    await this.orderRepo.save(order);
  }
}
