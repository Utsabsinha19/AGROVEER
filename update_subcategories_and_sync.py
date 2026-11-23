# -*- coding: utf-8 -*-
"""
Update subcategories across all 5 JSON extractions,
sync complete_extracted_spares_catalog.json, and regenerate sparesCompatibility.ts
"""

import json
import os
import re

DATA_DIR = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data"

# 1. Update 168&170F Engine Spares subcategories
eng_path = os.path.join(DATA_DIR, "engine_170f_spares_extracted.json")
with open(eng_path, "r", encoding="utf-8") as f:
    eng_data = json.load(f)

eng_subcat_map = {
    "ENG-170F-CC75": "Crankcase & Covers",
    "ENG-168F-CC65": "Crankcase & Covers",
    "ENG-170F-INEXV": "Valves & Tappets",
    "ENG-170F-OILSEP": "Crankcase & Breather",
    "ENG-170F-GOVGR": "Governor & Timing",
    "ENG-170F-VENT": "Crankcase & Breather",
    "ENG-168F-PIST-STD": "Pistons & Rings",
    "ENG-168F-PIST-025": "Pistons & Rings",
    "ENG-168F-PIST-050": "Pistons & Rings",
    "ENG-170F-CAM-IRON": "Camshaft Assembly",
    "ENG-170F-CAM-NYLON": "Camshaft Assembly",
    "ENG-170F-INVAL": "Valves & Tappets",
    "ENG-170F-FTCAP": "Fuel Tank & Cap",
    "ENG-170F-ROCKARM": "Valves & Tappets",
    "ENG-170F-FLYWHEEL": "Ignition & Flywheel",
    "ENG-170F-TAPPET-PR": "Valves & Tappets",
    "ENG-170F-STR-ROPE": "Recoil Starter"
}

for it in eng_data["items"]:
    it["subCategory"] = eng_subcat_map.get(it["productCode"], "168F & 170F Engine Spares")

with open(eng_path, "w", encoding="utf-8") as f:
    json.dump(eng_data, f, indent=2, ensure_ascii=False)

# 2. Update Water Pump Spares subcategories
wp_path = os.path.join(DATA_DIR, "water_pump_spares_extracted.json")
with open(wp_path, "r", encoding="utf-8") as f:
    wp_data = json.load(f)

wp_subcat_map = {
    "WP2-INEX-JT-AL": "Flanges & Couplings",
    "WP2-SPANNER": "Tools & Maintenance",
    "WP2-WSEAL-BOX": "Mechanical Water Seals",
    "WP2-BIG-SEALRING": "Gaskets & Rubber Seals",
    "WP2-SEALRING-IO": "Gaskets & Rubber Seals",
    "WP2-GASKET-IO": "Gaskets & Rubber Seals",
    "WP2-HOSE-CLIP": "Flanges & Couplings",
    "WP2-SWIRL-WHEEL": "Impellers & Diffusers",
    "WP2-WSEAL-FAC": "Mechanical Water Seals",
    "WP2-RUBBER-GASKET": "Gaskets & Rubber Seals",
    "WP2-RUBBER-SEAL": "Gaskets & Rubber Seals",
    "WP2-BLOCKER": "Pump Housing & Valve",
    "WP2-IMP-KEY": "Impellers & Diffusers",
    "WP2-IMP-THREAD": "Impellers & Diffusers",
    "WP2-SWIRL-SHELL": "Impellers & Diffusers"
}

for it in wp_data["items"]:
    it["subCategory"] = wp_subcat_map.get(it["productCode"], "2 Inch Water Pump Spares")

with open(wp_path, "w", encoding="utf-8") as f:
    json.dump(wp_data, f, indent=2, ensure_ascii=False)

# 3. Update Chainsaw Chains subcategories
cs_path = os.path.join(DATA_DIR, "chainsaw_spares_extracted.json")
with open(cs_path, "r", encoding="utf-8") as f:
    cs_data = json.load(f)

cs_subcat_map = {
    "AI18-SIL": '18" Sawking Chains',
    "AI22-SIL": '22" Sawking Chains',
    "AI18-GLD": "Titanium Gold TiN Series",
    "AI22-DBLLNK": "Double Link Heavy Duty",
    "AI22-RMX": "RMX 10° Ripping Chains"
}

for it in cs_data["items"]:
    it["subCategory"] = cs_subcat_map.get(it["productCode"], "Chainsaw Chains")

with open(cs_path, "w", encoding="utf-8") as f:
    json.dump(cs_data, f, indent=2, ensure_ascii=False)

# 4. Load Earth Auger and Brush Cutter
with open(os.path.join(DATA_DIR, "earth_auger_spares_extracted.json"), "r", encoding="utf-8") as f:
    ea_data = json.load(f)

with open(os.path.join(DATA_DIR, "brush_cutter_spares_extracted.json"), "r", encoding="utf-8") as f:
    bc_data = json.load(f)

# 5. Build Complete Extracted Catalog
def map_items(items_list, master_cat_name, gst_rate_str):
    mapped = []
    for it in items_list:
        sr = it["srNo"]
        code = it["productCode"]
        name = it["itemName"]
        price = it["listPriceExclGst"]
        img = it["referenceImage"]
        demand = it.get("demand", "HIGH")
        stock = it.get("stockStatus", "IN_STOCK")
        pkg = it.get("packaging", "Standard Factory Pack")
        subcat = it.get("subCategory", master_cat_name)
        gst_pct = it.get("gstPercent", 5.0 if "5%" in gst_rate_str else 18.0)
        tot_incl = it.get("totalPriceInclGst", round(price * (1.0 + gst_pct / 100.0), 2))

        mapped.append({
            "srNo": sr,
            "productCode": code,
            "name": name,
            "masterCategory": master_cat_name,
            "subCategory": subcat,
            "listPrice": price,
            "tax": gst_rate_str,
            "listPriceFormatted": f"₹{int(price)} {gst_rate_str}",
            "standardPacking": pkg,
            "packaging": pkg,
            "imageUrl": img,
            "referenceImage": img,
            "demand": demand,
            "stockStatus": stock,
            "gstPercent": gst_pct,
            "totalPriceInclGst": tot_incl,
            "sourcePdf": it.get("sourcePdf", "")
        })
    return mapped

new_categories = [
    {
        "category": "Brush Cutter Attachments & Spares",
        "slug": "brush-cutter-attachments-and-spares",
        "sourcePdf": "BRUSH CUTTER SPARES 01.11.2026.pdf",
        "itemCount": len(bc_data["items"]),
        "applicableTax": "+ 18% GST",
        "items": map_items(bc_data["items"], "Brush Cutter Attachments & Spares", "+ 18% GST")
    },
    {
        "category": "Earth Auger Machines, Spiral Bits & Spares",
        "slug": "earth-auger-machines-bits-and-spares",
        "sourcePdf": "EARTH AUGER MACHINE _ BIT_ SPARES 13.10.2026.pdf",
        "itemCount": len(ea_data["items"]),
        "applicableTax": "+ 18% GST",
        "items": map_items(ea_data["items"], "Earth Auger Machines, Spiral Bits & Spares", "+ 18% GST")
    },
    {
        "category": "168F & 170F Petrol Engine Spares",
        "slug": "engine-spares-168f-170f",
        "sourcePdf": "168&170F ENGINE SPARES PRICE LIST 13.10.2026.pdf",
        "itemCount": len(eng_data["items"]),
        "applicableTax": "+ 5% GST",
        "items": map_items(eng_data["items"], "168F & 170F Petrol Engine Spares", "+ 5% GST")
    },
    {
        "category": "2 Inch Agricultural Water Pump Spares",
        "slug": "water-pump-spares-2-inch",
        "sourcePdf": "2 INCH WATER PUMP SPARES PRICE LIST 13.10.2026.pdf",
        "itemCount": len(wp_data["items"]),
        "applicableTax": "+ 5% GST",
        "items": map_items(wp_data["items"], "2 Inch Agricultural Water Pump Spares", "+ 5% GST")
    },
    {
        "category": "SAWKING Heavy Duty Chainsaw Chains",
        "slug": "chainsaw-chains-sawking",
        "sourcePdf": "CHAIN PRICE LIST_14.11.2026.pdf",
        "itemCount": len(cs_data["items"]),
        "applicableTax": "+ 18% GST",
        "items": map_items(cs_data["items"], "SAWKING Heavy Duty Chainsaw Chains", "+ 18% GST")
    }
]

catalog_path = os.path.join(DATA_DIR, "complete_extracted_spares_catalog.json")
with open(catalog_path, "r", encoding="utf-8") as f:
    old_cat = json.load(f)

machinery = old_cat.get("machineryUnits", [])

updated_catalog = {
    "organization": "Arveer Impex / AGROVÉ Commercial Machinery",
    "catalogTitle": "Arveer Impex Master Factory Spare Parts & Machinery Catalog",
    "updatedAt": "2026-11-18T18:55:00+05:30",
    "totalSpareParts": sum(c["itemCount"] for c in new_categories),
    "totalCategories": len(new_categories),
    "totalMachineryUnits": len(machinery),
    "categories": new_categories,
    "machineryUnits": machinery
}

with open(catalog_path, "w", encoding="utf-8") as f:
    json.dump(updated_catalog, f, indent=2, ensure_ascii=False)

print(f"Updated complete_extracted_spares_catalog.json ({updated_catalog['totalSpareParts']} spares).")

# 6. Build sparesCompatibility.ts
parent_machines = [
  {
    "id": "all-machines",
    "name": "All Equipment Lines & Categories",
    "brand": "Arveer Impex",
    "category": "Farm Machinery & Engines",
    "image": "/images/products/agroveer-170f-petrol-engine-pulley.jpg",
    "specsSummary": "118 Total Verified OEM Spare Parts Across All 5 Factory Product Lines",
    "shaftType": "Universal Commercial Fitments",
    "fuelType": "Petrol / 2T Mix / Electric Cordless",
    "sparesCount": 118,
    "hotFeatures": [
      "100% authentic factory price list extractions",
      "Dynamic GST breakdown with transparent dealer discounts",
      "Immediate godown dispatch with LR Bilty tracking"
    ]
  },
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

for cat in new_categories:
    cat_slug = cat["slug"]
    master_cat_name = cat["category"]
    for it in cat["items"]:
        sr = it["srNo"]
        code = it["productCode"]
        name = it["name"]
        price = float(it["listPrice"])
        price_gst = it["totalPriceInclGst"]
        gst_rate = round(it["gstPercent"] / 100.0, 2)
        img = it["imageUrl"]
        subcat = it["subCategory"]

        # Determine parent machine IDs
        parent_ids = ["all-machines"]
        if "168" in cat_slug or "170f" in cat_slug:
            parent_ids.extend(["agroveer-170f-engine-pulley", "agroveer-2inch-water-pump-170f", "agroveer-3inch-water-pump-170f"])
            brand = "Agroveer"
        elif "water-pump" in cat_slug:
            parent_ids.extend(["agroveer-2inch-water-pump-170f", "agroveer-3inch-water-pump-170f"])
            brand = "Agroveer"
        elif "brush-cutter" in cat_slug:
            parent_ids.append("agroveer-brush-cutter-28mm-9t")
            brand = "Agroveer"
        elif "chainsaw" in cat_slug:
            parent_ids.append("sawking-chainsaw-range")
            brand = "Sawking"
        elif "auger" in cat_slug:
            parent_ids.extend(["agroveer-85cc-earth-auger-ea85", "agroveer-110cc-4stroke-earth-auger"])
            brand = "Agroveer"
        else:
            parent_ids.append("agroveer-170f-engine-pulley")
            brand = "Arveer Impex"

        spare_id = f"sp-{re.sub(r'[^a-z0-9]+', '-', code.lower()).strip('-')}-{sr}"

        compatible_spares.append({
            "id": spare_id,
            "sku": code,
            "name": name,
            "brand": brand,
            "category": subcat,
            "masterCategory": master_cat_name,
            "priceExGst": price,
            "priceGst": price_gst,
            "gstRate": gst_rate,
            "inStock": it.get("stockStatus") != "OUT_OF_STOCK",
            "leadTime": "Immediate Dispatch",
            "fitsDescription": f"Original Arveer Impex factory component ({it.get('packaging') or 'Standard Pack'}). Mention code {code} when ordering.",
            "parentMachineIds": parent_ids,
            "image": img,
            "diagramPosition": f"Sr No {sr}: {subcat}",
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

with open(os.path.join(DATA_DIR, "sparesCompatibility.ts"), "w", encoding="utf-8") as f:
    f.write(output_ts)

print("Successfully written frontend/src/data/sparesCompatibility.ts")
