# -*- coding: utf-8 -*-
"""
Syncs the 33 newly extracted Earth Auger Machines, Bits & Spares into:
1. frontend/src/data/complete_extracted_spares_catalog.json
2. frontend/src/data/sparesCompatibility.ts
3. Neon Cloud PostgreSQL database Product table
"""

import json
import re
import os
import subprocess

with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\earth_auger_spares_extracted.json", "r", encoding="utf-8") as f:
    ea_data = json.load(f)

# Load existing complete_extracted_spares_catalog.json
with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\complete_extracted_spares_catalog.json", "r", encoding="utf-8") as f:
    full_catalog = json.load(f)

# Update full_catalog Earth Auger category with the new authentic images and details
for cat in full_catalog["categories"]:
    if "auger" in cat["slug"]:
        cat["items"] = []
        for it in ea_data["items"]:
            cat["items"].append({
                "srNo": it["srNo"],
                "productCode": it["productCode"],
                "name": it["itemName"],
                "subCategory": it["subCategory"],
                "category": "Earth Auger Machines, Spiral Bits & Spares",
                "listPrice": it["listPriceExclGst"],
                "tax": it["listPriceFormatted"].split("+")[1].strip() if "+" in it["listPriceFormatted"] else "5% GST",
                "totalEstimated": it["totalPriceInclGst"],
                "demand": it["demand"],
                "stockStatus": it["stockStatus"],
                "packaging": it["packaging"],
                "imageUrl": it["referenceImage"],
                "notes": f"Standard fitting for 85CC / 95CC / 110CC Earth Augers ({it['subCategory']})"
            })

with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\complete_extracted_spares_catalog.json", "w", encoding="utf-8") as f:
    json.dump(full_catalog, f, indent=2, ensure_ascii=False)

print("Updated complete_extracted_spares_catalog.json with 33 Earth Auger items.")

# Re-run generate_spares_compatibility.py
subprocess.run(["python", r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\generate_spares_compatibility.py"], check=True)

# Re-run seed_extracted_catalog.js
subprocess.run(["node", r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\backend\scripts\seed_extracted_catalog.js"], check=True)

print("\n🎉 Synchronized all 33 Earth Auger items into Frontend and Neon Database!")
