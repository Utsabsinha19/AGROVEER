# -*- coding: utf-8 -*-
"""
Syncs the 48 newly extracted Brush Cutter Spares into:
1. frontend/src/data/sparesCompatibility.ts
2. Neon Cloud PostgreSQL database Product table
"""

import json
import re
import os
import subprocess

with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\brush_cutter_spares_extracted.json", "r", encoding="utf-8") as f:
    bc_data = json.load(f)

# Load existing sparesCompatibility.ts
spares_file = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\sparesCompatibility.ts"
with open(spares_file, "r", encoding="utf-8") as f:
    content = f.read()

# Extract PARENT_MACHINES and other COMPATIBLE_SPARES
# We'll read the existing COMPATIBLE_SPARES JSON or regenerate it keeping all other categories intact
with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\complete_extracted_spares_catalog.json", "r", encoding="utf-8") as f:
    full_catalog = json.load(f)

# Update full_catalog with the new brush cutter images and details
for cat in full_catalog["categories"]:
    if "brush-cutter" in cat["slug"]:
        cat["items"] = []
        for it in bc_data["items"]:
            cat["items"].append({
                "srNo": it["srNo"],
                "productCode": it["productCode"],
                "name": it["itemName"],
                "subCategory": it["subCategory"],
                "category": "Brush Cutter Attachments & Spares",
                "listPrice": it["listPriceExclGst"],
                "tax": it["listPriceFormatted"].split("+")[1].strip() if "+" in it["listPriceFormatted"] else "5% GST",
                "totalEstimated": it["totalPriceInclGst"],
                "demand": it["demand"],
                "stockStatus": it["stockStatus"],
                "imageUrl": it["referenceImage"],
                "notes": f"Standard fitting for 28mm / 9-spline brush cutter gear heads ({it['subCategory']})"
            })

with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\complete_extracted_spares_catalog.json", "w", encoding="utf-8") as f:
    json.dump(full_catalog, f, indent=2, ensure_ascii=False)

# Re-run generate_spares_compatibility.py
subprocess.run(["python", r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\generate_spares_compatibility.py"], check=True)

# Re-run seed_extracted_catalog.js
subprocess.run(["node", r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\backend\scripts\seed_extracted_catalog.js"], check=True)

print("Synchronized all 48 Brush Cutter items into Frontend and Neon Database!")
