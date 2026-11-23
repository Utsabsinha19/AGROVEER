import { Request, Response } from 'express';
import { WhatsAppService } from '../services/whatsapp.service.js';

export class WhatsAppController {
  public static getTemplates(_req: Request, res: Response) {
    const templates = WhatsAppService.getTemplates();
    return res.json({
      success: true,
      data: templates
    });
  }

  public static createInquiry(req: Request, res: Response) {
    const { type, productId, lotNumber, acreage, cropType, items, notes } = req.body;

    const payload = WhatsAppService.generateInquiryPayload({
      type: type || 'DOSAGE_ADVISORY',
      productId,
      lotNumber,
      acreage,
      cropType,
      items,
      notes
    });

    return res.json({
      success: true,
      data: payload
    });
  }

  public static sendHSM(req: Request, res: Response) {
    const { templateId, orderId, customData } = req.body;
    const { OrderService } = require('../services/order.service.js');
    const order = OrderService.getOrder(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order with ID '${orderId}' not found.`
      });
    }

    const payload = WhatsAppService.generateHSMMessage(templateId, order, customData);
    return res.json({
      success: true,
      message: `WhatsApp HSM payload constructed for ${templateId}`,
      data: payload
    });
  }

  public static webhook(req: Request, res: Response) {
    // Log incoming WhatsApp webhook events
    const event = req.body;
    return res.json({
      success: true,
      receivedAt: new Date().toISOString(),
      eventSummary: 'WhatsApp business message received'
    });
  }
}

