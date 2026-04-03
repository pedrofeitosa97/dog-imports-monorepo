import {
  Controller, Post, Param, Body, Get, Put,
  ForbiddenException, BadRequestException, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SettingsService } from '../settings/settings.service';
import { OrdersService } from '../orders/orders.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Email')
@ApiBearerAuth()
@Controller('email')
export class EmailController {
  constructor(
    private emailService: EmailService,
    private settingsService: SettingsService,
    private ordersService: OrdersService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: '[Admin] Retorna status da integração Resend' })
  getStatus(@CurrentUser() user: any) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    return { configured: this.emailService.isConfigured() };
  }

  @Get('settings')
  @ApiOperation({ summary: '[Admin] Retorna configurações de email' })
  async getSettings(@CurrentUser() user: any) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    const all = await this.settingsService.getAll();
    return {
      email_from_name: all['email_from_name'] ?? '',
      email_from_address: all['email_from_address'] ?? '',
      email_order_subject: all['email_order_subject'] ?? '',
      email_order_template: all['email_order_template'] ?? '',
      email_status_subject: all['email_status_subject'] ?? '',
      email_status_template: all['email_status_template'] ?? '',
    };
  }

  @Put('settings')
  @ApiOperation({ summary: '[Admin] Salva configurações de email' })
  async saveSettings(
    @Body() body: {
      email_from_name?: string;
      email_from_address?: string;
      email_order_subject?: string;
      email_order_template?: string;
      email_status_subject?: string;
      email_status_template?: string;
    },
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        await this.settingsService.set(key, value || null);
      }
    }
    return { ok: true };
  }

  @Post('send-order/:orderId')
  @ApiOperation({ summary: '[Admin] Reenvia e-mail de confirmação de um pedido' })
  async sendOrderEmail(
    @Param('orderId', ParseIntPipe) orderId: number,
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    if (!this.emailService.isConfigured()) {
      throw new BadRequestException('RESEND_API_KEY não configurada no servidor');
    }
    const { data } = await this.ordersService.findAll(1, 1000);
    const order = data.find((o) => o.id === orderId);
    if (!order) throw new BadRequestException('Pedido não encontrado');
    await this.emailService.sendOrderConfirmation(order);
    return { ok: true, message: `E-mail enviado para ${order.customerEmail}` };
  }

  @Post('send-test')
  @ApiOperation({ summary: '[Admin] Envia e-mail de teste' })
  async sendTest(
    @Body('to') to: string,
    @CurrentUser() user: any,
  ) {
    if (!user.isAdmin) throw new ForbiddenException('Apenas admins');
    if (!to) throw new BadRequestException('Campo "to" é obrigatório');
    await this.emailService.sendTestEmail(to);
    return { ok: true, message: `E-mail de teste enviado para ${to}` };
  }
}
