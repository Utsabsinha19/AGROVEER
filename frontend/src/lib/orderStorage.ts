// Real Order Storage and Synchronization Service for Arveer Impex / AGROVÉ

export interface StoredOrderItem {
  productId: string;
  sku?: string;
  name: string;
  model?: string;
  hsnCode?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  image?: string;
  weightKg?: number;
  selectedOption?: string;
}

export type StoredOrderStatus = 
  | 'PENDING_PAYMENT' 
  | 'PAYMENT_CONFIRMED' 
  | 'ADVANCE_PAID_AWAITING_BALANCE'
  | 'PROCESSING_IN_WAREHOUSE' 
  | 'PACKED_SERIALS_ASSIGNED' 
  | 'DISPATCHED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED'
  | 'ORDER_CONFIRMED'
  | 'PACKED_READY';

export interface StoredItemSerial {
  id?: string;
  orderId: string;
  productId: string;
  productName?: string;
  serialOrEngineNumber: string;
  scannedAt: string;
  warrantyMonths: number;
  warrantyValidUntil: string;
}

export interface StoredOrder {
  id: string;
  orderNumber?: string;
  invoiceNumber: string;
  createdAt: string;
  orderType?: 'B2C' | 'B2B_WHOLESALE';
  customer: {
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    email: string;
    companyName?: string;
    gstin?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    orderNotes?: string;
  };
  items: StoredOrderItem[];
  subtotal: number;
  taxableSubtotal?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  tax: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  total: number;
  isAdvanceBooking?: boolean;
  advanceAmountPaid?: number;
  balanceDue?: number;
  paymentMethod: 'razorpay' | 'virtual_account' | 'two_stage_advance' | 'bank_transfer' | 'whatsapp' | 'cod';
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'PENDING_VERIFICATION' | 'AUTHORIZED';
  paymentDetails: {
    transactionId?: string;
    utrNumber?: string;
    upiId?: string;
    paymentMode?: string;
    virtualAccount?: {
      beneficiaryName: string;
      virtualAccountNumber: string;
      virtualIfsc: string;
      bankName: string;
    };
  };
  status: StoredOrderStatus;
  ewayBill?: {
    ewayBillNumber: string;
    generatedAt: string;
    validUntil: string;
    docUrl?: string;
  };
  serials?: StoredItemSerial[];
  logistics: {
    shipmentTier?: 'EXPRESS_PARCEL' | 'HEAVY_ROAD_TRANSPORT';
    carrier: string;
    lrNumber: string;
    lrBiltyDocumentUrl?: string;
    originWarehouse: string;
    destinationCity: string;
    destinationGodownAddress?: string;
    destinationGodownPhone?: string;
    totalPackages?: number;
    actualWeightKg?: number;
    estimatedDeliveryDays: number;
  };
}

const STORAGE_KEY_ORDERS = 'agrove_commercial_orders';
const STORAGE_KEY_ORDER_PREFIX = 'order_';

export const getBackendApiUrl = (): string => {
  // 1. Server-side in Next.js (via Vercel service binding BACKEND_URL)
  if (typeof window === 'undefined' && process.env.BACKEND_URL) {
    return new URL('/api', process.env.BACKEND_URL).toString().replace(/\/$/, '');
  }
  // 2. Client-side in browser: relative path routed via Vercel rewrites
  if (typeof window !== 'undefined') {
    return (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
  }
  // 3. Local development fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

export const orderStorage = {
  // Save order to localStorage and sync with backend Express API
  saveOrder: async (order: StoredOrder): Promise<StoredOrder> => {
    if (typeof window !== 'undefined') {
      try {
        // 1. Save single order
        localStorage.setItem(`${STORAGE_KEY_ORDER_PREFIX}${order.id}`, JSON.stringify(order));

        // 2. Append to all orders list
        const existingList = orderStorage.getAllOrders();
        const filtered = existingList.filter((o) => o.id !== order.id);
        const updatedList = [order, ...filtered];
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedList));
      } catch (err) {
        console.error('[orderStorage] Error saving order to localStorage:', err);
      }
    }

    // 3. Sync to backend API asynchronously
    try {
      const backendApi = getBackendApiUrl();
      await fetch(`${backendApi}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            fullName: `${order.customer.firstName} ${order.customer.lastName}`,
            phone: order.customer.phone,
            email: order.customer.email,
            firmName: order.customer.companyName,
            gstin: order.customer.gstin,
            address: order.customer.address,
            city: order.customer.city,
            state: order.customer.state,
            pinCode: order.customer.postalCode,
            country: order.customer.country || 'India'
          },
          items: order.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            model: item.model || 'Standard',
            quantity: item.quantity,
            unitPriceINR: item.unitPrice,
            totalINR: item.total,
            image: item.image
          })),
          paymentMethod: order.paymentMethod === 'razorpay' ? 'RAZORPAY_ONLINE' :
                         order.paymentMethod === 'bank_transfer' ? 'BANK_NEFT_RTGS' :
                         order.paymentMethod === 'whatsapp' ? 'WHATSAPP_B2B' : 'PAY_ON_DELIVERY',
          paymentDetails: order.paymentDetails,
          discountINR: order.discount,
          couponCode: order.couponCode
        })
      });
    } catch {
      // Offline fallback: order is safely stored in localStorage
    }

    return order;
  },

  // Get order by ID from local storage or backend
  getOrder: (id: string): StoredOrder | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_ORDER_PREFIX}${id}`);
      if (raw) {
        return JSON.parse(raw);
      }
      // Check in list
      const list = orderStorage.getAllOrders();
      const match = list.find((o) => o.id === id);
      if (match) return match;
    } catch (err) {
      console.error('[orderStorage] Error reading order:', err);
    }
    return null;
  },

  // Get all orders (Real-time persisted authentic orders only - zero mock data)
  getAllOrders: (): StoredOrder[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (raw) {
        const parsed: StoredOrder[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Strictly filter out any obsolete demo/mock orders from earlier test runs
          const cleaned = parsed.filter(
            (o) =>
              o &&
              o.id !== 'ORD-928410' &&
              o.id !== 'ORD-928392' &&
              o.id !== 'AGR-928410' &&
              o.id !== 'AGR-928392' &&
              !o.id.startsWith('DEMO-')
          );
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(cleaned));
            localStorage.removeItem('order_ORD-928410');
            localStorage.removeItem('order_ORD-928392');
          }
          return cleaned;
        }
      }
    } catch (err) {
      console.error('[orderStorage] Error loading orders list:', err);
    }

    return [];
  },

  // Update status of an existing order
  updateOrderStatus: (id: string, status: StoredOrder['status']): StoredOrder | null => {
    if (typeof window === 'undefined') return null;
    const orders = orderStorage.getAllOrders();
    const target = orders.find((o) => o.id === id);
    if (!target) return null;

    target.status = status;
    const updatedList = orders.map((o) => (o.id === id ? target : o));
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedList));
      localStorage.setItem(`${STORAGE_KEY_ORDER_PREFIX}${id}`, JSON.stringify(target));
    } catch {
      // ignore
    }

    // Sync to backend asynchronously
    try {
      const backendApi = getBackendApiUrl();
      fetch(`${backendApi}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).catch(() => {});
    } catch {
      // ignore
    }

    return target;
  }
};

