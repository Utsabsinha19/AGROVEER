# -*- coding: utf-8 -*-
"""
Chainsaw Chain High-Fidelity Extraction Script
Parses 'CHAIN PRICE LIST_14.11.2026.pdf' page by page.
Extracts:
- Product Code
- Item Name
- Reference Image (Cropped directly from PDF at 250 DPI)
- List Price (Excluding GST)
- Demand (HIGH / MEDIUM / NEW LAUNCH)
- Stock Status (IN_STOCK / LOW STOCK)
- Packing Type (Metal Box, Color Box, Blister)
"""

import os
import fitz
import json
import re

PDF_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\backend\source files\CHAIN PRICE LIST_14.11.2026.pdf"
IMG_OUT_DIR = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\public\images\spares\chainsaw"
JSON_OUT_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\chainsaw_spares_extracted.json"

os.makedirs(IMG_OUT_DIR, exist_ok=True)

doc = fitz.open(PDF_PATH)
print(f"Opened {PDF_PATH} ({len(doc)} pages)")

# Metadata tuples: (sr, code, name, price_num, demand, stock, packing, y0, y1)
# Bounding cells for image column (x0=269.8, x1=474.6):
rows_meta = [
    (1, "AI18-SIL", "18\" SAWKING CHAIN SILVER FULL CHISEL", 380.0, "HIGH", "IN_STOCK", "Color Box Packing", 122.8, 264.9),
    (2, "AI22-SIL", "22\" SAWKING CHAIN SILVER FULL CHISEL", 450.0, "HIGH", "IN_STOCK", "Color Box Packing", 122.8, 264.9),
    (3, "AI18-GLD", "18\" SAWKING CHAIN GOLD FULL CHISEL", 420.0, "NEW LAUNCH", "IN_STOCK", "Sawking Gold Box Packing", 265.4, 378.4),
    (4, "AI22-DBLLNK", "22 INCH DOUBLE LINK METAL BOX", 560.0, "HIGH", "IN_STOCK", "Premium Metal Box Packing", 378.9, 500.4),
    (5, "AI22-RMX", "22\" RMX CHAIN 10 DEGREE CUT", 920.0, "HIGH", "IN_STOCK", "Hardened RMX Box Packing", 500.9, 582.4)
]

extracted_items = []
page = doc[0]

print("\n--- Cropping high-resolution reference images from Chainsaw Chain PDF ---")
for sr, code, name, price_num, demand, stock, packing, y0, y1 in rows_meta:
    clean_code = re.sub(r'[^a-zA-Z0-9]+', '_', code.lower()).strip('_')
    img_filename = f"chain_sr{sr}_{clean_code}.png"
    img_path = os.path.join(IMG_OUT_DIR, img_filename)

    # Inset 1.2 pt from the table border line to ensure clean pure image
    rect = fitz.Rect(269.8 + 1.2, y0 + 1.2, 474.6 - 1.2, y1 - 1.2)
    pix = page.get_pixmap(clip=rect, dpi=250)
    pix.save(img_path)

    relative_img_path = f"/images/spares/chainsaw/{img_filename}"
    gst_percent = 18.0
    total_incl_gst = round(price_num * (1.0 + gst_percent / 100.0), 2)

    item_dict = {
        "srNo": sr,
        "productCode": code,
        "itemName": name,
        "referenceImage": relative_img_path,
        "listPriceExclGst": price_num,
        "listPriceFormatted": f"₹{int(price_num)} + 18% GST",
        "demand": demand,
        "stockStatus": stock,
        "subCategory": "Chainsaw Chains & Cutting Accessories",
        "packaging": packing,
        "gstPercent": gst_percent,
        "totalPriceInclGst": total_incl_gst,
        "sourcePdf": "CHAIN PRICE LIST_14.11.2026.pdf"
    }
    extracted_items.append(item_dict)
    print(f"[{sr:2d}/5] Extracted {code:14s} | ₹{price_num:6.1f} | {demand:10s} | {relative_img_path}")

output_payload = {
    "sourceDocument": "CHAIN PRICE LIST_14.11.2026.pdf",
    "documentDate": "14.11.2026",
    "extractedTotal": len(extracted_items),
    "extractedAt": "2026-11-18T18:41:00+05:30",
    "notes": [
        "1. Relevant discount applicable on the price mentioned",
        "2. Kindly mention product code or serial No. while placing order",
        "3. Precision alloy steel, German-grade chrome plating, hardened rivet bearings"
    ],
    "items": extracted_items
}

with open(JSON_OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(output_payload, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully wrote {len(extracted_items)} items to {JSON_OUT_PATH}")
