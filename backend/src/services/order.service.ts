import fs from 'fs';
import path from 'path';
import { Order, OrderItem } from '../types/index.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadOrdersFromFile(): Map<string, Order> {
  const map = new Map<string, Order>();
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
      const list: Order[] = JSON.parse(raw);
      for (const order of list) {
        map.set(order.id, order);
      }
    }
  } catch (err) {
    console.error('[OrderService] Error loading orders from disk:', err);
  }

  // Real-time dynamic order store: strictly load persisted orders without synthetic dummy seeds
  return map;
}

function saveOrdersToFile(map: Map<string, Order>) {
  try {
    const list = Array.from(map.values());
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('[OrderService] Error writing orders to disk:', err);
  }
}

const ordersDb = loadOrdersFromFile();

export class OrderService {
  public static createOrder(payload: {
    customer: Order['customer'];
    items: OrderItem[];
    orderType?: 'B2C' | 'B2B_WHOLESALE';
    paymentMethod?: Order['paymentMethod'];
    paymentDetails?: Order['paymentDetails'];
    discountINR?: number;
    couponCode?: string;
    isAdvanceBooking?: boolean;
  }): Order {
    const randomHex = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${randomHex}`;
    const invoiceNumber = `INV-2026-${randomHex}`;

    // Itemized GST & HSN calculation
    let calculatedSubtotal = 0;
    let calculatedTax = 0;
    let calculatedWeightKg = 0;

    const enrichedItems: OrderItem[] = payload.items.map((item) => {
      const lineSubtotal = item.totalINR || item.unitPriceINR * item.quantity;
      calculatedSubtotal += lineSubtotal;

      // Determine HSN and GST rate based on industrial specs
      let hsn = item.hsnCode || '8432';
      let gstRate = item.gstRate || 0.05;

      const lowerName = item.name.toLowerCase();
      if (lowerName.includes('engine') || lowerName.includes('170f')) {
        hsn = '8407';
        gstRate = 0.18;
      } else if (lowerName.includes('chain') || lowerName.includes('sawking') || lowerName.includes('trimmer')) {
        hsn = '8202';
        gstRate = 0.18;
      } else if (lowerName.includes('bag closer') || lowerName.includes('sealing')) {
        hsn = '8452';
        gstRate = 0.18;
      } else if (lowerName.includes('pump') || lowerName.includes('water')) {
        hsn = '8413';
        gstRate = 0.05;
      } else if (lowerName.includes('auger')) {
        hsn = '8432';
        gstRate = 0.05;
      }

      const lineTax = Math.round(lineSubtotal * gstRate);
      calculatedTax += lineTax;

      const itemWeight = item.weightKg || (lowerName.includes('pump') ? 22 : lowerName.includes('engine') ? 16.5 : lowerName.includes('auger') ? 9.5 : 1.2);
      calculatedWeightKg += itemWeight * item.quantity;

      return {
        ...item,
        hsnCode: hsn,
        gstRate,
        taxAmountINR: lineTax,
        totalINR: lineSubtotal,
        weightKg: itemWeight
      };
    });

    const discount = payload.discountINR || 0;
    const taxableAmount = Math.max(0, calculatedSubtotal - discount);
    
    // Tax split: Maharashtra (State Code 27) is Origin Warehouse
    const isIntraState = (payload.customer.state || '').trim().toLowerCase().includes('maharashtra');
    let cgstAmountINR = 0;
    let sgstAmountINR = 0;
    let igstAmountINR = 0;

    if (isIntraState) {
      cgstAmountINR = Math.round(calculatedTax / 2);
      sgstAmountINR = calculatedTax - cgstAmountINR;
      igstAmountINR = 0;
    } else {
      cgstAmountINR = 0;
      sgstAmountINR = 0;
      igstAmountINR = calculatedTax;
    }

    const shippingINR = taxableAmount >= 15000 ? 0 : (calculatedWeightKg > 10 ? 850 : 350);
    const totalINR = taxableAmount + calculatedTax + shippingINR;

    // Logistics tier routing
    const shipmentTier = calculatedWeightKg < 10 ? 'EXPRESS_PARCEL' : 'HEAVY_ROAD_TRANSPORT';
    const defaultCarrier = shipmentTier === 'EXPRESS_PARCEL' ? 'Delhivery Express Parcel' : 'VRL Logistics Heavy Commercial Transport';

    // Order type
    const orderType = payload.orderType || (payload.customer.gstin || payload.customer.firmName ? 'B2B_WHOLESALE' : 'B2C');

    // Payment & status resolution
    const paymentMethod = payload.paymentMethod || 'RAZORPAY_ONLINE';
    let status: Order['status'] = 'PAYMENT_CONFIRMED';
    let paymentStatus: Order['paymentStatus'] = 'PAID';
    let advanceAmountPaid = 0;
    let balanceDue = 0;
    const isAdvance = payload.isAdvanceBooking || paymentMethod === 'TWO_STAGE_BOOKING_ADVANCE';

    if (isAdvance) {
      status = 'ADVANCE_PAID_AWAITING_BALANCE';
      paymentStatus = 'PARTIALLY_PAID';
      advanceAmountPaid = Math.round(totalINR * 0.20);
      balanceDue = totalINR - advanceAmountPaid;
    } else if (paymentMethod === 'VIRTUAL_ACCOUNT_NEFT') {
      status = 'PENDING_PAYMENT';
      paymentStatus = 'PENDING_VERIFICATION';
    } else if (paymentMethod === 'PAY_ON_DELIVERY') {
      status = 'PENDING_PAYMENT';
      paymentStatus = 'PENDING_VERIFICATION';
    }

    // Payment details & Virtual Escrow account setup
    const paymentDetails = payload.paymentDetails || {};
    if (paymentMethod === 'VIRTUAL_ACCOUNT_NEFT' || totalINR > 50000) {
      paymentDetails.virtualAccount = {
        beneficiaryName: `Arveer Impex - Order #${orderId}`,
        virtualAccountNumber: `ARVEER${orderId.replace('-', '')}`,
        virtualIfsc: 'ICIC0000104',
        bankName: 'ICICI Bank Ltd. Escrow Smart Collect'
      };
    }

    // E-Way Bill evaluation (> ₹50,000 threshold)
    let ewayBill: Order['ewayBill'] = undefined;
    if (totalINR >= 50000) {
      const ewbNum = `2410${Math.floor(10000000 + Math.random() * 90000000)}`;
      const validUntil = new Date(Date.now() + 72 * 3600 * 1000).toISOString();
      ewayBill = {
        ewayBillNumber: ewbNum,
        generatedAt: new Date().toISOString(),
        validUntil,
        docUrl: `/api/orders/${orderId}/eway-bill`
      };
    }

    const newOrder: Order = {
      id: orderId,
      orderNumber: `AG-2026-${randomHex}`,
      invoiceNumber,
      createdAt: new Date().toISOString(),
      customer: payload.customer,
      items: enrichedItems,
      orderType,
      subtotalINR: calculatedSubtotal,
      taxableSubtotalINR: taxableAmount,
      cgstAmountINR,
      sgstAmountINR,
      igstAmountINR,
      taxINR: calculatedTax,
      shippingINR,
      totalINR,
      advanceAmountPaid,
      balanceDue,
      isAdvanceBooking: isAdvance,
      discountINR: discount,
      couponCode: payload.couponCode,
      paymentMethod,
      paymentStatus,
      paymentDetails,
      status,
      ewayBill,
      serials: [],
      logistics: {
        shipmentTier,
        carrier: defaultCarrier,
        lrNumber: `LR-MH-${randomHex}`,
        originWarehouse: 'Arveer Impex Bhiwandi Central Machinery Logistics Hub',
        destinationCity: payload.customer.city || 'India',
        destinationGodownAddress: payload.customer.address,
        destinationGodownPhone: payload.customer.phone,
        totalPackages: Math.max(1, Math.ceil(enrichedItems.reduce((acc, it) => acc + it.quantity, 0) / 2)),
        actualWeightKg: Math.round(calculatedWeightKg * 10) / 10,
        estimatedDeliveryDays: isIntraState ? 2 : 4
      }
    };

    ordersDb.set(orderId, newOrder);
    saveOrdersToFile(ordersDb);
    return newOrder;
  }

  public static getOrder(id: string): Order | undefined {
    return ordersDb.get(id);
  }

  public static updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const order = ordersDb.get(id);
    if (!order) return undefined;
    order.status = status;
    ordersDb.set(id, order);
    saveOrdersToFile(ordersDb);
    return order;
  }

  public static assignSerialNumber(params: {
    orderId: string;
    productId: string;
    serialOrEngineNumber: string;
    staffId?: string;
    warrantyMonths?: number;
  }): { success: boolean; message: string; serial?: any } {
    const order = ordersDb.get(params.orderId);
    if (!order) {
      return { success: false, message: `Order #${params.orderId} not found.` };
    }

    if (!order.serials) {
      order.serials = [];
    }

    // Check if serial already scanned in any order or same order
    for (const [_, o] of ordersDb.entries()) {
      const match = (o.serials || []).find(s => s.serialOrEngineNumber.toUpperCase() === params.serialOrEngineNumber.toUpperCase());
      if (match) {
        return { 
          success: false, 
          message: `Engine Serial '${params.serialOrEngineNumber}' has already been registered (Order #${o.id}). Duplicate scanning rejected.` 
        };
      }
    }

    const warrantyMonths = params.warrantyMonths || 6;
    const validUntilDate = new Date();
    validUntilDate.setMonth(validUntilDate.getMonth() + warrantyMonths);

    const product = order.items.find(i => i.productId === params.productId);

    const serialEntry = {
      id: `SER-${Date.now()}`,
      orderId: params.orderId,
      productId: params.productId,
      productName: product ? product.name : 'Machinery Unit',
      serialOrEngineNumber: params.serialOrEngineNumber.trim().toUpperCase(),
      scannedByStaffId: params.staffId || 'STAFF-CENTRAL-BHIWANDI',
      scannedAt: new Date().toISOString(),
      warrantyMonths,
      warrantyValidUntil: validUntilDate.toISOString().split('T')[0]
    };

    order.serials.push(serialEntry);
    
    // Count total machinery pieces that require individual serial tracking
    const totalMachineryUnits = order.items
      .filter(it => {
        const h = it.hsnCode || '';
        const n = it.name.toLowerCase();
        return h === '8432' || h === '8413' || h === '8407' || h === '8452' || 
               n.includes('auger') || n.includes('pump') || n.includes('engine') || n.includes('closer');
      })
      .reduce((sum, it) => sum + it.quantity, 0);

    // Progress state machine: PACKED_SERIALS_ASSIGNED when all machines are serial registered
    if (order.serials.length >= totalMachineryUnits && totalMachineryUnits > 0) {
      order.status = 'PACKED_SERIALS_ASSIGNED';
    } else {
      order.status = 'PROCESSING_IN_WAREHOUSE';
    }

    ordersDb.set(params.orderId, order);
    saveOrdersToFile(ordersDb);

    return { 
      success: true, 
      message: `Engine serial '${serialEntry.serialOrEngineNumber}' registered with ${warrantyMonths}-month warranty certificate.`,
      serial: serialEntry
    };
  }

  public static recordDispatch(params: {
    orderId: string;
    shipmentTier?: 'EXPRESS_PARCEL' | 'HEAVY_ROAD_TRANSPORT';
    carrierName: string;
    lrNumber: string;
    lrImageBase64?: string;
    destinationGodown?: string;
    godownPhone?: string;
    totalPackages?: number;
    actualWeightKg?: number;
  }): { success: boolean; message: string; order?: Order } {
    const order = ordersDb.get(params.orderId);
    if (!order) {
      return { success: false, message: `Order #${params.orderId} not found.` };
    }

    order.logistics.carrier = params.carrierName;
    order.logistics.lrNumber = params.lrNumber;
    if (params.shipmentTier) order.logistics.shipmentTier = params.shipmentTier;
    if (params.lrImageBase64) order.logistics.lrBiltyDocumentUrl = params.lrImageBase64;
    if (params.destinationGodown) order.logistics.destinationGodownAddress = params.destinationGodown;
    if (params.godownPhone) order.logistics.destinationGodownPhone = params.godownPhone;
    if (params.totalPackages) order.logistics.totalPackages = params.totalPackages;
    if (params.actualWeightKg) order.logistics.actualWeightKg = params.actualWeightKg;

    // Transition state machine
    order.status = 'DISPATCHED';

    ordersDb.set(params.orderId, order);
    saveOrdersToFile(ordersDb);

    return {
      success: true,
      message: `Consignment for Order #${params.orderId} marked DISPATCHED with Lorry Receipt (Bilty) #${params.lrNumber}.`,
      order
    };
  }

  public static listOrders(): Order[] {
    return Array.from(ordersDb.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
