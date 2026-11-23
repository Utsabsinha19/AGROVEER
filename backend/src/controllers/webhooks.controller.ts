import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';
import { WhatsAppService } from '../services/whatsapp.service.js';

export class WebhooksController {
  /**
   * POST /api/webhooks/payment
   * Section 11.1 Payment Webhook Handler
   */
  public static handlePaymentWebhook(req: Request, res: Response) {
    const { event, data } = req.body;

    console.log(`[PAYMENT-WEBHOOK] Event received: ${event}`, data);

    if (event !== 'payment.captured' && event !== 'payment.settled') {
      return res.status(200).json({ received: true, note: 'Event ignored; only payment.captured processed.' });
    }

    const orderId = data?.notes?.system_order_id || data?.order_id;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Missing system_order_id in notes payload.' });
    }

    const order = OrderService.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order #${orderId} not found in database.` });
    }

    // Transition state machine
    order.status = 'PAYMENT_CONFIRMED';
    order.paymentStatus = 'PAID';
    if (!order.paymentDetails) order.paymentDetails = {};
    order.paymentDetails.transactionId = data.payment_id || `pay_${Date.now()}`;
    order.paymentDetails.paymentMode = 'GATEWAY_WEBHOOK';

    OrderService.updateOrderStatus(orderId, 'PAYMENT_CONFIRMED');

    // Trigger Order Confirmation WhatsApp HSM
    const hsm = WhatsAppService.generateHSMMessage('order-invoice-confirmation', order);

    return res.status(200).json({
      success: true,
      message: `Order #${orderId} confirmed via webhook. Tax invoice attached.`,
      orderStatus: order.status,
      hsmPreview: hsm
    });
  }
}

