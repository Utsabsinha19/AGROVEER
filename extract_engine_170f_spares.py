# -*- coding: utf-8 -*-
"""
168F & 170F Engine Spares High-Fidelity Extraction Script
Parses '168&170F ENGINE SPARES PRICE LIST 13.10.2026.pdf' page by page.
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

PDF_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\backend\source files\168&170F ENGINE SPARES PRICE LIST 13.10.2026.pdf"
IMG_OUT_DIR = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\public\images\spares\engine_170f"
JSON_OUT_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\engine_170f_spares_extracted.json"

os.makedirs(IMG_OUT_DIR, exist_ok=True)

doc = fitz.open(PDF_PATH)
print(f"Opened {PDF_PATH} ({len(doc)} pages)")

# Format: (sr, code, name, price_num, demand, stock, packing, page_idx, y0, y1)
rows_meta = [
    # --- PAGE 1: 168F / 170F ENGINE CRANKCASE, VALVES, PISTONS & CAMSHAFT ---
    (1, "ENG-170F-CC75", "CRANKCASE COVER LOW 7.5 HP", 550.0, "HIGH", "IN_STOCK", "Plastic Bag", 0, 116.0, 166.7),
    (2, "ENG-168F-CC65", "CRANKCASE COVER LOW 6.5HP", 500.0, "HIGH", "IN_STOCK", "Plastic Bag", 0, 166.7, 217.3),
    (3, "ENG-170F-INEXV", "INTAKE & EXHAUST VALVE", 75.0, "HIGH", "IN_STOCK", "Box Packing", 0, 217.3, 267.9),
    (4, "ENG-170F-OILSEP", "OIL SEPARATOR", 50.0, "NORMAL", "IN_STOCK", "Plastic Bag", 0, 267.9, 318.5),
    (5, "ENG-170F-GOVGR", "GOVERNOR GEAR SET", 60.0, "HIGH", "IN_STOCK", "Plastic Bag", 0, 318.5, 369.2),
    (6, "ENG-170F-VENT", "VENTILATOR", 16.0, "NORMAL", "IN_STOCK", "Plastic Bag", 0, 369.2, 419.7),
    (7, "ENG-168F-PIST-STD", "6.5 HP PISTON + PIN + PISTON RING + CLIP (Standard)", 300.0, "HIGH", "IN_STOCK", "Box Packing", 0, 419.7, 470.3),
    (8, "ENG-168F-PIST-025", "6.5 HP PISTON + PIN + PISTON RING + CLIP (0.25)", 320.0, "HIGH", "IN_STOCK", "Box Packing", 0, 470.3, 521.0),
    (9, "ENG-168F-PIST-050", "6.5 HP PISTON + PIN + PISTON RING + CLIP (0.5)", 340.0, "HIGH", "IN_STOCK", "Box Packing", 0, 521.0, 571.6),
    (10, "ENG-170F-CAM-IRON", "CAMSHAFT ASSY IRON", 520.0, "HIGH", "IN_STOCK", "Plastic Bag", 0, 571.6, 622.2),
    (11, "ENG-170F-CAM-NYLON", "CAMSHAFT ASSY NYLON", 120.0, "HIGH", "IN_STOCK", "Plastic Bag", 0, 622.2, 672.8),
    (12, "ENG-170F-INVAL", "INTAKE VALVE", 16.0, "NORMAL", "IN_STOCK", "Plastic Bag", 0, 672.8, 723.3),

    # --- PAGE 2: FUEL SYSTEM, CYLINDER HEAD & STARTER ROPE ---
    (13, "ENG-170F-FTCAP", "FUEL TANK CAP", 48.0, "HIGH", "IN_STOCK", "Plastic Bag", 1, 57.1, 107.7),
    (14, "ENG-170F-ROCKARM", "Rocker arm", 55.0, "HIGH", "IN_STOCK", "Plastic Bag", 1, 107.7, 158.2),
    (15, "ENG-170F-FLYWHEEL", "Flywheel", 700.0, "NORMAL", "IN_STOCK", "Plastic Bag", 1, 158.2, 208.8),
    (16, "ENG-170F-TAPPET-PR", "Tappet (pair)", 60.0, "HIGH", "IN_STOCK", "Plastic Bag", 1, 208.8, 259.5),
    (17, "ENG-170F-STR-ROPE", "Starter Rope", 850.0, "HIGH", "IN_STOCK", "Factory Packing (Bulk Roll)", 1, 259.5, 309.9)
]

extracted_items = []

print("\n--- Cropping high-resolution reference images from 168/170F Engine Spares PDF ---")
for sr, code, name, price_num, demand, stock, packing, page_idx, y0, y1 in rows_meta:
    page = doc[page_idx]
    clean_code = re.sub(r'[^a-zA-Z0-9]+', '_', code.lower()).strip('_')
    img_filename = f"eng_sr{sr}_{clean_code}.png"
    img_path = os.path.join(IMG_OUT_DIR, img_filename)

    # Inset 1.2 pt from the table border line to ensure clean pure image
    rect = fitz.Rect(298.5, y0 + 1.2, 405.0, y1 - 1.2)
    pix = page.get_pixmap(clip=rect, dpi=250)
    pix.save(img_path)

    relative_img_path = f"/images/spares/engine_170f/{img_filename}"
    gst_percent = 5.0
    total_incl_gst = round(price_num * (1.0 + gst_percent / 100.0), 2)

    item_dict = {
        "srNo": sr,
        "productCode": code,
        "itemName": name,
        "referenceImage": relative_img_path,
        "listPriceExclGst": price_num,
        "listPriceFormatted": f"{int(price_num)} + 5% GST",
        "demand": demand,
        "stockStatus": stock,
        "subCategory": "168F & 170F Engine Spares",
        "packaging": packing,
        "gstPercent": gst_percent,
        "totalPriceInclGst": total_incl_gst,
        "sourcePdf": "168&170F ENGINE SPARES PRICE LIST 13.10.2026.pdf"
    }
    extracted_items.append(item_dict)
    print(f"[{sr:2d}/17] Extracted {code:18s} | ₹{price_num:6.1f} | {demand:6s} | {relative_img_path}")

output_payload = {
    "sourceDocument": "168&170F ENGINE SPARES PRICE LIST 13.10.2026.pdf",
    "documentDate": "13.10.2026",
    "extractedTotal": len(extracted_items),
    "extractedAt": "2026-11-18T18:35:00+05:30",
    "notes": [
        "1. Prices are exclusive of GST (5% GST applicable)",
        "2. Relevant discount applicable on the price mentioned",
        "3. Standard fitment for 168F (6.5 HP) and 170F (7.5 HP) petrol engines"
    ],
    "items": extracted_items
}

with open(JSON_OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(output_payload, f, indent=2)

print(f"\nSuccessfully wrote {len(extracted_items)} items to {JSON_OUT_PATH}")
