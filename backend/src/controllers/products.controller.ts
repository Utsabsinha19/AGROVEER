import { Request, Response } from 'express';
import { productsData } from '../data/products.data.js';
import fs from 'fs';
import path from 'path';

// Load the complete extracted factory catalog from frontend data
const loadFullCatalog = () => {
  const allProducts: any[] = [...productsData];
  const seenSkus = new Set(allProducts.map(p => p.sku));

  try {
    const possiblePaths = [
      path.resolve(process.cwd(), 'frontend/src/data/complete_extracted_spares_catalog.json'),
      path.resolve(process.cwd(), '../frontend/src/data/complete_extracted_spares_catalog.json'),
      path.resolve(__dirname, '../../../frontend/src/data/complete_extracted_spares_catalog.json')
    ];
    const catalogPath = possiblePaths.find(p => fs.existsSync(p));
    if (catalogPath && fs.existsSync(catalogPath)) {
      const raw = fs.readFileSync(catalogPath, 'utf8');
      const catalog = JSON.parse(raw);

      for (const cat of catalog.categories || []) {
        for (const it of cat.items || []) {
          const sku = it.productCode || `AGR-SP-${it.srNo}`;
          if (!seenSkus.has(sku)) {
            seenSkus.add(sku);
            const price = parseFloat(it.listPrice) || 0;
            const gstRate = it.tax && it.tax.includes('18%') ? 18.0 : 5.0;

            allProducts.push({
              id: `spare-${sku.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              sku: sku,
              name: it.name,
              category: cat.category,
              subCategory: it.subCategory,
              description: `Authentic Arveer Impex OEM component (${it.packaging || 'Standard Pack'}). Mention code ${sku} when ordering.`,
              priceINR: price,
              priceGstINR: Math.round(price * (1 + gstRate / 100)),
              mrp: Math.round(price * 1.3),
              gstRate: gstRate,
              hsnCode: cat.category.includes('Engine') ? '84079000' :
                       cat.category.includes('Pump') ? '84139190' :
                       cat.category.includes('Chain') ? '82029990' :
                       cat.category.includes('Auger') ? '84679900' : '84329090',
              inStock: it.stockStatus !== 'OUT_OF_STOCK',
              inventoryCount: it.stockStatus === 'VERY LOW STOCK' ? 5 : (it.stockStatus === 'LOW STOCK' ? 15 : 100),
              image: it.imageUrl || '/images/products/open-source-petrol-engine.jpg',
              demand: it.demand || 'NORMAL',
              stockStatus: it.stockStatus || 'IN_STOCK'
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('[ProductsController] Could not load complete catalog file:', err);
  }

  return allProducts;
};

export class ProductsController {
  public static getAll(req: Request, res: Response) {
    const { category, search, minPrice, maxPrice } = req.query;

    const fullList = loadFullCatalog();
    let results = [...fullList];

    if (category && typeof category === 'string' && category !== 'All') {
      results = results.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = results.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (minPrice) {
      results = results.filter(p => p.priceINR >= Number(minPrice));
    }

    if (maxPrice) {
      results = results.filter(p => p.priceINR <= Number(maxPrice));
    }

    return res.json({
      success: true,
      count: results.length,
      currency: 'INR',
      data: results
    });
  }

  public static getById(req: Request, res: Response) {
    const { id } = req.params;
    const fullList = loadFullCatalog();
    const product = fullList.find(p => p.id === id || p.sku.toLowerCase() === id.toLowerCase());

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with ID '${id}' not found`
      });
    }

    return res.json({
      success: true,
      currency: 'INR',
      data: product
    });
  }

  public static getCategories(_req: Request, res: Response) {
    const fullList = loadFullCatalog();
    const categories = Array.from(new Set(fullList.map(p => p.category))).filter(Boolean);
    return res.json({
      success: true,
      categories
    });
  }
}

