import { WhatsAppInquiryRequest, Order } from '../types/index.js';

const AGROVE_WHATSAPP_PHONE = '918004922476';

export class WhatsAppService {
  /**
   * Pre-approved Highly Structured Message (HSM) Templates compliant with WhatsApp Business API
   */
  public static getTemplates() {
    return [
      {
        id: 'order-invoice-confirmation',
        title: 'HSM Template 1: Order Confirmation & Tax Invoice',
        category: 'TRANSACTIONAL',
        trigger: 'PAYMENT_CONFIRMED / NEFT_RECONCILED',
        description: 'Delivers official GST Tax Invoice PDF and confirms machinery bench testing schedule.',
        sampleMessage: (data: { customerName: string; orderId: string; quantity: number; productName: string; amount: number; invoiceUrl: string }) =>
          `Namaste ${data.customerName || 'Customer'}, thank you for choosing Arveer Impex.\n\n` +
          `Your order #${data.orderId || 'AG-2026-8910'} for ${data.quantity || 1}x ${data.productName || 'Agroveer Machinery'} has been confirmed.\n` +
          `Total Value: ₹${(data.amount || 0).toLocaleString('en-IN')} (Incl. GST).\n\n` +
          `Download your official GST Tax Invoice here: ${data.invoiceUrl || 'https://arveerimpex.com/invoices/AG-2026-8910.pdf'}\n` +
          `Your machinery is now being prepared for bench testing and packing.`
      },
      {
        id: 'qc-serial-registration',
        title: 'HSM Template 2: Factory Quality Check & Serial Registration',
        category: 'WARRANTY_REGISTRATION',
        trigger: 'PACKED_SERIALS_ASSIGNED (Post Barcode Scan)',
        description: 'Binds laser-engraved engine serial to customer order and provisions digital manufacturer warranty.',
        sampleMessage: (data: { orderId: string; serialNumber: string; warrantyMonths: number; videoLink: string }) =>
          `Update on Order #${data.orderId || 'AG-2026-8910'}: Your machinery has passed factory bench testing.\n\n` +
          `Registered Engine Serial No: ${data.serialNumber || 'AG85-2026-10492'}\n` +
          `Warranty Coverage: ${data.warrantyMonths || 6} Months Manufacturer Warranty activated.\n` +
          `Watch the 2-minute Machine Unboxing & 2-Stroke Oil Mixing Guide: ${data.videoLink || 'https://arveerimpex.com/guides/unboxing'}`
      },
      {
        id: 'road-transport-bilty-dispatch',
        title: 'HSM Template 3: Road Transport Dispatch & LR Bilty Delivery',
        category: 'SHIPPING_NOTIFICATION',
        trigger: 'DISPATCHED (Lorry Receipt Generated)',
        description: 'Transmits transporter name, LR Bilty number, delivery godown, and watermarked Bilty copy.',
        sampleMessage: (data: { orderId: string; carrierName: string; lrNumber: string; godownLocation: string; lrImageUrl: string }) =>
          `Consignment Dispatched!\n\n` +
          `Order #${data.orderId || 'AG-2026-8910'} has been handed over to ${data.carrierName || 'VRL Logistics Ltd.'}.\n` +
          `Lorry Receipt (Bilty) No: ${data.lrNumber || 'VRL-BLR-892104'}\n` +
          `Destination Delivery Godown: ${data.godownLocation || 'Plot 14, Transport Nagar, Destination City'}\n\n` +
          `Download your official Transporter Bilty copy here: ${data.lrImageUrl || 'https://arveerimpex.com/bilty/LR-892104.jpg'}\n` +
          `Please present this Bilty copy at the transport office for taking delivery.`
      }
    ];
  }

  public static generateHSMMessage(templateId: string, order: Order, customData?: Record<string, any>): { message: string; deepLink: string } {
    let message = '';
    const phone = (order.customer.phone || AGROVE_WHATSAPP_PHONE).replace(/[^0-9]/g, '');

    switch (templateId) {
      case 'order-invoice-confirmation':
      case 'template-1': {
        const primaryItem = order.items[0];
        const qty = order.items.reduce((acc, it) => acc + it.quantity, 0);
        const prodName = primaryItem ? primaryItem.name : 'Agroveer & Sawking Commercial Equipment';
        message = 
          `Namaste ${order.customer.fullName}, thank you for choosing Arveer Impex.\n\n` +
          `Your order #${order.id} for ${qty}x ${prodName} has been confirmed.\n` +
          `Total Value: ₹${order.totalINR.toLocaleString('en-IN')} (Incl. GST).\n\n` +
          `Download your official GST Tax Invoice here: http://localhost:3000/order-success/${order.id}\n` +
          `Your machinery is now being prepared for bench testing and packing.`;
        break;
      }

      case 'qc-serial-registration':
      case 'template-2': {
        const serial = (order.serials && order.serials[0]) ? order.serials[0].serialOrEngineNumber : (customData?.serialNumber || 'AG85-2026-10492');
        message = 
          `Update on Order #${order.id}: Your machinery has passed factory bench testing.\n\n` +
          `Registered Engine Serial No: ${serial}\n` +
          `Warranty Coverage: 6 Months Manufacturer Warranty activated.\n` +
          `Watch the 2-minute Machine Unboxing & 2-Stroke Oil Mixing Guide: https://arveerimpex.com/guides/unboxing`;
        break;
      }

      case 'road-transport-bilty-dispatch':
      case 'template-3': {
        const carrier = order.logistics.carrier || customData?.carrierName || 'VRL Logistics Ltd.';
        const lr = order.logistics.lrNumber || customData?.lrNumber || 'LR-MH-892104';
        const godown = order.logistics.destinationGodownAddress || `${order.customer.city}, ${order.customer.state}`;
        const lrUrl = order.logistics.lrBiltyDocumentUrl || customData?.lrImageUrl || `http://localhost:3000/order-success/${order.id}#bilty`;
        message = 
          `Consignment Dispatched!\n\n` +
          `Order #${order.id} has been handed over to ${carrier}.\n` +
          `Lorry Receipt (Bilty) No: ${lr}\n` +
          `Destination Delivery Godown: ${godown}\n\n` +
          `Download your official Transporter Bilty copy here: ${lrUrl}\n` +
          `Please present this Bilty copy at the transport office for taking delivery.`;
        break;
      }

      default:
        message = `Hello ${order.customer.fullName}, thank you for your order #${order.id} with Arveer Impex.`;
    }

    const deepLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    return { message, deepLink };
  }

  public static generateInquiryPayload(req: WhatsAppInquiryRequest): { message: string; deepLink: string } {
    let message = '';

    switch (req.type) {
      case 'MACHINERY_ADVISORY':
      case 'DOSAGE_ADVISORY':
        message = `*AGROVÉ Commercial Machinery Advisory Request*\n` +
          `• Target Operation: ${req.cropType || 'Field Excavation & Orchard Irrigation'}\n` +
          `• Required Equipment: ${req.productId || 'Agroveer EA-85 Auger / 170F Water Pump'}\n` +
          `• Additional Notes: ${req.notes || 'Please share implement compatibility and freight transit schedule.'}\n\n` +
          `Kindly connect me with an Arveer Impex Engineering & Sales Specialist.`;
        break;

      case 'SERIAL_VERIFICATION':
      case 'COA_VERIFICATION':
        message = `*Arveer Impex Machinery Serial & Warranty Verification*\n` +
          `• Engine / Chassis Serial: ${req.lotNumber || 'AG-ENG-170F-2026-P'}\n` +
          `• Equipment Model: ${req.productId || 'Agroveer™ 170F 7.5 HP Engine'}\n` +
          `• Request: Factory bench testing certificate & manufacturer warranty registration.`;
        break;

      case 'BULK_DEALERSHIP_PRICING':
      case 'BULK_PRICING':
        message = `*Arveer Impex B2B Wholesale Dealership Inquiry*\n` +
          `• Firm / Dealership: ${req.firmName || 'Authorized Farm Equipment Stockist'}\n` +
          `• Location: ${req.location || 'Maharashtra / Gujarat / Punjab / MP'}\n` +
          `• Order Volume: Master Cartons / Container Consignment\n\n` +
          `Please provide B2B wholesale price list with freight bilty terms.`;
        break;

      case 'CART_CHECKOUT':
        const itemsList = req.items?.map(i => `  - ${i.name} (${i.packageSize || 'Unit'}) × ${i.quantity} = ₹${(i.unitPriceINR * i.quantity).toLocaleString('en-IN')}`).join('\n') || '  - Agroveer 170F 7.5 HP Engine with Pulley × 2';
        message = `*ARVEER IMPEX — Official Purchase Order Schedule*\n\n` +
          `Consignment Items:\n${itemsList}\n\n` +
          `Please confirm warehouse bench testing, transport godown dispatch, and commercial tax invoice.`;
        break;

      default:
        message = `Hello Arveer Impex Team, I would like to inquire about Agroveer agricultural machinery and Sawking cutting systems.`;
    }

    const deepLink = `https://wa.me/${AGROVE_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    return { message, deepLink };
  }
}

