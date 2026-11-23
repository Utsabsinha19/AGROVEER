export type ProductCategory = 
  | 'All'
  | 'Farm Machinery & Engines'
  | 'Agriculture Water Pumps'
  | 'Earth Augers & Boring'
  | 'Packaging & Bag Closers'
  | 'Cutting Tools & Consumables'
  | 'Power Equipment Spares';

export type ProductBrand = 'Agroveer' | 'Sawking' | 'Arveer Impex';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductAttachment {
  name: string;
  sku: string;
  price: number;
  fitmentNote: string;
}

export interface Product {
  id: string;
  sku?: string;
  brand?: ProductBrand;
  name: string;
  scientificName?: string; // Used for technical model & displacement descriptor
  tagline: string;
  category: ProductCategory;
  hsnCode?: string; // E.g. '8432', '8413', '8407', '8202', '8467', '8452'
  price: number; // Final consumer price incl. GST
  originalPrice?: number;
  exGstPrice?: number; // Base price excl. GST for B2B dealers
  gstRate?: number; // E.g. 0.05 for 5% GST, 0.18 for 18% GST
  rating: number;
  reviewCount: number;
  image: string;
  badges: string[];
  inStock: boolean;
  inventoryCount: number;
  description: string;
  detailedDescription: string;
  organicCertified?: boolean;
  applicationRate?: string;
  volumeOrWeight: string;
  weightGrams?: number;
  dimensionsCm?: { length: number; width: number; height: number };
  wholesaleMoq?: number;
  masterCartonUnits?: number;
  isMachinery?: boolean;
  keyBenefits: string[];
  composition: { name: string; percentage: string }[];
  specs: ProductSpec[];
  featured?: boolean;
  bestSeller?: boolean;
  videoUrl?: string;
  compatibleSpares?: string[]; // IDs of compatible spare parts
  compatibleMachines?: string[]; // For spares: IDs/names of machines this fits
  attachments?: ProductAttachment[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productSku?: string;
  productName: string;
  productImage: string;
  price: number;
  exGstPrice?: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  gstin?: string;
  companyName?: string;
  isB2B?: boolean;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  baseExGstSubtotal?: number;
  wholesaleDiscount?: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'razorpay' | 'card' | 'bank_transfer' | 'cod' | 'whatsapp_po';
  paymentStatus: 'Paid' | 'Authorized' | 'Pending';
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  farm: string;
  location: string;
  quote: string;
  yieldGain: string;
  avatar: string;
  verifiedCrop: string;
}

export interface StoryStage {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  scientificNote: string;
  metrics: { label: string; value: string }[];
  color?: string;
}

export interface SparePartItem {
  id: string;
  sku: string;
  name: string;
  brand: ProductBrand;
  category: string;
  masterCategory?: string;
  priceExGst: number;
  priceGst: number;
  gstRate: number;
  inStock: boolean;
  leadTime: string;
  fitsDescription: string;
  parentMachineIds: string[];
  image: string;
  diagramPosition?: string;
  demand?: string;
  stockStatus?: string;
}

export interface ParentMachineProfile {
  id: string;
  name: string;
  brand: ProductBrand;
  category: ProductCategory;
  image: string;
  specsSummary: string;
  shaftType: string;
  fuelType: string;
  sparesCount: number;
  hotFeatures: string[];
}
