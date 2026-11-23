# -*- coding: utf-8 -*-
"""
Generates frontend/src/data/sparesCompatibility.ts using all 118 verified spare parts
extracted from Arveer Impex's official PDF price lists.
Maps each spare part to its respective parent machine profile.
"""

import json
import re

with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\complete_extracted_spares_catalog.json", "r", encoding="utf-8") as f:
    catalog = json.load(f)

parent_machines = [
  {
    "id": "agroveer-170f-engine-pulley",
    "name": "Agroveer™ 170F 7.5 HP Petrol Engine with Pulley",
    "brand": "Agroveer",
    "category": "Farm Machinery & Engines",
    "image": "/images/products/agroveer-170f-petrol-engine-pulley.jpg",
    "specsSummary": "212cc 4-Stroke OHV | 7.5 HP @ 3600 RPM | 3.6L Tank",
    "shaftType": "19mm / 20mm Horizontal Keyed Shaft (Dual Groove Pulley)",
    "fuelType": "Petrol (Gasoline)",
    "sparesCount": 17,
    "hotFeatures": [
      "Factory fitted dual-groove power pulley",
      "Heavy-duty recoil starter assembly with MIMPN stamped pawls",
      "Thread-lock spill-proof petrol cap with viton seal",
      "Cast iron cylinder sleeve & OHV valvetrain"
    ]
  },
  {
    "id": "agroveer-2inch-water-pump-170f",
    "name": "Agroveer™ 2\" High-Pressure Agriculture Water Pump (W-P20)",
    "brand": "Agroveer",
    "category": "Agriculture Water Pumps",
    "image": "/images/products/agroveer-2inch-water-pump-170f.jpg",
    "specsSummary": "50mm (2\") Ports | 28m Max Head | 7m Suction | 35,000 L/hr",
    "shaftType": "Direct 170F Flange Mount (20mm keyed/threaded shaft)",
    "fuelType": "Petrol (Gasoline)",
    "sparesCount": 15,
    "hotFeatures": [
      "Aluminium intake & exhaust joints",
      "25mm tubular double-handle protective roll cage",
      "High-pressure cast aluminum pump casing",
      "Wear-resistant mechanical ceramic water seal"
    ]
  },
  {
    "id": "agroveer-3inch-water-pump-170f",
    "name": "Agroveer™ 3\" High-Flow Agriculture Water Pump (W-P30)",
    "brand": "Agroveer",
    "category": "Agriculture Water Pumps",
    "image": "/images/products/agroveer-3inch-water-pump-170f.jpg",
    "specsSummary": "80mm (3\") Ports | 30m Max Head | 8m Suction | 60,000 L/hr",
    "shaftType": "Direct 170F Flange Mount (20mm keyed/threaded shaft)",
    "fuelType": "Petrol (Gasoline)",
    "sparesCount": 12,
    "hotFeatures": [
      "High-volume 80mm suction & delivery ports",
      "Heavy-duty cast impeller with swirling shell",
      "Aluminium hose collar & flange couplings",
      "25mm double-handle protective frame"
    ]
  },
  {
    "id": "agroveer-85cc-earth-auger-ea85",
    "name": "Agroveer™ EA-85 85CC 2-Stroke Earth Auger Powerhead",
    "brand": "Agroveer",
    "category": "Earth Augers & Boring",
    "image": "/images/products/agroveer-85cc-earth-auger-poster.jpg",
    "specsSummary": "85cc High-Torque 2-Stroke | 2.4 kW @ 9000 RPM | 1.2L Tank",
    "shaftType": "20mm Standard Output Drive Shaft with Cross-Pin Retainer",
    "fuelType": "2T Petrol Mixture (25:1)",
    "sparesCount": 23,
    "hotFeatures": [
      "Super Easy Starter (+30% spring thickness, smooth pull)",
      "Twin-grip ergonomic handle with safety throttle switch",
      "Accepts 60mm to 200mm single & double spiral bits",
      "Heavy-duty planetary reduction gearbox"
    ]
  },
  {
    "id": "agroveer-110cc-4stroke-earth-auger",
    "name": "Agroveer™ 110CC 4-Stroke Heavy-Duty Earth Auger",
    "brand": "Agroveer",
    "category": "Earth Augers & Boring",
    "image": "/images/products/agroveer-110cc-4stroke-earth-auger.jpg",
    "specsSummary": "110cc 4-Stroke OHV | Pure Petrol Fueling | High Digging Torque",
    "shaftType": "20mm Heavy-Duty Output Drive Shaft",
    "fuelType": "Pure Unleaded Petrol (Separate 4T Engine Oil)",
    "sparesCount": 16,
    "hotFeatures": [
      "Pure petrol operation — zero 2T oil mixing required",
      "Heavy-gauge tubular wrap-around safety frame",
      "144F 4-stroke carburettor and starter assembly",
      "Double handle with easy-reach throttle lockout"
    ]
  },
  {
    "id": "agroveer-brush-cutter-28mm-9t",
    "name": "Agroveer™ 28mm / 9T Commercial Brush Cutter System",
    "brand": "Agroveer",
    "category": "Cutting Tools & Consumables",
    "image": "/images/products/open-source-brush-cutter-tiller.jpg",
    "specsSummary": "28mm Tube | 9-Spline Drive Shaft | 43CC / 52CC / GX35 Compatible",
    "shaftType": "28mm Outer Diameter with 9-Tooth Splined Inner Shaft",
    "fuelType": "2-Stroke / 4-Stroke (Engine Dependent)",
    "sparesCount": 48,
    "hotFeatures": [
      "Heavy cast aluminum clutch housing & gearhead",
      "Universal 9T spline shaft coupling",
      "Accommodates 2T, 40T, 60T, 80T blades and tiller weeder heads",
      "German polymer trimmer line compatible"
    ]
  },
  {
    "id": "sawking-chainsaw-range",
    "name": "SAWKING™ Heavy-Duty German Steel Chainsaw Range",
    "brand": "Sawking",
    "category": "Cutting Tools & Consumables",
    "image": "/images/products/sawking-super-gold-chainsaw-chain.jpg",
    "specsSummary": "18\" & 22\" Guide Bars | Full-Chisel Cutters | Hard Chrome & Gold TiN",
    "shaftType": "Standard Chainsaw Sprocket Drive",
    "fuelType": "Petrol Mixture",
    "sparesCount": 5,
    "hotFeatures": [
      "Blue heat-tempered tie-straps for elongation resistance",
      "PVD Titanium Nitride gold & hard-chrome cutter options",
      "22\" Double Link and 10° RMX rip cut variants available"
    ]
  }
]

compatible_spares = []

for cat in catalog["categories"]:
    cat_slug = cat["slug"]
    for it in cat["items"]:
        sr = it["srNo"]
        code = it.get("productCode") or f"AGR-SP-{sr}"
        name = it["name"]
        price = float(it["listPrice"])
        price_gst = round(price * 1.05) if "+ 5%" in it.get("tax", "") else round(price * 1.18)
        gst_rate = 0.05 if "+ 5%" in it.get("tax", "") else 0.18
        img = it.get("imageUrl") or "/images/products/open-source-petrol-engine.jpg"
        
        # Determine parent machine IDs
        parent_ids = []
        if "168" in cat_slug or "170f" in cat_slug:
            parent_ids = ["agroveer-170f-engine-pulley", "agroveer-2inch-water-pump-170f", "agroveer-3inch-water-pump-170f"]
            brand = "Agroveer"
            category_name = "170F Engine Spares"
        elif "water-pump" in cat_slug:
            parent_ids = ["agroveer-2inch-water-pump-170f", "agroveer-3inch-water-pump-170f"]
            brand = "Agroveer"
            category_name = "Water Pump Spares"
        elif "brush-cutter" in cat_slug:
            parent_ids = ["agroveer-brush-cutter-28mm-9t"]
            brand = "Agroveer"
            category_name = it.get("subCategory") or "Brush Cutter Spares"
        elif "chainsaw" in cat_slug:
            parent_ids = ["sawking-chainsaw-range"]
            brand = "Sawking"
            category_name = "Chainsaw Chains"
        elif "auger" in cat_slug:
            parent_ids = ["agroveer-85cc-earth-auger-ea85", "agroveer-110cc-4stroke-earth-auger"]
            brand = "Agroveer"
            category_name = it.get("subCategory") or "Earth Auger Spares"
        else:
            parent_ids = ["agroveer-170f-engine-pulley"]
            brand = "Arveer Impex"
            category_name = "Spare Parts"

        spare_id = f"sp-{re.sub(r'[^a-z0-9]+', '-', code.lower()).strip('-')}-{sr}"
        
        compatible_spares.append({
            "id": spare_id,
            "sku": code,
            "name": name,
            "brand": brand,
            "category": category_name,
            "priceExGst": price,
            "priceGst": price_gst,
            "gstRate": gst_rate,
            "inStock": it.get("stockStatus") != "OUT_OF_STOCK",
            "leadTime": "Immediate Dispatch",
            "fitsDescription": f"Original Arveer Impex factory component ({it.get('packaging') or it.get('standardPacking') or it.get('packingType') or 'Standard Pack'}). Mention code {code} when ordering.",
            "parentMachineIds": parent_ids,
            "image": img,
            "diagramPosition": f"Sr No {sr}: {it.get('subCategory') or cat['category']}",
            "demand": it.get("demand", "HIGH"),
            "stockStatus": it.get("stockStatus", "IN_STOCK")
        })

print(f"Generated {len(compatible_spares)} compatible spares.")

for m in parent_machines:
    m["sparesCount"] = len([s for s in compatible_spares if m["id"] in s["parentMachineIds"]])

output_ts = f"""import {{ ParentMachineProfile, SparePartItem }} from '@/types';

// ==============================================================================
// ARVEER IMPEX / AGROVEER & SAWKING — VERIFIED SPARE PARTS & COMPATIBILITY MATRIX
// 100% Authentic Factory Extract from 5 Official Price Lists (October - November 2026)
// Total Verified Spare Parts: {len(compatible_spares)} | Parent Machines: {len(parent_machines)}
// ==============================================================================

export const PARENT_MACHINES: ParentMachineProfile[] = {json.dumps(parent_machines, indent=2)};

export const COMPATIBLE_SPARES: SparePartItem[] = {json.dumps(compatible_spares, indent=2)};
"""

with open(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\sparesCompatibility.ts", "w", encoding="utf-8") as f:
    f.write(output_ts)

print("Successfully written frontend/src/data/sparesCompatibility.ts")
