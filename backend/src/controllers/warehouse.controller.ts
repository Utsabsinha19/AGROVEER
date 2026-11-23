import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';
import { WhatsAppService } from '../services/whatsapp.service.js';

export class WarehouseController {
  /**
   * POST /api/warehouse/scan-serial
   * Section 11.2 Warehouse Serial Scan Endpoint
   */
  public static scanSerial(req: Request, res: Response) {
    const { 
      order_id, 
      orderId, 
      product_id, 
      productId, 
      engine_serial_number, 
      engineSerialNumber, 
      serialNumber, 
      staff_id, 
      staffId, 
      warranty_months, 
      warrantyMonths 
    } = req.body;
    
    const targetOrderId = order_id || orderId;
    const targetProductId = product_id || productId;
    const targetSerial = engine_serial_number || engineSerialNumber || serialNumber;
    const targetWarranty = warranty_months || warrantyMonths || 6;

    if (!targetOrderId || !targetSerial) {
      return res.status(400).json({
        success: false,
        error: 'orderId and engineSerialNumber are mandatory for warehouse verification.'
      });
    }

    const result = OrderService.assignSerialNumber({
      orderId: targetOrderId,
      productId: targetProductId || '',
      serialOrEngineNumber: targetSerial,
      staffId: staff_id || staffId,
      warrantyMonths: targetWarranty
    });

    if (!result.success) {
      const isDuplicate = result.message.toLowerCase().includes('already') || result.message.toLowerCase().includes('duplicate');
      return res.status(isDuplicate ? 409 : 400).json({
        success: false,
        error: result.message
      });
    }

    const order = OrderService.getOrder(targetOrderId);
    const hsm = order ? WhatsAppService.generateHSMMessage('qc-serial-registration', order, { serialNumber: targetSerial }) : null;

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        serial: result.serial,
        orderStatus: order?.status,
        hsmPreview: hsm
      }
    });
  }

  /**
   * POST /api/warehouse/dispatch
   * Section 11.3 Transport Dispatch & Bilty Upload
   */
  public static dispatch(req: Request, res: Response) {
    const { 
      order_id, 
      orderId,
      shipment_tier, 
      shipmentTier,
      carrier_name, 
      carrierName,
      lr_number, 
      lrNumber,
      awb_or_lr_number,
      awbOrLrNumber,
      lr_image_base64, 
      lrImageBase64,
      lr_bilty_image_url,
      lrBiltyImageUrl,
      destination_godown, 
      destinationGodown,
      destination_godown_address,
      destinationGodownAddress,
      godown_phone, 
      godownPhone,
      destination_godown_phone,
      destinationGodownPhone,
      total_packages, 
      totalPackages,
      actual_weight_kg, 
      actualWeightKg 
    } = req.body;

    const targetOrderId = order_id || orderId;
    const targetCarrier = carrier_name || carrierName || 'VRL Logistics Ltd.';
    const targetLr = lr_number || lrNumber || awb_or_lr_number || awbOrLrNumber;

    if (!targetOrderId || !targetLr) {
      return res.status(400).json({
        success: false,
        error: 'orderId and awbOrLrNumber (or lrNumber) are mandatory for dispatch logging.'
      });
    }

    const result = OrderService.recordDispatch({
      orderId: targetOrderId,
      shipmentTier: shipment_tier || shipmentTier || 'HEAVY_ROAD_TRANSPORT',
      carrierName: targetCarrier,
      lrNumber: targetLr,
      lrImageBase64: lr_image_base64 || lrImageBase64 || lr_bilty_image_url || lrBiltyImageUrl,
      destinationGodown: destination_godown || destinationGodown || destination_godown_address || destinationGodownAddress,
      godownPhone: godown_phone || godownPhone || destination_godown_phone || destinationGodownPhone,
      totalPackages: total_packages || totalPackages || 1,
      actualWeightKg: actual_weight_kg || actualWeightKg || 25.0
    });

    if (!result.success || !result.order) {
      return res.status(400).json({
        success: false,
        error: result.message
      });
    }

    const hsm = WhatsAppService.generateHSMMessage('road-transport-bilty-dispatch', result.order);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        order: result.order,
        hsmPreview: hsm
      }
    });
  }

  /**
   * GET /api/warehouse/pick-list/:orderId
   */
  public static getPickList(req: Request, res: Response) {
    const { orderId } = req.params;
    const order = OrderService.getOrder(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order with ID '${orderId}' not found.`
      });
    }

    return res.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        invoiceNumber: order.invoiceNumber,
        orderStatus: order.status,
        customerName: order.customer.fullName,
        destination: `${order.customer.city}, ${order.customer.state}`,
        items: order.items.map(item => ({
          productId: item.productId,
          name: item.name,
          sku: item.sku || 'AG-COMM-ITEM',
          quantity: item.quantity,
          hsnCode: item.hsnCode,
          weightKg: item.weightKg,
          selectedOption: item.selectedOption
        })),
        scannedSerials: order.serials || [],
        ewayBill: order.ewayBill || null,
        logistics: order.logistics
      }
    });
  }
}

