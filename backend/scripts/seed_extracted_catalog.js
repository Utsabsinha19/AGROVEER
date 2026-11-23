// -*- coding: utf-8 -*-
/**
 * Seeder script for Arveer Impex / AGROVÉ Neon PostgreSQL database.
 * Seeds all flagship machinery and 118 verified spare parts into the Product table.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL not set in backend/.env");
  process.exit(1);
}

const sparesJsonPath = path.join(__dirname, '../../frontend/src/data/complete_extracted_spares_catalog.json');
const rawData = fs.readFileSync(sparesJsonPath, 'utf8');
const sparesCatalog = JSON.parse(rawData);

// Flagship Machinery Products
const flagshipMachines = [
  {
    id: 'agroveer-170f-engine-pulley',
    sku: 'AG-ENG-170F-P',
    name: 'Agroveer™ 170F 7.5 HP Multi-Purpose Petrol Engine with Pulley',
    category: 'Farm Machinery & Engines',
    hsnCode: '84079000',
    gstRate: 18.0,
    priceExGst: 7202.0,
    mrp: 12500.0,
    minOrderQty: 1,
    inStock: true,
    inventoryCount: 85,
    lowStockAlert: 10,
    images: ['/images/products/agroveer-170f-petrol-engine-pulley.jpg'],
    has3dViewer: true,
    specifications: {
      displacement: '212cc 4-Stroke OHV',
      power: '7.5 HP @ 3600 RPM',
      fuelTank: '3.6 Litres',
      shaft: '19mm / 20mm Horizontal Keyed Shaft (Dual Groove Pulley)',
      cooling: 'Forced Air Cooled OHV',
      starting: 'Heavy-Duty Recoil Pull Start'
    }
  },
  {
    id: 'agroveer-2inch-water-pump-170f',
    sku: 'AG-WP-20',
    name: 'Agroveer™ 2" High-Pressure Agriculture Water Pump (W-P20)',
    category: 'Agriculture Water Pumps',
    hsnCode: '84137010',
    gstRate: 5.0,
    priceExGst: 11428.0,
    mrp: 14500.0,
    minOrderQty: 1,
    inStock: true,
    inventoryCount: 60,
    lowStockAlert: 8,
    images: ['/images/products/agroveer-2inch-water-pump-170f.jpg'],
    has3dViewer: true,
    specifications: {
      ports: '50mm (2") Inlet & Outlet',
      maxHead: '28 Metres',
      maxSuction: '7 Metres',
      discharge: '30,000–35,000 Litres/Hour',
      engine: '170F 7.5 HP 4-Stroke Petrol',
      frame: '25mm Double-Handle Roll Cage'
    }
  },
  {
    id: 'agroveer-3inch-water-pump-170f',
    sku: 'AG-WP-30',
    name: 'Agroveer™ 3" High-Flow Agriculture Water Pump (W-P30)',
    category: 'Agriculture Water Pumps',
    hsnCode: '84137010',
    gstRate: 5.0,
    priceExGst: 12856.0,
    mrp: 16500.0,
    minOrderQty: 1,
    inStock: true,
    inventoryCount: 45,
    lowStockAlert: 5,
    images: ['/images/products/agroveer-3inch-water-pump-170f.jpg', '/images/products/agroveer-3inch-water-pump-170f-alt.jpg'],
    has3dViewer: true,
    specifications: {
      ports: '80mm (3") Inlet & Outlet',
      maxHead: '30 Metres',
      maxSuction: '8 Metres',
      discharge: '55,000–60,000 Litres/Hour',
      engine: '170F 7.5 HP 4-Stroke Petrol',
      frame: '25mm Heavy Gauge Steel Frame'
    }
  },
  {
    id: 'agroveer-1-5inch-mini-water-pump-wp15',
    sku: 'AG-WP-15',
    name: 'Agroveer™ WP-15 1.5" Mini Portable Gasoline Water Pump',
    category: 'Agriculture Water Pumps',
    hsnCode: '84137010',
    gstRate: 5.0,
    priceExGst: 6666.0,
    mrp: 8500.0,
    minOrderQty: 1,
    inStock: true,
    inventoryCount: 40,
    lowStockAlert: 5,
    images: ['/images/products/agroveer-1-5inch-mini-water-pump-wp15.jpg'],
    has3dViewer: false,
    specifications: {
      ports: '40mm (1.5") Suction & Delivery',
      discharge: '15,000 Litres/Hour',
      design: 'Ultra-lightweight portable carry frame'
    }
  },
  {
    id: 'agroveer-85cc-earth-auger-ea85',
    sku: 'AI85CCAUG',
    name: 'Agroveer™ EA-85 85CC 2-Stroke Earth Auger with Super Easy Starter',
    category: 'Earth Augers & Boring',
    hsnCode: '84678900',
    gstRate: 5.0,
    priceExGst: 12500.0,
    mrp: 15500.0,
    minOrderQty: 1,
    inStock: true,
    inventoryCount: 35,
    lowStockAlert: 5,
    images: ['/images/products/agroveer-85cc-earth-auger-poster.jpg'],
    has3dViewer: true,
    specifications: {
      displacement: '85cc 2-Stroke High Torque',
      power: '2.4 kW @ 9000 RPM',
      starter: 'Super Easy Starter (+30% spring thickness)',
      packing: 'STD: 2 PC PACKING Color Box'
    }
  },
  {
    id: 'agroveer-95cc-earth-auger-ea95',
    sku: 'AI95CCAUG',
    name: 'Agroveer™ EA-95 95CC 2-Stroke Earth Auger with Honeycomb Packing',
    category: 'Earth Augers & Boring',
    hsnCode: '84678900',
    gstRate: 5.0,
    priceExGst: 14700.0,
    mrp: 17500.0,
    minOrderQty: 1,
    inStock: true,
    inventoryCount: 20,
    lowStockAlert: 5,
    images: ['/images/products/agroveer-85cc-earth-auger-poster.jpg'],
    has3dViewer: false,
    specifications: {
      displacement: '95cc 2-Stroke High Torque',
      starter: 'Super Easy Starter',
      packing: 'Honeycomb Industrial Packing (Cylinder Kit & Crankshaft Available)'
    }
  },
  {
    id: 'agroveer-110cc-4stroke-earth-auger',
    sku: 'AI110CC4STRKAUGER',
    name: 'Agroveer™ 110CC 4-Stroke Heavy-Duty Earth Auger (Pure Petrol)',
    category: 'Earth Augers & Boring',
    hsnCode: '84678900',
    gstRate: 5.0,
    priceExGst: 14850.0,
    mrp: 18500.0,
    minOrderQty: 1,
    inStock: true,
    inventoryCount: 25,
    lowStockAlert: 5,
    images: ['/images/products/agroveer-110cc-4stroke-earth-auger.jpg', '/images/products/agroveer-110cc-auger-engine-top.jpg'],
    has3dViewer: true,
    specifications: {
      displacement: '110cc 4-Stroke OHV Pure Petrol (No 2T Oil)',
      handle: 'Double Ergonomic Tubular Handle',
      packing: 'STD: 2 PC PACKING Color Box'
    }
  },
  {
    id: 'agroveer-cordless-bag-closer',
    sku: 'AGR-PKG-BAG01',
    name: 'Agroveer™ Cordless Single-Thread Industrial Bag Closer (2 Batteries)',
    category: 'Packaging & Bag Closers',
    hsnCode: '84522900',
    gstRate: 18.0,
    priceExGst: 8999.0,
    mrp: 11500.0,
    minOrderQty: 1,
    inStock: true,
    inventoryCount: 50,
    lowStockAlert: 10,
    images: ['/images/products/agroveer-cordless-bag-closer.jpg'],
    has3dViewer: false,
    specifications: {
      motor: 'Brushless High-Speed Sewing Motor',
      speed: '2000 stitches / min',
      batteries: '2x High-Capacity Li-Ion Rechargeable Battery Packs',
      accessories: 'Carry bag, thread spools, needles, maintenance oil'
    }
  }
];

async function seedDatabase() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to Neon PostgreSQL database.");

  let insertedCount = 0;
  let updatedCount = 0;

  // 1. Seed Flagship Machinery
  console.log("\n--- Seeding Flagship Machinery ---");
  for (const item of flagshipMachines) {
    const query = `
      INSERT INTO "Product" (
        "id", "sku", "name", "category", "hsnCode", "gstRate", "priceExGst", "mrp",
        "minOrderQty", "inStock", "inventoryCount", "lowStockAlert", "images",
        "has3dViewer", "specifications", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      ON CONFLICT ("sku") DO UPDATE SET
        "name" = EXCLUDED."name",
        "category" = EXCLUDED."category",
        "hsnCode" = EXCLUDED."hsnCode",
        "gstRate" = EXCLUDED."gstRate",
        "priceExGst" = EXCLUDED."priceExGst",
        "mrp" = EXCLUDED."mrp",
        "images" = EXCLUDED."images",
        "has3dViewer" = EXCLUDED."has3dViewer",
        "specifications" = EXCLUDED."specifications",
        "updatedAt" = NOW();
    `;
    const values = [
      item.id,
      item.sku,
      item.name,
      item.category,
      item.hsnCode,
      item.gstRate,
      item.priceExGst,
      item.mrp,
      item.minOrderQty,
      item.inStock,
      item.inventoryCount,
      item.lowStockAlert,
      item.images,
      item.has3dViewer,
      JSON.stringify(item.specifications)
    ];
    await client.query(query, values);
    insertedCount++;
    console.log(`✓ Seeded Flagship: ${item.sku} - ${item.name}`);
  }

  // 2. Seed All 118 Extracted Spare Parts
  console.log("\n--- Seeding 118 Extracted Spare Parts & Attachments ---");
  for (const cat of sparesCatalog.categories) {
    for (const it of cat.items) {
      const sku = it.productCode || `AGR-SP-${cat.slug.toUpperCase()}-${it.srNo}`;
      const id = `spare-${it.productCode ? it.productCode.toLowerCase().replace(/[^a-z0-9]+/g, '-') : it.srNo}`;
      const gstRate = it.tax && it.tax.includes('18%') ? 18.0 : 5.0;
      const priceExGst = parseFloat(it.listPrice) || 0;
      const mrp = Math.round(priceExGst * 1.3);
      const category = cat.category;
      const hsnCode = category.includes('Engine') ? '84079000' :
                      category.includes('Pump') ? '84139190' :
                      category.includes('Chain') ? '82029990' :
                      category.includes('Auger') ? '84679900' : '84329090';

      const specs = {
        srNo: it.srNo,
        sourceDocumentDate: cat.priceListDate,
        packing: it.standardPacking || it.packingType || it.subCategory || 'Standard Pack',
        subCategory: it.subCategory || cat.category,
        demand: it.demand || 'NORMAL',
        stockStatus: it.stockStatus || 'IN_STOCK',
        notes: it.notes || ''
      };

      const images = it.imageUrl ? [it.imageUrl] : [];

      const existing = await client.query('SELECT id, sku FROM "Product" WHERE id = $1 OR sku = $2 LIMIT 1;', [id, sku]);
      if (existing.rows.length > 0) {
        const targetId = existing.rows[0].id;
        await client.query(`
          UPDATE "Product" SET 
            "sku" = $1, 
            "name" = $2, 
            "category" = $3, 
            "hsnCode" = $4, 
            "gstRate" = $5, 
            "priceExGst" = $6, 
            "mrp" = $7, 
            "images" = $8, 
            "specifications" = $9, 
            "inStock" = $10,
            "inventoryCount" = $11,
            "updatedAt" = NOW() 
          WHERE "id" = $12;
        `, [
          sku,
          it.name,
          category,
          hsnCode,
          gstRate,
          priceExGst,
          mrp,
          images,
          JSON.stringify(specs),
          it.stockStatus !== 'OUT_OF_STOCK',
          it.stockStatus === 'VERY LOW STOCK' ? 5 : (it.stockStatus === 'LOW STOCK' ? 15 : 100),
          targetId
        ]);
      } else {
        await client.query(`
          INSERT INTO "Product" (
            "id", "sku", "name", "category", "hsnCode", "gstRate", "priceExGst", "mrp",
            "minOrderQty", "inStock", "inventoryCount", "lowStockAlert", "images",
            "has3dViewer", "specifications", "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, $9, $10, 10, $11, false, $12, NOW(), NOW());
        `, [
          id,
          sku,
          it.name,
          category,
          hsnCode,
          gstRate,
          priceExGst,
          mrp,
          it.stockStatus !== 'OUT_OF_STOCK',
          it.stockStatus === 'VERY LOW STOCK' ? 5 : (it.stockStatus === 'LOW STOCK' ? 15 : 100),
          images,
          JSON.stringify(specs)
        ]);
      }
      insertedCount++;
    }
  }

  // Check total in DB
  const res = await client.query('SELECT count(*) FROM "Product";');
  console.log(`\n🎉 SEEDING COMPLETE: Total Products in Neon DB: ${res.rows[0].count}`);

  await client.end();
}

seedDatabase().catch((err) => {
  console.error("FATAL Seeding Error:", err);
  process.exit(1);
});
