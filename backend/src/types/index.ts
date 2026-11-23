export interface Product {
  id: string;
  sku?: string;
  name: string;
  subtitle?: string;
  brand?: 'Agroveer' | 'Sawking' | 'Arveer Impex';
  modelNumber?: string;
  category: string;
  hsnCode?: string;
  priceINR: number;
  originalPriceINR?: number;
  wholesalePriceINR?: number;
  wholesaleMoq?: number;
  gstRate?: number; // 0.05 or 0.18
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  inventoryCount?: number;
  packageSizes?: string[];
  image?: string;
  description: string;
  application?: string;
  lotNumber?: string;
  weightGrams?: number;
  dimensionsCm?: { length: number; width: number; height: number };
  isMachinery?: boolean;
  masterCartonUnits?: number;
  activeBioCompounds?: string[];
  certifications?: string[];
  shelfLife?: string;
  coveragePerUnit?: string;
  keyBenefits?: string[];
  specs?: { label: string; value: string }[];
  compatibilityNotes?: string;
}

export interface CatalogItem {
  id: string;
  code: string;
  name: string;
  category: string;
  formulation: string;
  potency: string;
  recommendedCrops: string[];
  dilutionRate: string;
  packagingAvailable: string[];
  basePriceINR: number;
}

export interface OrderItem {
  productId: string;
  sku?: string;
  name: string;
  model?: string;
  hsnCode?: string;
  packageSize?: string;
  quantity: number;
  unitPriceINR: number;
  gstRate?: number;
  taxAmountINR?: number;
  totalINR?: number;
  image?: string;
  weightKg?: number;
  selectedOption?: string;
}

export interface ItemSerialNumber {
  id?: string;
  orderId: string;
  productId: string;
  productName?: string;
  serialOrEngineNumber: string;
  scannedByStaffId?: string;
  scannedAt: string;
  warrantyMonths: number;
  warrantyValidUntil: string;
}

export interface ShipmentDetails {
  id?: string;
  orderId?: string;
  shipmentTier: 'EXPRESS_PARCEL' | 'HEAVY_ROAD_TRANSPORT';
  carrierName: string;
  awbOrLrNumber: string;
  lrBiltyDocumentUrl?: string;
  destinationGodownAddress?: string;
  destinationGodownPhone?: string;
  totalPackages: number;
  actualWeightKg: number;
  dispatchTimestamp?: string;
  estimatedArrivalDate?: string;
  deliveryStatus?: 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
}

export type OrderStatus = 
  | 'PENDING_PAYMENT' 
  | 'PAYMENT_CONFIRMED' 
  | 'ADVANCE_PAID_AWAITING_BALANCE'
  | 'PROCESSING_IN_WAREHOUSE' 
  | 'PACKED_SERIALS_ASSIGNED' 
  | 'DISPATCHED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber?: string;
  invoiceNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    firmName?: string;
    gstin?: string;
    isGstVerified?: boolean;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    orderNotes?: string;
  };
  items: OrderItem[];
  orderType: 'B2C' | 'B2B_WHOLESALE';
  subtotalINR: number;
  taxableSubtotalINR?: number;
  cgstAmountINR: number;
  sgstAmountINR: number;
  igstAmountINR: number;
  taxINR: number;
  shippingINR: number;
  discountINR?: number;
  couponCode?: string;
  totalINR: number;
  advanceAmountPaid?: number;
  balanceDue?: number;
  isAdvanceBooking?: boolean;
  paymentMethod: 
    | 'RAZORPAY_ONLINE' 
    | 'VIRTUAL_ACCOUNT_NEFT' 
    | 'TWO_STAGE_BOOKING_ADVANCE' 
    | 'BANK_NEFT_RTGS' 
    | 'PAY_ON_DELIVERY' 
    | 'WHATSAPP_B2B';
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'PENDING_VERIFICATION' | 'AUTHORIZED';
  paymentDetails?: {
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
  status: OrderStatus;
  ewayBill?: {
    ewayBillNumber: string;
    generatedAt: string;
    validUntil: string;
    docUrl?: string;
  };
  serials?: ItemSerialNumber[];
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

export interface WhatsAppInquiryRequest {
  type: string;
  name?: string;
  phone?: string;
  firmName?: string;
  location?: string;
  productLine?: string;
  cropType?: string;
  acreage?: number;
  productId?: string;
  notes?: string;
  lotNumber?: string;
  items?: { name: string; packageSize: string; quantity: number; unitPriceINR: number }[];
  message?: string;
}
