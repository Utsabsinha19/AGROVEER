import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';

const STORAGE_KEY_CUSTOM_PRODUCTS = 'agrove_custom_products';

export const productService = {
  // Get all custom products created by the seller via Cloudinary Studio
  getCustomProducts: (): Product[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PRODUCTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.error('[productService] Error loading custom products:', err);
    }
    return [];
  },

  // Save new product uploaded by seller
  saveCustomProduct: (product: Product): Product => {
    if (typeof window !== 'undefined') {
      try {
        const existing = productService.getCustomProducts();
        const filtered = existing.filter((p) => p.id !== product.id);
        const updated = [product, ...filtered];
        localStorage.setItem(STORAGE_KEY_CUSTOM_PRODUCTS, JSON.stringify(updated));
        // Dispatch custom event so listening components update immediately
        window.dispatchEvent(new Event('agrove_products_updated'));
      } catch (err) {
        console.error('[productService] Error saving custom product:', err);
      }
    }
    return product;
  },

  // Get complete unified catalog (Custom uploaded + Default baseline)
  getAllCatalogProducts: (): Product[] => {
    const custom = productService.getCustomProducts();
    // Prevent duplicate IDs
    const customIds = new Set(custom.map((p) => p.id));
    const baseline = PRODUCTS.filter((p) => !customIds.has(p.id));
    return [...custom, ...baseline];
  },

  // Find single product by ID
  findProductById: (id: string): Product | undefined => {
    const all = productService.getAllCatalogProducts();
    return all.find((p) => p.id === id);
  }
};

