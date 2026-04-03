import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { SettingsService } from '../settings/settings.service';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;

  constructor(
    private config: ConfigService,
    private settings: SettingsService,
  ) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY não configurada — emails desativados');
    }
  }

  isConfigured(): boolean {
    return this.resend !== null;
  }

  private renderTemplate(template: string, vars: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
  }

  private buildOrderItemsHtml(order: Order): string {
    return (order.items ?? [])
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
              ${item.productName}${item.size ? ` — ${item.size}` : ''}${item.color ? ` / ${item.color}` : ''}
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}x</td>
            <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
              R$ ${Number(item.price).toFixed(2).replace('.', ',')}
            </td>
          </tr>`,
      )
      .join('');
  }

  private getDefaultTemplate(): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
        <tr><td style="background:#111827;padding:24px 32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">Dog Imports</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">Pedido Confirmado!</h2>
          <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Olá, {{customerName}}! Recebemos seu pedido e estamos preparando tudo com carinho.</p>

          <div style="background:#f3f4f6;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:#6b7280;">Número do pedido</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#111827;">#{{orderId}}</p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <th style="text-align:left;font-size:13px;color:#6b7280;padding-bottom:8px;font-weight:600;">Produto</th>
              <th style="text-align:center;font-size:13px;color:#6b7280;padding-bottom:8px;font-weight:600;">Qtd</th>
              <th style="text-align:right;font-size:13px;color:#6b7280;padding-bottom:8px;font-weight:600;">Valor</th>
            </tr>
            {{itemsHtml}}
          </table>

          <div style="text-align:right;margin-bottom:24px;">
            <span style="font-size:16px;font-weight:700;color:#111827;">Total: R$ {{totalPrice}}</span>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="width:50%;padding-right:12px;">
                <p style="margin:0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Pagamento</p>
                <p style="margin:4px 0 0;font-size:14px;color:#374151;">{{paymentMethod}}</p>
              </td>
              <td style="width:50%;padding-left:12px;">
                <p style="margin:0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Endereço</p>
                <p style="margin:4px 0 0;font-size:14px;color:#374151;">{{address}}</p>
              </td>
            </tr>
          </table>

          <p style="margin:0;color:#6b7280;font-size:14px;">Em caso de dúvidas, entre em contato conosco.</p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© Dog Imports — Todos os direitos reservados</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  async sendOrderConfirmation(order: Order): Promise<void> {
    if (!this.resend) return;

    const s = await this.settings.getAll();
    const fromName = s['email_from_name'] || 'Dog Imports';
    const fromAddress = s['email_from_address'] || 'noreply@dogimports.com.br';
    const subject = s['email_order_subject'] || 'Pedido #{{orderId}} confirmado — Dog Imports';
    const template = s['email_order_template'] || this.getDefaultTemplate();

    const vars: Record<string, string> = {
      customerName: order.customerName,
      orderId: String(order.id),
      totalPrice: Number(order.totalPrice).toFixed(2).replace('.', ','),
      paymentMethod: order.paymentMethod,
      address: order.address,
      itemsHtml: this.buildOrderItemsHtml(order),
    };

    const html = this.renderTemplate(template, vars);
    const subjectRendered = this.renderTemplate(subject, vars);

    try {
      await this.resend.emails.send({
        from: `${fromName} <${fromAddress}>`,
        to: order.customerEmail,
        subject: subjectRendered,
        html,
      });
      this.logger.log(`Email de confirmação enviado para ${order.customerEmail} (pedido #${order.id})`);
    } catch (err) {
      this.logger.error(`Falha ao enviar email para ${order.customerEmail}`, err);
    }
  }

  async sendTestEmail(to: string): Promise<void> {
    if (!this.resend) throw new Error('RESEND_API_KEY não configurada');

    const s = await this.settings.getAll();
    const fromName = s['email_from_name'] || 'Dog Imports';
    const fromAddress = s['email_from_address'] || 'noreply@dogimports.com.br';

    await this.resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to,
      subject: 'Teste de e-mail — Dog Imports',
      html: '<p>Seu e-mail está funcionando corretamente! 🐾</p>',
    });
  }
}
