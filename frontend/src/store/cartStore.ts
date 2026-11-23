import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '../types';

export interface WholesaleTierInfo {
  tierName: string;
  discountPercentage: number;
  qualifies: boolean;
  nextTierRemaining: number;
}

export interface WeightAndFreightInfo {
  actualWeightKg: number;
  volumetricWeightKg: number;
  billedWeightKg: number;
  shipmentTier: 'EXPRESS_PARCEL' | 'HEAVY_ROAD_TRANSPORT';
  routingDescription: string;
}

interface CartState {
  items: CartItem[];
  wishlistIds: string[];
  isCartOpen: boolean;
  promoCode: string;
  discountAmount: number;
  promoError: string | null;
  isB2BMode: boolean;
  gstin: string;
  companyName: string;
  
  // Actions
  addItem: (product: Product, quantity?: number, selectedOption?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  setB2BMode: (isB2B: boolean) => void;
  setB2BDetails: (gstin: string, companyName: string) => void;
  
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  
  // Computed helpers
  getItemCount: () => number;
  getBaseExGstSubtotal: () => number;
  getGstAmount: () => number;
  getTaxSplit: (stateName?: string) => { isIntraState: boolean; cgst: number; sgst: number; igst: number; totalGst: number };
  getWeightAndFreightInfo: () => WeightAndFreightInfo;
  getCompatibilityAlerts: () => string[];
  getWholesaleTierInfo: () => WholesaleTierInfo;
  getWholesaleDiscountAmount: () => number;
  getSubtotal: () => number; // Subtotal of products (gross)
  getShippingCost: () => number;
  getTotal: () => number;
  getFormattedWhatsAppOrderText: () => string;
}

const FREE_SHIPPING_THRESHOLD = 15000; // Free transport freight for orders over ₹15,000
const STANDARD_SHIPPING = 450; // Standard insured freight logistics

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlistIds: [],
      isCartOpen: false,
      promoCode: '',
      discountAmount: 0,
      promoError: null,
      isB2BMode: true,
      gstin: '',
      companyName: '',

      addItem: (product, quantity = 1, selectedOption) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedOption === selectedOption
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems, isCartOpen: true };
          } else {
            return {
              items: [...state.items, { product, quantity, selectedOption }],
              isCartOpen: true,
            };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.product.id !== productId) };
          }
          const newItems = state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
          return { items: newItems };
        });
      },

      clearCart: () => {
        set({ items: [], promoCode: '', discountAmount: 0, promoError: null });
      },

      setCartOpen: (open) => set({ isCartOpen: open }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setB2BMode: (isB2B) => set({ isB2BMode: isB2B }),
      setB2BDetails: (gstin, companyName) => set({ gstin, companyName }),

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlistIds.includes(productId);
          return {
            wishlistIds: exists
              ? state.wishlistIds.filter((id) => id !== productId)
              : [...state.wishlistIds, productId],
          };
        });
      },

      isInWishlist: (productId) => {
        return get().wishlistIds.includes(productId);
      },

      applyPromoCode: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const subtotal = get().getSubtotal();

        if (cleanCode === 'AGROVE10') {
          const discount = Math.round(subtotal * 0.1);
          set({ promoCode: 'AGROVE10 (10% OFF)', discountAmount: discount, promoError: null });
          return true;
        } else if (cleanCode === 'DEALER5') {
          const discount = Math.round(subtotal * 0.05);
          set({ promoCode: 'DEALER5 (5% Dealer Tier)', discountAmount: discount, promoError: null });
          return true;
        } else {
          set({ promoError: 'Invalid promo code. Try "AGROVE10" or "DEALER5"' });
          return false;
        }
      },

      removePromoCode: () => {
        set({ promoCode: '', discountAmount: 0, promoError: null });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Calculate base price excluding GST based on item HSN rate
      getBaseExGstSubtotal: () => {
        return Math.round(
          get().items.reduce((acc, item) => {
            const gstRate = item.product.gstRate || (item.product.category === 'Farm Machinery & Engines' && !item.product.name.toLowerCase().includes('engine') ? 0.05 : item.product.category === 'Agriculture Water Pumps' ? 0.05 : 0.18);
            const exGst = item.product.exGstPrice || Math.round(item.product.price / (1 + gstRate));
            return acc + exGst * item.quantity;
          }, 0)
        );
      },

      // Section 4.1 Production Wholesale Bulk Volume Tiers
      getWholesaleTierInfo: () => {
        const items = get().items;
        let machineryUnits = 0;
        let cuttingUnits = 0;

        for (const item of items) {
          const cat = item.product.category;
          const name = item.product.name.toLowerCase();
          if (cat === 'Farm Machinery & Engines' || cat === 'Agriculture Water Pumps' || cat === 'Earth Augers & Boring' || cat === 'Packaging & Bag Closers') {
            machineryUnits += item.quantity;
          } else {
            cuttingUnits += item.quantity;
          }
        }

        const totalUnits = machineryUnits + cuttingUnits;

        if (machineryUnits >= 30 || cuttingUnits >= 100) {
          return {
            tierName: 'Tier 3: Distributor Container Lot (20% Volume Rebate)',
            discountPercentage: 0.20,
            qualifies: true,
            nextTierRemaining: 0
          };
        } else if (machineryUnits >= 15 || cuttingUnits >= 50) {
          return {
            tierName: 'Tier 2: Wholesale Stockist (14% B2B Discount)',
            discountPercentage: 0.14,
            qualifies: true,
            nextTierRemaining: Math.max(0, 30 - machineryUnits)
          };
        } else if (machineryUnits >= 5 || cuttingUnits >= 20) {
          return {
            tierName: 'Tier 1: Authorized Dealer (8% B2B Discount)',
            discountPercentage: 0.08,
            qualifies: true,
            nextTierRemaining: Math.max(0, 15 - machineryUnits)
          };
        } else {
          return {
            tierName: 'Standard Trade Price',
            discountPercentage: 0,
            qualifies: false,
            nextTierRemaining: Math.max(0, 5 - machineryUnits)
          };
        }
      },

      getWholesaleDiscountAmount: () => {
        const tier = get().getWholesaleTierInfo();
        const baseExGst = get().getBaseExGstSubtotal();
        return Math.round(baseExGst * tier.discountPercentage);
      },

      // Section 4.2 Dynamic Weight Accumulator (Gross Physical vs Volumetric)
      getWeightAndFreightInfo: () => {
        const items = get().items;
        let actualWeightKg = 0;
        let volumetricWeightKg = 0;

        for (const item of items) {
          const lowerName = item.product.name.toLowerCase();
          // Derive physical weight in kg
          let unitWeight = 1.0;
          if (item.product.weightGrams) {
            unitWeight = item.product.weightGrams / 1000;
          } else if (lowerName.includes('water pump') || lowerName.includes('pump set')) {
            unitWeight = lowerName.includes('3"') ? 25.0 : 22.0;
          } else if (lowerName.includes('170f') || lowerName.includes('engine')) {
            unitWeight = 16.5;
          } else if (lowerName.includes('auger') || lowerName.includes('earth')) {
            unitWeight = lowerName.includes('110') ? 11.8 : lowerName.includes('95') ? 10.2 : 9.5;
          } else if (lowerName.includes('bag closer') || lowerName.includes('sealing')) {
            unitWeight = 3.2;
          } else if (lowerName.includes('chain')) {
            unitWeight = 0.45;
          } else if (lowerName.includes('trimmer')) {
            unitWeight = 1.1;
          }

          // Volumetric weight: (L * W * H) / 5000
          let unitVolumetric = unitWeight * 1.05;
          if (item.product.dimensionsCm) {
            const { length, width, height } = item.product.dimensionsCm;
            unitVolumetric = (length * width * height) / 5000;
          }

          actualWeightKg += unitWeight * item.quantity;
          volumetricWeightKg += unitVolumetric * item.quantity;
        }

        const billedWeightKg = Math.round(Math.max(actualWeightKg, volumetricWeightKg) * 10) / 10;
        const shipmentTier = billedWeightKg < 10 ? 'EXPRESS_PARCEL' : 'HEAVY_ROAD_TRANSPORT';
        const routingDescription = shipmentTier === 'EXPRESS_PARCEL'
          ? 'Tier 1: Express Courier Dispatch (Shiprocket / Delhivery Doorstep Transit)'
          : 'Tier 2: Heavy Freight B2B Road Transport (VRL / TCI Destination Godown Bilty)';

        return {
          actualWeightKg: Math.round(actualWeightKg * 10) / 10,
          volumetricWeightKg: Math.round(volumetricWeightKg * 10) / 10,
          billedWeightKg,
          shipmentTier,
          routingDescription
        };
      },

      // Section 2.3 & 4.2 Compatibility Validation Rules
      getCompatibilityAlerts: () => {
        const items = get().items;
        const alerts: string[] = [];
        const hasAugerPowerhead = items.some(i => i.product.name.toLowerCase().includes('auger'));
        const hasAugerBitOrExtension = items.some(i => {
          const n = i.product.name.toLowerCase();
          return n.includes('drill bit') || n.includes('auger bit') || n.includes('extension');
        });

        if (hasAugerBitOrExtension && !hasAugerPowerhead) {
          alerts.push('Auger Accessory Fitment: Requires 20mm standard output shaft. Verified compatible with Agroveer EA-85, EA-9511, and EA-110.');
        }

        const has2InchPump = items.some(i => i.product.name.toLowerCase().includes('2"') && i.product.name.toLowerCase().includes('pump'));
        const hasImpeller = items.some(i => i.product.name.toLowerCase().includes('impeller'));
        if (hasImpeller && has2InchPump) {
          alerts.push('Impeller Fitment Check: Please verify whether your 2" pump uses a Threaded Impeller or Keyed Impeller before dispatch.');
        }

        return alerts;
      },

      // Section 6.1 Statutory Itemized GST Calculation
      getGstAmount: () => {
        const wholesaleDiscount = get().getWholesaleDiscountAmount();
        const baseExGst = get().getBaseExGstSubtotal();
        const discountRatio = baseExGst > 0 ? (baseExGst - wholesaleDiscount) / baseExGst : 1;

        let totalTax = 0;
        for (const item of get().items) {
          const lowerName = item.product.name.toLowerCase();
          let gstRate = 0.05;
          if (lowerName.includes('engine') || lowerName.includes('170f') || lowerName.includes('chain') || lowerName.includes('sawking') || lowerName.includes('trimmer') || lowerName.includes('bag closer')) {
            gstRate = 0.18;
          }

          const lineBase = item.product.exGstPrice || Math.round(item.product.price / (1 + gstRate));
          const discountedLineBase = lineBase * item.quantity * discountRatio;
          totalTax += Math.round(discountedLineBase * gstRate);
        }

        return totalTax;
      },

      // Section 6.1 Intra-State (CGST + SGST) vs Inter-State (IGST)
      getTaxSplit: (stateName = 'Maharashtra') => {
        const totalGst = get().getGstAmount();
        const isIntraState = stateName.trim().toLowerCase().includes('maharashtra');

        if (isIntraState) {
          const cgst = Math.round(totalGst / 2);
          const sgst = totalGst - cgst;
          return { isIntraState: true, cgst, sgst, igst: 0, totalGst };
        } else {
          return { isIntraState: false, cgst: 0, sgst: 0, igst: totalGst, totalGst };
        }
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getShippingCost: () => {
        const baseSubtotal = get().getBaseExGstSubtotal();
        if (baseSubtotal === 0) return 0;
        return baseSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
      },

      getTotal: () => {
        const baseExGst = get().getBaseExGstSubtotal();
        const wholesaleDiscount = get().getWholesaleDiscountAmount();
        const promoDiscount = get().discountAmount;
        const totalDiscount = wholesaleDiscount + promoDiscount;
        const taxableBase = Math.max(0, baseExGst - totalDiscount);
        const gst = get().getGstAmount();
        const shipping = get().getShippingCost();

        return Math.max(0, taxableBase + gst + shipping);
      },

      getFormattedWhatsAppOrderText: () => {
        const state = get();
        const items = state.items;
        if (items.length === 0) return '';

        const poRef = `ARVEER-PO-${Date.now().toString().slice(-6)}`;
        const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const tier = state.getWholesaleTierInfo();
        const baseExGst = state.getBaseExGstSubtotal();
        const discount = state.getWholesaleDiscountAmount() + state.discountAmount;
        const gst = state.getGstAmount();
        const shipping = state.getShippingCost();
        const netTotal = state.getTotal();

        let lines = [
          `*📦 ARVEER IMPEX — OFFICIAL PURCHASE ORDER*`,
          `*Ref PO:* ${poRef} | *Date:* ${dateStr}`,
          `*Authorized Brands:* Agroveer™ | Sawking™`,
          state.companyName ? `*Buyer/Firm:* ${state.companyName}` : '',
          state.gstin ? `*GSTIN:* ${state.gstin}` : '',
          `----------------------------------------`,
          `*ITEMIZED ORDER SCHEDULE:*`
        ].filter(Boolean);

        items.forEach((item, idx) => {
          const sku = item.product.sku || `SKU-${idx + 1}`;
          const exGstLine = item.product.exGstPrice || Math.round(item.product.price / 1.05);
          lines.push(
            `${idx + 1}. *${item.product.name}*\n   • SKU: ${sku}\n   • Qty: ${item.quantity} units @ ₹${exGstLine} (ex. GST)\n   • Line Total: ₹${exGstLine * item.quantity}`
          );
        });

        lines.push(`----------------------------------------`);
        lines.push(`*FINANCIAL & TAX SUMMARY:*`);
        lines.push(`• Base Value (Excl. GST): ₹${baseExGst.toLocaleString('en-IN')}`);
        if (tier.qualifies) {
          lines.push(`• Volume Discount (${tier.tierName}): -₹${state.getWholesaleDiscountAmount().toLocaleString('en-IN')}`);
        }
        if (state.discountAmount > 0) {
          lines.push(`• Promo Code Discount: -₹${state.discountAmount.toLocaleString('en-IN')}`);
        }
        lines.push(`• Applicable GST (+5%): ₹${gst.toLocaleString('en-IN')}`);
        lines.push(`• Insured Freight: ${shipping === 0 ? 'FREE (Threshold Exceeded)' : `₹${shipping}`}`);
        lines.push(`*• NET PAYABLE AMOUNT: ₹${netTotal.toLocaleString('en-IN')}*`);
        lines.push(`----------------------------------------`);
        lines.push(`Please confirm dispatch schedule, warehouse freight docket, and proforma GST invoice.`);

        return lines.join('\n');
      }
    }),
    {
      name: 'arveer-impex-cart-v3',
      partialize: (state) => ({
        items: state.items,
        wishlistIds: state.wishlistIds,
        promoCode: state.promoCode,
        discountAmount: state.discountAmount,
        isB2BMode: state.isB2BMode,
        gstin: state.gstin,
        companyName: state.companyName,
      }),
    }
  )
);
