import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { OrderStatus } from './entities/order.entity';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Criar pedido (autenticado ou guest)' })
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user?: { id: number; isAdmin: boolean },
  ) {
    return this.ordersService.create(dto, user?.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Listar meus pedidos' })
  myOrders(@CurrentUser() user: { id: number }) {
    return this.ordersService.findMyOrders(user.id);
  }

  @Get('my/:id')
  @ApiOperation({ summary: 'Detalhe de um pedido meu' })
  myOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.ordersService.findMyOrder(id, user.id);
  }

  @Get('admin')
  @ApiOperation({ summary: 'Listar todos os pedidos (admin)' })
  adminList(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @CurrentUser() user: { isAdmin: boolean },
  ) {
    if (!user.isAdmin) throw new Error('Forbidden');
    return this.ordersService.findAll(Number(page), Number(limit));
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do pedido (admin)' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
    @CurrentUser() user: { isAdmin: boolean },
  ) {
    if (!user.isAdmin) throw new Error('Forbidden');
    return this.ordersService.updateStatus(id, status);
  }
}
