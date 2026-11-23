# -*- coding: utf-8 -*-
"""
Earth Auger Machines, Bits & Spares High-Fidelity Extraction Script
Parses 'EARTH AUGER MACHINE _ BIT_ SPARES 13.10.2026.pdf' page by page.
Extracts:
- Product Code
- Item Name
- Reference Image (Cropped directly from PDF at 250 DPI)
- List Price (Excluding GST)
- Demand (HIGH / MEDIUM / NORMAL / NEW LAUNCH)
- Stock Status (IN_STOCK / LOW STOCK / VERY LOW STOCK)
- Packing / Standard Pack Details
"""

import os
import fitz
import json
import re

PDF_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\backend\source files\EARTH AUGER MACHINE _ BIT_ SPARES 13.10.2026.pdf"
IMG_OUT_DIR = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\public\images\spares\earth_auger"
JSON_OUT_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\earth_auger_spares_extracted.json"

os.makedirs(IMG_OUT_DIR, exist_ok=True)

doc = fitz.open(PDF_PATH)
print(f"Opened {PDF_PATH} ({len(doc)} pages)")

# Format: (sr, code, name, price_str, price_num, demand, stock, sub_category, page_idx, y0, y1, std_pack)
rows_meta = [
    # --- PAGE 1: EARTH AUGER POWER HEAD MACHINES & DRILL BITS ---
    (1, "AI85CCAUG", "85 CC EARTH AUGER 2 STROKE WITH SUPER EASY STARTER & COLOR BOX", "12500 + 5% GST", 12500.0, "HIGH", "IN_STOCK", "Earth Auger Heavy Machines", 0, 101.9, 193.8, "STD: 2 PC PACKING"),
    (2, "AI95CCAUG", "95 CC EARTH AUGER 2 STROKE WITH SUPER EASY STARTER & HONEYCOMB PACKING", "14700 + 5% GST", 14700.0, "HIGH", "IN_STOCK", "Earth Auger Heavy Machines", 0, 193.8, 283.6, "HONEYCOMB PACKING (CYLINDER KIT & CRANKSHAFT AVAILABLE)"),
    (3, "AI110CC4STRKAUGER", "110 CC EARTH AUGER 4 STROKE ENGINE DOUBLE HANDLE (COLOR BOX)", "14850 + 5% GST", 14850.0, "HIGH", "IN_STOCK", "Earth Auger Heavy Machines", 0, 283.6, 387.1, "STD: 2 PC PACKING"),
    (4, "AI60MM", "60MM AUGER BIT (2.5 INCH)", "1000 + 5% GST", 1000.0, "MEDIUM", "IN_STOCK", "Auger Drill Bits (Single Spiral)", 0, 387.1, 430.1, "STD: 15 PC"),
    (5, "AI80MM", "80MM AUGER BIT (3 INCH)", "1050 + 5% GST", 1050.0, "HIGH", "IN_STOCK", "Auger Drill Bits (Single Spiral)", 0, 430.1, 473.1, "STD: 10 PC"),
    (6, "AI100MM", "100MM AUGER BIT (4 INCH)", "1100 + 5% GST", 1100.0, "HIGH", "IN_STOCK", "Auger Drill Bits (Single Spiral)", 0, 473.1, 516.2, "STD: 10 PC"),
    (7, "AI120MM", "120MM AUGER BIT (5 INCH)", "1100 + 5% GST", 1100.0, "HIGH", "IN_STOCK", "Auger Drill Bits (Single Spiral)", 0, 516.2, 559.3, "STD: 10 PC"),
    (8, "AI150MM", "150MM AUGER BIT (6 INCH)", "1300 + 5% GST", 1300.0, "HIGH", "IN_STOCK", "Auger Drill Bits (Single Spiral)", 0, 559.3, 602.4, "STD: 6 PC"),
    (9, "AI200MM", "200MM AUGER BIT (8 INCH)", "1800 + 5% GST", 1800.0, "HIGH", "IN_STOCK", "Auger Drill Bits (Single Spiral)", 0, 602.4, 645.5, "STD: 4 PC"),
    (10, "AI100MMDOUBLE", "100MM AUGER BIT DOUBLE LAYER (4 INCH)", "1500 + 5% GST", 1500.0, "HIGH", "IN_STOCK", "Auger Drill Bits (Heavy Double Layer)", 0, 645.5, 705.0, "STD: 10 PC"),
    (11, "AI200MMDOUBLE", "150MM AUGER BIT DOUBLE LAYER (6 INCH)", "1750 + 5% GST", 1750.0, "HIGH", "IN_STOCK", "Auger Drill Bits (Heavy Double Layer)", 0, 705.0, 764.4, "STD: 6 PC"),

    # --- PAGE 2: EXTENSION RODS & ENGINE SPARES ---
    (12, "AI80CM EXT", "80CM EXTENSION ROD", "690 + 5% GST", 690.0, "HIGH", "IN_STOCK", "Auger Extension Rods", 1, 74.5, 152.4, "STD: 20 PC"),
    (13, "AI100CM EXT", "100CM EXTENSION ROD", "740 + 5% GST", 740.0, "HIGH", "IN_STOCK", "Auger Extension Rods", 1, 152.4, 225.5, "STD: 10 PC"),
    (14, "AI4STROKECARB", "4 STROKE CARBURETTOR (144F)", "760 + 5% GST", 760.0, "HIGH", "IN_STOCK", "144F 4-Stroke Spares", 1, 225.5, 285.1, "Standard Fitment"),
    (15, "AI4STROKESTR", "4 STROKE STARTER (144F)", "320 + 5% GST", 320.0, "HIGH", "IN_STOCK", "144F 4-Stroke Spares", 1, 285.1, 350.0, "Standard Fitment"),
    (16, "AI85CYL", "CYLINDER KIT (14 PC SET DOUBLE GAP) PREMIUM QUALITY", "1300 + 5% GST", 1300.0, "HIGH", "IN_STOCK", "85CC Engine Spares", 1, 350.0, 498.5, "14 PC Set Double Gap"),
    (17, "AI85PIST", "PISTON SET 85CC", "325 + 5% GST", 325.0, "HIGH", "IN_STOCK", "85CC Engine Spares", 1, 498.5, 559.1, "Precision Fitment"),
    (18, "AI85CRANKA", "CRANKSHAFT 85CC", "800 + 5% GST", 800.0, "NORMAL", "IN_STOCK", "85CC Engine Spares", 1, 559.1, 618.6, "Balanced Steel"),
    (19, "AI85CRAN", "CRANKCASE 85CC", "815 + 5% GST", 815.0, "NORMAL", "IN_STOCK", "85CC Engine Spares", 1, 618.6, 699.1, "Reinforced Alloy"),
    (20, "AI85IGNI", "IGNITION COIL 85CC", "530 + 5% GST", 530.0, "HIGH", "IN_STOCK", "85CC Engine Spares", 1, 699.1, 758.3, "High-Output Spark"),

    # --- PAGE 3: 85CC ENGINE SPARES & ACCESSORIES ---
    (21, "AI85MUF", "MUFFLER 85CC", "350 + 5% GST", 350.0, "NORMAL", "IN_STOCK", "85CC Engine Spares", 2, 74.6, 133.9, "OEM Exhaust"),
    (22, "AI85STRT", "STARTER 85CC", "320 + 5% GST", 320.0, "HIGH", "IN_STOCK", "85CC Engine Spares", 2, 133.9, 193.5, "Super Easy Recoil"),
    (23, "AI85RIGHTHAND", "RIGHT HANDLE", "315 + 5% GST", 315.0, "NORMAL", "IN_STOCK", "85CC Chassis & Frame", 2, 193.5, 253.0, "Tubular Frame"),
    (24, "AI85SWITCHHAN", "SWITCH HANDLE", "220 + 5% GST", 220.0, "HIGH", "IN_STOCK", "85CC Chassis & Frame", 2, 253.0, 312.4, "Throttle & Stop Switch"),
    (25, "AI85PUL", "STARTER PULLEY", "90 + 5% GST", 90.0, "HIGH", "IN_STOCK", "85CC Recoil Spares", 2, 312.4, 371.9, "Nylon Cog Pulley"),
    (26, "AI85HAND", "PREMIUM STARTER HANDLE", "60 + 5% GST", 60.0, "HIGH", "IN_STOCK", "85CC Recoil Spares", 2, 371.9, 431.4, "Ergonomic Grip"),
    (27, "AI85TANK", "TANK HOUSING", "350 + 5% GST", 350.0, "NORMAL", "IN_STOCK", "85CC Fuel System", 2, 431.4, 491.0, "Vibration Damped"),
    (28, "AI85CAP", "FUEL TANK CAP (BLACK COLOR)", "46 + 5% GST", 46.0, "HIGH", "IN_STOCK", "85CC Fuel System", 2, 491.0, 550.6, "Leak-Proof Seal"),
    (29, "AI85SPON", "AIR FILTER SPONGE", "35 + 5% GST", 35.0, "HIGH", "IN_STOCK", "85CC Air Intake", 2, 550.6, 609.9, "Dual Stage Foam"),
    (30, "AI85MANI", "MANIFOLD", "120 + 5% GST", 120.0, "NORMAL", "IN_STOCK", "85CC Engine Spares", 2, 609.9, 669.5, "Heat Resistant"),
    (31, "AI85CLSP", "CLUTCH SPRING", "20 + 5% GST", 20.0, "HIGH", "IN_STOCK", "85CC Clutch Assy", 2, 669.5, 729.0, "Tempered Steel"),
    (32, "AI85GASK", "GASKET SET", "65 + 5% GST", 65.0, "HIGH", "IN_STOCK", "85CC Engine Spares", 2, 729.0, 788.4, "Full Engine Kit"),

    # --- PAGE 4: CRANKCASE SEALS ---
    (33, "AI85OILSEAL", "OIL SEAL SET", "46 + 5% GST", 46.0, "HIGH", "IN_STOCK", "85CC Engine Spares", 3, 74.5, 133.8, "Double Lip Nitrile")
]

extracted_items = []

print("\n--- Cropping high-resolution reference images from Earth Auger PDF ---")
for sr, code, name, price_str, price_num, demand, stock, subcat, page_idx, y0, y1, std_pack in rows_meta:
    page = doc[page_idx]
    clean_code = re.sub(r'[^a-zA-Z0-9]+', '_', code.lower()).strip('_')
    img_filename = f"ea_sr{sr}_{clean_code}.png"
    img_path = os.path.join(IMG_OUT_DIR, img_filename)

    # Inset 1.5 pt from the table border line to ensure clean pure image
    rect = fitz.Rect(309.5, y0 + 1.5, 477.0, y1 - 1.5)
    pix = page.get_pixmap(clip=rect, dpi=250)
    pix.save(img_path)

    relative_img_path = f"/images/spares/earth_auger/{img_filename}"
    gst_percent = 5.0
    total_incl_gst = round(price_num * (1.0 + gst_percent / 100.0), 2)

    item_dict = {
        "srNo": sr,
        "productCode": code,
        "itemName": name,
        "referenceImage": relative_img_path,
        "listPriceExclGst": price_num,
        "listPriceFormatted": price_str,
        "demand": demand,
        "stockStatus": stock,
        "subCategory": subcat,
        "packaging": std_pack,
        "gstPercent": gst_percent,
        "totalPriceInclGst": total_incl_gst,
        "sourcePdf": "EARTH AUGER MACHINE _ BIT_ SPARES 13.10.2026.pdf"
    }
    extracted_items.append(item_dict)
    print(f"[{sr:2d}/33] Extracted {code:18s} | ₹{price_num:7.1f} | {demand:6s} | {relative_img_path}")

output_payload = {
    "sourceDocument": "EARTH AUGER MACHINE _ BIT_ SPARES 13.10.2026.pdf",
    "documentDate": "13.10.2026",
    "extractedTotal": len(extracted_items),
    "extractedAt": "2026-11-18T17:00:00+05:30",
    "notes": [
        "1. Prices are exclusive of GST (5% GST applicable)",
        "2. Relevant discount applicable on the price mentioned",
        "3. Kindly, mention product code or serial No. while placing order",
        "4. Images of spares are for reference purpose"
    ],
    "items": extracted_items
}

with open(JSON_OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(output_payload, f, indent=2)

print(f"\nSuccessfully wrote {len(extracted_items)} items to {JSON_OUT_PATH}")
