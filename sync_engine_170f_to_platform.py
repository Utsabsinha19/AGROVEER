# -*- coding: utf-8 -*-
"""
Syncs the 17 newly extracted 168F & 170F Engine Spares into:
1. frontend/src/data/complete_extracted_spares_catalog.json
2. frontend/src/data/sparesCompatibility.ts
3. Neon Cloud PostgreSQL database Product table
"""

import json
import re
import os
import subprocess

with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\engine_170f_spares_extracted.json", "r", encoding="utf-8") as f:
    eng_data = json.load(f)

# Load existing complete_extracted_spares_catalog.json
with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\complete_extracted_spares_catalog.json", "r", encoding="utf-8") as f:
    full_catalog = json.load(f)

# Update full_catalog 168F/170F category with the new authentic images and details
for cat in full_catalog["categories"]:
    if "168" in cat["slug"] or "170f" in cat["slug"]:
        cat["items"] = []
        for it in eng_data["items"]:
            cat["items"].append({
                "srNo": it["srNo"],
                "productCode": it["productCode"],
                "name": it["itemName"],
                "subCategory": it["subCategory"],
                "category": "168F & 170F Petrol Engine Spares",
                "listPrice": it["listPriceExclGst"],
                "tax": it["listPriceFormatted"].split("+")[1].strip() if "+" in it["listPriceFormatted"] else "5% GST",
                "totalEstimated": it["totalPriceInclGst"],
                "demand": it["demand"],
                "stockStatus": it["stockStatus"],
                "packaging": it["packaging"],
                "imageUrl": it["referenceImage"],
                "notes": f"Genuine factory spares for 168F (6.5 HP) and 170F (7.5 HP) petrol engines ({it['packaging']})"
            })

with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\complete_extracted_spares_catalog.json", "w", encoding="utf-8") as f:
    json.dump(full_catalog, f, indent=2, ensure_ascii=False)

print("Updated complete_extracted_spares_catalog.json with 17 Engine Spares items.")

# Re-run generate_spares_compatibility.py
subprocess.run(["python", r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\generate_spares_compatibility.py"], check=True)

# Re-run seed_extracted_catalog.js
subprocess.run(["node", r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\backend\scripts\seed_extracted_catalog.js"], check=True)

print("\n🎉 Synchronized all 17 Engine Spares into Frontend and Neon Database!")
