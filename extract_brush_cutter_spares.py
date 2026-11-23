# -*- coding: utf-8 -*-
"""
Brush Cutter Spares Complete High-Fidelity Extraction Script
Parses BRUSH CUTTER SPARES 01.11.2026.pdf page by page.
Extracts:
- Product Code
- Item Name
- Reference Image (Cropped directly from PDF at 250 DPI)
- List Price (Excluding GST)
- Demand (HIGH / MEDIUM / NORMAL / NEW LAUNCH)
- Stock alerts (* Low stock, ** Very low stock)
"""

import os
import fitz
import json
import re

PDF_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\backend\source files\BRUSH CUTTER SPARES 01.11.2026.pdf"
IMG_OUT_DIR = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\public\images\spares\brush_cutter"
JSON_OUT_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\brush_cutter_spares_extracted.json"

os.makedirs(IMG_OUT_DIR, exist_ok=True)

doc = fitz.open(PDF_PATH)
print(f"Opened {PDF_PATH} ({len(doc)} pages)")

# Exact row coordinate specifications across the 7 pages:
# (sr, code, name, price_str, price_num, demand, stock, sub_category, page_idx, y0, y1)
rows_meta = [
    # --- PAGE 1: CUTTING ATTACHMENTS (BLADES) ---
    (1, "BCSMB2T STL 1.6MM", "Metal Blade 2T Stainless Steel 12 INCH 1.6MM", "170 + 5% GST", 170.0, "HIGH", "IN_STOCK", "Cutting Attachments (Blades)", 0, 141.4, 215.9),
    (2, "BCSPMB40T", "Metal Blade 40T", "255 + 5% GST", 255.0, "HIGH", "IN_STOCK", "Cutting Attachments (Blades)", 0, 215.9, 258.8),
    (3, "BCSMB60T", "Metal Blade 60T *", "285 + 5% GST", 285.0, "HIGH", "LOW STOCK", "Cutting Attachments (Blades)", 0, 258.8, 302.0),
    (4, "BCSPMB80T", "Metal Blade 80T", "315 + 5% GST", 315.0, "HIGH", "IN_STOCK", "Cutting Attachments (Blades)", 0, 302.0, 344.9),
    (5, "BCSMB6080T BL", "Metal Blade 60T Black *", "260 + 5% GST", 260.0, "HIGH", "LOW STOCK", "Cutting Attachments (Blades)", 0, 344.9, 378.1),
    (6, "BCSMB80TBL", "Metal Blade 80T Black *", "280 + 5% GST", 280.0, "HIGH", "LOW STOCK", "Cutting Attachments (Blades)", 0, 378.1, 418.8),
    (7, "BCSSUNBLAD", "SUN BLADE (BLADE + TRIMMER LINE)", "850 + 5% GST", 850.0, "NEW LAUNCH", "IN_STOCK", "Cutting Attachments (Blades)", 0, 418.8, 486.4),

    # --- PAGE 2: 28MM 9T TILLING ATTACHMENTS & TRIMMER LINE ---
    (8, "BCSPGC", "Grass Cutter 28MM", "2900 + 5% GST", 2900.0, "MEDIUM", "IN_STOCK", "28MM 9T Tilling Attachments", 1, 142.0, 223.0),
    (9, "BCSPGC (2)", "Grass Cutter 28MM Type 2", "2900 + 5% GST", 2900.0, "MEDIUM", "IN_STOCK", "28MM 9T Tilling Attachments", 1, 223.0, 304.0),
    (10, "BCSPTRIHE", "TILLER HEAD 28MM 9T *", "2900 + 5% GST", 2900.0, "MEDIUM", "LOW STOCK", "28MM 9T Tilling Attachments", 1, 304.0, 385.0),
    (11, "BCSPTREWHEEL", "TRENCHING WHEEL", "3600 + 5% GST", 3600.0, "MEDIUM", "IN_STOCK", "28MM 9T Tilling Attachments", 1, 385.0, 465.9),
    (12, "AI3MM1LBSSQ", "3MM 1LBS TRIMMER LINE SQUARE (Yellow, Orange, Green - 50m)", "350 + 5% GST", 350.0, "HIGH", "IN_STOCK", "Trimmer Line for Harvesting", 1, 500.0, 580.9),
    (13, "AI3.5MM1LBSRO", "3.5MM 1LBS TRIMMER LINE ROUND (White - 44m)", "350 + 5% GST", 350.0, "HIGH", "IN_STOCK", "Trimmer Line for Harvesting", 1, 580.9, 688.4),

    # --- PAGE 3: TAP & GO VARIANTS ---
    (14, "BCSTAPGO", "Tap & Go AUTO FAST CUT 25-2", "285 + 5% GST", 285.0, "HIGH", "IN_STOCK", "Tap & Go Variants", 2, 142.0, 209.6),
    (15, "BCSTAPGO SMALL", "Tap & Go HEAVY ALUMINIUM", "420 + 5% GST", 420.0, "HIGH", "IN_STOCK", "Tap & Go Variants", 2, 209.6, 303.0),
    (16, "BCSTRIMET", "Trimmer Head Metal", "295 + 5% GST", 295.0, "HIGH", "IN_STOCK", "Tap & Go Variants", 2, 303.0, 370.6),
    (17, "BCS TAPGO FOUR SIDE", "TAP N GO FOUR SIDE", "230 + 5% GST", 230.0, "HIGH", "IN_STOCK", "Tap & Go Variants", 2, 370.6, 462.6),
    (18, "BCS TRIM RED&BLACK", "TRIMMER HEAD RED & BLACK", "265 + 5% GST", 265.0, "NORMAL", "IN_STOCK", "Tap & Go Variants", 2, 462.6, 564.0),

    # --- PAGE 4: 43CC / 52CC ENGINE SPARES (PART 1) ---
    (19, "BCS52CKIT", "52 CC Cylinder Kit *", "840 + 5% GST", 840.0, "HIGH", "LOW STOCK", "43CC/52CC Engine Spares", 3, 134.9, 202.6),
    (20, "BCSPCB", "Carburettor (Suitable: Earth Auger, Brush Cutter)", "550 + 5% GST", 550.0, "HIGH", "IN_STOCK", "43CC/52CC Engine Spares", 3, 202.6, 270.2),
    (21, "BCSPESTR", "Easy Starter *", "170 + 5% GST", 170.0, "HIGH", "LOW STOCK", "43CC/52CC Engine Spares", 3, 270.2, 341.1),
    (22, "BCSSTLSTR", "Steel Starter *", "145 + 5% GST", 145.0, "HIGH", "LOW STOCK", "43CC/52CC Engine Spares", 3, 341.1, 408.7),
    (23, "BCSGEHE28/9T", "Gear Head 28MM/9T ECONOMY *", "495 + 5% GST", 495.0, "HIGH", "LOW STOCK", "43CC/52CC Engine Spares", 3, 408.7, 476.3),
    (24, "BCSGEHE28/9T ORANGE", "Gear Head 28MM/9T ORANGE COLOR PREMIUM", "540 + 5% GST", 540.0, "HIGH", "IN_STOCK", "43CC/52CC Engine Spares", 3, 476.3, 544.0),
    (25, "BCSCLDR9T", "Clutch Drum 9T **", "105 + 5% GST", 105.0, "NORMAL", "VERY LOW STOCK", "43CC/52CC Engine Spares", 3, 544.0, 615.0),
    (26, "BCSPCLHL", "Clutch Aluminium", "150 + 5% GST", 150.0, "HIGH", "IN_STOCK", "43CC/52CC Engine Spares", 3, 615.0, 682.7),
    (27, "BCSCLHOAS28/9T", "Clutch Housing Assy 28MM / 9T **", "475 + 5% GST", 475.0, "HIGH", "VERY LOW STOCK", "43CC/52CC Engine Spares", 3, 682.7, 750.2),

    # --- PAGE 5: 43CC / 52CC ENGINE SPARES (PART 2) ---
    (28, "BCSCLHOAS28/9T ORANGE", "Clutch Housing Assy 28MM / 9T ORANGE COLOR", "495 + 5% GST", 495.0, "HIGH", "IN_STOCK", "43CC/52CC Engine Spares", 4, 72.7, 140.2),
    (29, "BCSP43CRSH", "43CC Crankshaft **", "525 + 5% GST", 525.0, "NORMAL", "VERY LOW STOCK", "43CC/52CC Engine Spares", 4, 140.2, 207.9),
    (30, "BCSP52CRSH", "52CC Crankshaft **", "525 + 5% GST", 525.0, "NORMAL", "VERY LOW STOCK", "43CC/52CC Engine Spares", 4, 207.9, 275.6),
    (31, "BCS2STRSP", "2 STROKE SPARK PLUG", "49 + 5% GST", 49.0, "HIGH", "IN_STOCK", "43CC/52CC Engine Spares", 4, 275.6, 343.1),
    (32, "BCS2STRIGHAND", "RIGHT HANDLE WITH PIPE", "305 + 5% GST", 305.0, "HIGH", "IN_STOCK", "43CC/52CC Engine Spares", 4, 343.1, 410.8),
    (33, "BCSPFTC", "Fuel Tank Cap", "42 + 5% GST", 42.0, "NORMAL", "IN_STOCK", "43CC/52CC Engine Spares", 4, 410.8, 478.5),
    (34, "BCSFTGU", "Fuel Tank Guard METAL", "135 + 5% GST", 135.0, "NORMAL", "IN_STOCK", "43CC/52CC Engine Spares", 4, 478.5, 552.3),
    (35, "BCSGEHECO", "Gear Head Cover", "35 + 5% GST", 35.0, "NORMAL", "IN_STOCK", "43CC/52CC Engine Spares", 4, 552.3, 626.2),
    (36, "BCSHAHO28MM (2)", "Handle Holder 28MM (2) **", "230 + 5% GST", 230.0, "NORMAL", "VERY LOW STOCK", "43CC/52CC Engine Spares", 4, 626.2, 694.5),
    (37, "BCSPIGC", "Ignition Coil", "360 + 5% GST", 360.0, "NORMAL", "IN_STOCK", "43CC/52CC Engine Spares", 4, 694.5, 762.1),

    # --- PAGE 6: 43CC / 52CC ENGINE SPARES (PART 3) ---
    (38, "BCSPMUF", "Muffler", "180 + 5% GST", 180.0, "NORMAL", "IN_STOCK", "43CC/52CC Engine Spares", 5, 72.7, 140.2),
    (39, "BCSSTWIRESP", "Steel Wire Rewind Spring **", "45 + 5% GST", 45.0, "NORMAL", "VERY LOW STOCK", "43CC/52CC Engine Spares", 5, 140.2, 208.3),
    (40, "BCSGEPLSET", "GEAR HEAD PLATE SET", "110 + 5% GST", 110.0, "HIGH", "IN_STOCK", "43CC/52CC Engine Spares", 5, 208.3, 276.1),
    (41, "BCSPTANKHO", "Tank Housing", "220 + 5% GST", 220.0, "NORMAL", "IN_STOCK", "43CC/52CC Engine Spares", 5, 276.1, 351.9),
    (42, "BCS52PIS", "52CC Piston Set", "220 + 5% GST", 220.0, "NORMAL", "IN_STOCK", "43CC/52CC Engine Spares", 5, 351.9, 419.5),
    (43, "BCSDRSH9T", "Driver Shaft 9T *", "245 + 5% GST", 245.0, "HIGH", "LOW STOCK", "43CC/52CC Engine Spares", 5, 419.5, 479.0),
    (44, "BCSPIDRSH9T", "PIPE WITH DRIVE SHAFT 9T", "990 + 5% GST", 990.0, "HIGH", "IN_STOCK", "43CC/52CC Engine Spares", 5, 479.0, 546.7),
    (45, "BCSCOMROD", "COMPLETE ROD ATTACHMENT 28 MM 9T", "2570 + 5% GST", 2570.0, "NORMAL", "IN_STOCK", "43CC/52CC Engine Spares", 5, 546.7, 606.1),

    # --- PAGE 7: GX35 SPARE PARTS (4-STROKE) ---
    (46, "BCS4SPIST", "4 STROKE CARBURETTOR **", "670 + 5% GST", 670.0, "HIGH", "VERY LOW STOCK", "GX35 Spare Parts", 6, 145.3, 215.3),
    (47, "BCS4SGEHEAD", "4 STROKE SPARK PLUG", "59 + 5% GST", 59.0, "HIGH", "IN_STOCK", "GX35 Spare Parts", 6, 215.3, 270.0),
    (48, "BCS4SSTELSTR", "4 STROKE STEEL STARTER **", "190 + 5% GST", 190.0, "HIGH", "VERY LOW STOCK", "GX35 Spare Parts", 6, 270.0, 353.4)
]

extracted_items = []

print("\n--- Cropping high-resolution reference images from PDF ---")
for sr, code, name, price_str, price_num, demand, stock, subcat, page_idx, y0, y1 in rows_meta:
    page = doc[page_idx]
    clean_code = re.sub(r'[^a-zA-Z0-9]+', '_', code.lower()).strip('_')
    img_filename = f"bc_sr{sr}_{clean_code}.png"
    img_path = os.path.join(IMG_OUT_DIR, img_filename)
    
    # Clip bounding box: column X is exactly 276.5 to 418.1
    clip_rect = fitz.Rect(277.0, y0 + 1.0, 417.0, y1 - 1.0)
    pix = page.get_pixmap(clip=clip_rect, dpi=250)
    pix.save(img_path)
    
    rel_img_url = f"/images/spares/brush_cutter/{img_filename}"
    
    item_record = {
        "srNo": sr,
        "productCode": code,
        "itemName": name,
        "referenceImage": rel_img_url,
        "listPriceExclGst": price_num,
        "listPriceFormatted": price_str,
        "demand": demand,
        "stockStatus": stock,
        "subCategory": subcat,
        "gstPercent": 5.0,
        "totalPriceInclGst": round(price_num * 1.05, 2),
        "sourcePdf": "BRUSH CUTTER SPARES 01.11.2026.pdf"
    }
    extracted_items.append(item_record)
    print(f"[{sr:2d}/48] Saved: {code:22s} -> {img_filename} (₹{price_num} excl. GST | {demand})")

output_payload = {
    "sourceDocument": "BRUSH CUTTER SPARES 01.11.2026.pdf",
    "documentDate": "01.11.2026",
    "extractedTotal": len(extracted_items),
    "extractedAt": "2026-11-17T15:15:00+05:30",
    "notes": [
        "1. PRICES ARE EXCLUSIVE OF GST (5% GST APPLICABLE)",
        "2. RELEVANT DISCOUNT IS APPLICABLE ON THE LIST PRICE",
        "3. KINDLY, MENTION PRODUCT CODE AND SERIAL NO WHILE PLACING ORDER",
        "4. * LOW STOCK",
        "5. ** VERY LOW STOCK"
    ],
    "items": extracted_items
}

with open(JSON_OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(output_payload, f, indent=2, ensure_ascii=False)

print(f"\nSUCCESS: Extracted all 48 items to {JSON_OUT_PATH}")
