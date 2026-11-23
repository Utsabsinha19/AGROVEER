import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';

export class OrdersController {
  public static create(req: Request, res: Response) {
    const { 
      customer, 
      items, 
      paymentMethod, 
      paymentDetails, 
      discountINR, 
      couponCode,
      shippingAddress,
      buyerGstin,
      orderType
    } = req.body;

    // Normalize consignee/customer from either schema format
    let consignee = customer;
    if (!consignee && shippingAddress) {
      consignee = {
        fullName: shippingAddress.name || 'B2B Consignee',
        phone: shippingAddress.phone || '+91 80049 22476',
        email: shippingAddress.email || 'dispatch@arveerimpex.com',
        firmName: shippingAddress.name || 'Commercial Machinery Mart',
        gstin: buyerGstin || shippingAddress.gstin || '27AABCU9603R1ZX',
        address: shippingAddress.street || 'Central Transport Nagar',
        city: shippingAddress.city || 'Sangli',
        state: shippingAddress.state || 'Maharashtra',
        pinCode: shippingAddress.pinCode || '416416',
        country: 'India'
      };
    }

    if (!consignee || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order payload. Consignee details and non-empty items array are required.'
      });
    }

    // Normalize order items
    const normalizedItems = items.map((it: any) => {
      const unitPrice = it.unitPrice || it.unitPriceINR || it.price || 500;
      const qty = it.quantity || 1;
      return {
        productId: it.productId || it.sku || `SKU-${it.sku}`,
        sku: it.sku || it.productId || 'AG-SKU',
        name: it.name || it.productName || `Agroveer / Sawking ${it.sku || 'Equipment'}`,
        model: it.model || it.sku || 'Standard Model',
        hsnCode: it.hsnCode,
        quantity: qty,
        unitPriceINR: unitPrice,
        totalINR: unitPrice * qty
      };
    });

    const order = OrderService.createOrder({
      customer: consignee,
      items: normalizedItems,
      orderType: orderType || (buyerGstin || consignee.gstin ? 'B2B_WHOLESALE' : 'B2C'),
      paymentMethod,
      paymentDetails,
      discountINR,
      couponCode
    });

    return res.status(201).json({
      success: true,
      message: 'Commercial machinery order confirmed and registered for freight dispatch.',
      orderId: order.id,
      orderNumber: order.orderNumber,
      taxableSubtotal: order.taxableSubtotalINR,
      cgst: order.cgstAmountINR,
      sgst: order.sgstAmountINR,
      igst: order.igstAmountINR,
      totalTax: order.taxINR,
      totalAmount: order.totalINR,
      freightTier: order.logistics.shipmentTier,
      billableWeightKg: order.logistics.actualWeightKg,
      paymentRouting: {
        recommendedMethod: order.totalINR > 50000 ? 'VIRTUAL_ACCOUNT_NEFT' : 'RAZORPAY_ONLINE',
        virtualAccount: {
          beneficiaryName: `Arveer Impex - Order ${order.orderNumber || order.id}`,
          accountNumber: `ARVEER${(order.orderNumber || order.id).replace(/[^0-9]/g, '')}`,
          ifsc: 'ICIC0000104',
          bankName: 'ICICI Bank Ltd.'
        }
      },
      data: order
    });
  }

  public static getById(req: Request, res: Response) {
    const { id } = req.params;
    const order = OrderService.getOrder(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order with ID '${id}' not found`
      });
    }

    return res.json({
      success: true,
      data: order
    });
  }

  public static updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required.'
      });
    }

    const updated = OrderService.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Order with ID '${id}' not found`
      });
    }

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updated
    });
  }

  public static list(_req: Request, res: Response) {
    const orders = OrderService.listOrders();
    return res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  }
}
