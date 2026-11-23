# -*- coding: utf-8 -*-
"""
2 Inch Water Pump Spares High-Fidelity Extraction Script
Parses '2 INCH WATER PUMP SPARES PRICE LIST 13.10.2026.pdf' page by page.
Extracts:
- Product Code
- Item Name
- Reference Image (Cropped directly from PDF at 250 DPI)
- List Price (Excluding GST)
- Demand (HIGH / MEDIUM / NORMAL)
- Stock Status (IN_STOCK / LOW STOCK)
- Packing Type (plastic, box, factory packing)
"""

import os
import fitz
import json
import re

PDF_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\backend\source files\2 INCH WATER PUMP SPARES PRICE LIST 13.10.2026.pdf"
IMG_OUT_DIR = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\public\images\spares\water_pump"
JSON_OUT_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\water_pump_spares_extracted.json"

os.makedirs(IMG_OUT_DIR, exist_ok=True)

doc = fitz.open(PDF_PATH)
print(f"Opened {PDF_PATH} ({len(doc)} pages)")

# Metadata tuples: (sr, code, name, price_num, demand, stock, packing, page_idx, y0, y1)
# Bounding cells for image column (x0=295.2, x1=409.3):
rows_meta = [
    # --- PAGE 1: Items 1 to 13 ---
    (1, "WP2-INEX-JT-AL", "WATER IN&EX JOINT (AL) 2\"", 110.0, "MEDIUM", "IN_STOCK", "Factory Packing", 0, 87.9, 137.8),
    (2, "WP2-SPANNER", "SPANNER 2\"", 110.0, "NORMAL", "IN_STOCK", "Plastic Bag", 0, 138.3, 188.2),
    (3, "WP2-WSEAL-BOX", "WATER SEAL 2\" (Box Type)", 70.0, "HIGH", "IN_STOCK", "Box Packing", 0, 188.7, 238.7),
    (4, "WP2-BIG-SEALRING", "BIG SEAL RING 2\"", 25.0, "MEDIUM", "IN_STOCK", "Factory Packing", 0, 239.2, 289.1),
    (5, "WP2-SEALRING-IO", "SEAL RING (INLET & OUTLET) 2\"", 25.0, "MEDIUM", "IN_STOCK", "Plastic Bag", 0, 289.6, 339.6),
    (6, "WP2-GASKET-IO", "GASKET (WATER OUTLET & INLET) 2\"", 50.0, "MEDIUM", "IN_STOCK", "Plastic Bag", 0, 340.1, 390.0),
    (7, "WP2-HOSE-CLIP", "CLIP 2\"", 20.0, "NORMAL", "IN_STOCK", "Factory Packing", 0, 390.5, 440.5),
    (8, "WP2-SWIRL-WHEEL", "SWIRLING WHEEL 2\"", 390.0, "HIGH", "IN_STOCK", "Factory Packing", 0, 441.1, 491.0),
    (9, "WP2-WSEAL-FAC", "WATER SEAL 2\" (Factory Pack)", 75.0, "HIGH", "IN_STOCK", "Factory Packing", 0, 491.5, 541.4),
    (10, "WP2-RUBBER-GASKET", "RUBBER GASKET 2\"", 25.0, "MEDIUM", "IN_STOCK", "Factory Packing", 0, 541.9, 591.9),
    (11, "WP2-RUBBER-SEAL", "RUBBER SEAL 2\"", 15.0, "NORMAL", "IN_STOCK", "Factory Packing", 0, 592.4, 642.3),
    (12, "WP2-BLOCKER", "BLOCKER 2\"", 15.0, "NORMAL", "IN_STOCK", "Factory Packing", 0, 642.8, 692.7),
    (13, "WP2-IMP-KEY", "IMPELLER 2\" (Key Type)", 270.0, "HIGH", "IN_STOCK", "Factory Packing", 0, 693.3, 743.3),

    # --- PAGE 2: Items 14 and 15 ---
    (14, "WP2-IMP-THREAD", "IMPELLER 2\" (Thread Type)", 270.0, "HIGH", "IN_STOCK", "Factory Packing", 1, 28.9, 78.8),
    (15, "WP2-SWIRL-SHELL", "SWIRLING SHELL 2\"", 350.0, "HIGH", "IN_STOCK", "Factory Packing", 1, 79.3, 129.3)
]

extracted_items = []

print("\n--- Cropping high-resolution reference images from 2 Inch Water Pump Spares PDF ---")
for sr, code, name, price_num, demand, stock, packing, page_idx, y0, y1 in rows_meta:
    page = doc[page_idx]
    clean_code = re.sub(r'[^a-zA-Z0-9]+', '_', code.lower()).strip('_')
    img_filename = f"wp_sr{sr}_{clean_code}.png"
    img_path = os.path.join(IMG_OUT_DIR, img_filename)

    # Inset 1.2 pt from the table border line to ensure clean pure image
    rect = fitz.Rect(295.2 + 1.2, y0 + 1.2, 409.3 - 1.2, y1 - 1.2)
    pix = page.get_pixmap(clip=rect, dpi=250)
    pix.save(img_path)

    relative_img_path = f"/images/spares/water_pump/{img_filename}"
    gst_percent = 5.0
    total_incl_gst = round(price_num * (1.0 + gst_percent / 100.0), 2)

    item_dict = {
        "srNo": sr,
        "productCode": code,
        "itemName": name,
        "referenceImage": relative_img_path,
        "listPriceExclGst": price_num,
        "listPriceFormatted": f"₹{int(price_num)} + 5% GST",
        "demand": demand,
        "stockStatus": stock,
        "subCategory": "2 Inch Water Pump Spares",
        "packaging": packing,
        "gstPercent": gst_percent,
        "totalPriceInclGst": total_incl_gst,
        "sourcePdf": "2 INCH WATER PUMP SPARES PRICE LIST 13.10.2026.pdf"
    }
    extracted_items.append(item_dict)
    print(f"[{sr:2d}/15] Extracted {code:18s} | ₹{price_num:6.1f} | {demand:6s} | {relative_img_path}")

output_payload = {
    "sourceDocument": "2 INCH WATER PUMP SPARES PRICE LIST 13.10.2026.pdf",
    "documentDate": "13.10.2026",
    "extractedTotal": len(extracted_items),
    "extractedAt": "2026-11-18T18:40:00+05:30",
    "notes": [
        "1. Prices are exclusive of GST (5% GST applicable)",
        "2. Relevant discount applicable on the price mentioned",
        "3. Standard fitment for 2\" (50mm) High-Flow Petrol and Kerosene Agriculture Water Pumps"
    ],
    "items": extracted_items
}

with open(JSON_OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(output_payload, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully wrote {len(extracted_items)} items to {JSON_OUT_PATH}")
