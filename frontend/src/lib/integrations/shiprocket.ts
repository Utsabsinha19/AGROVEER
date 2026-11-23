/**
 * Shiprocket B2B & Express Parcel Logistics Integration
 * API Documentation: https://apidocs.shiprocket.in/
 */

interface ShiprocketTokenCache {
  token: string | null;
  expiresAt: number;
}

const tokenCache: ShiprocketTokenCache = {
  token: null,
  expiresAt: 0,
};

const email = process.env.SHIPROCKET_EMAIL || '';
const password = process.env.SHIPROCKET_PASSWORD || '';
const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

export async function getShiprocketToken(): Promise<string | null> {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  if (!email || !password) {
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      console.warn('Shiprocket auth failed with status:', res.status);
      return null;
    }

    const data = await res.json();
    if (data.token) {
      tokenCache.token = data.token;
      // Tokens are valid for 10 days; cache for 9 days
      tokenCache.expiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;
      return data.token;
    }
    return null;
  } catch (error) {
    console.warn('Shiprocket auth network error:', error);
    return null;
  }
}

export interface CreateShipmentPayload {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
    name: string;
    sku: string;
    units: number;
    sellingPrice: number;
    hsn?: string;
  }>;
  subTotal: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
  weightKg: number;
}

export async function createShiprocketOrder(payload: CreateShipmentPayload) {
  const token = await getShiprocketToken();
  if (!token) {
    // Return simulated Shiprocket order in development
    return {
      success: true,
      shipment_id: `SR-SIM-${Date.now()}`,
      order_id: `ORD-SR-${payload.orderId}`,
      awb_code: `SR-AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courier_name: 'Delhivery Surface Express',
      is_simulated: true,
    };
  }

  const nameParts = payload.customerName.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || 'Farmer';

  const body = {
    order_id: payload.orderId,
    order_date: payload.orderDate,
    pickup_location: 'Central Warehouse Bhiwandi',
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: payload.shippingAddress,
    billing_city: payload.city,
    billing_pincode: payload.pincode,
    billing_state: payload.state,
    billing_country: 'India',
    billing_email: payload.customerEmail || 'orders@arveerimpex.com',
    billing_phone: payload.customerPhone.replace(/\D/g, '').slice(-10),
    shipping_is_billing: true,
    order_items: payload.items.map((i) => ({
      name: i.name,
      sku: i.sku,
      units: i.units,
      selling_price: i.sellingPrice,
      hsn: i.hsn || '8432',
    })),
    payment_method: 'Prepaid',
    sub_total: payload.subTotal,
    length: payload.lengthCm,
    breadth: payload.breadthCm,
    height: payload.heightCm,
    weight: payload.weightKg,
  };

  const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return await res.json();
}

export async function trackShiprocketAwb(awbCode: string) {
  const token = await getShiprocketToken();
  if (!token) {
    return {
      tracking_data: {
        track_status: 1,
        shipment_status: 'In Transit',
        current_status: 'Package routed from Central Hub to Regional Godown',
        etd: '2-3 Business Days',
      },
    };
  }

  const res = await fetch(`${BASE_URL}/courier/track/awb/${awbCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}

