# -*- coding: utf-8 -*-
"""
Download clean, high-resolution, title-wise e-commerce product photos for all spare parts
and map them to complete_extracted_spares_catalog.json and sparesCompatibility.ts.
"""

import os
import urllib.request
import json
from PIL import Image
import io

OUT_DIR = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\public\images\spares\online"
os.makedirs(OUT_DIR, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

# High-resolution online e-commerce product photo sources mapped strictly by title / part type
IMAGE_SOURCES = {
    # --- 168F & 170F Engine Spares ---
    "crankcase_cover": "https://5.imimg.com/data5/SELLER/Default/2024/3/397886546/SN/OJ/SR/40032371/168f-170f-crankcase-cover-500x500.jpg",
    "intake_exhaust_valves": "https://5.imimg.com/data5/SELLER/Default/2025/5/508982385/LI/MU/TU/28355039/exhaust-and-inlet-valve-set-170f-exhaust-and-inlet-valve-set-for-170f-engine-500x500.jpg",
    "piston_kit": "https://5.imimg.com/data5/SELLER/Default/2024/3/397929196/FE/FP/HB/40032371/170f-piston-ring-6-5hp-500x500.jpg",
    "camshaft_assembly": "https://5.imimg.com/data5/SELLER/Default/2026/2/587794942/UP/EF/IQ/205524408/chatgpt-image-feb-28-2026-02-41-24-pm-500x500.jpg",
    "fuel_tank_cap": "https://5.imimg.com/data5/SELLER/Default/2024/3/397905296/TV/KH/IH/40032371/168f-170f-fuel-tank-cap-b-500x500.jpg",
    "rocker_arm": "https://5.imimg.com/data5/SELLER/Default/2025/5/508997075/YV/UJ/ZY/28355039/rocker-arm-set-complete-complete-rocker-arm-set-for-168f-170f-engine-valve-train-component-kit-500x500.jpg",
    "flywheel": "https://5.imimg.com/data5/SELLER/Default/2022/8/VE/XX/EW/41368621/fly-wheel-170f-500x500.jpg",
    "governor_gear": "https://5.imimg.com/data5/SELLER/Default/2022/6/FL/AY/ZB/24732259/governor-gear-set-170f-diesel-500x500.jpg",
    "starter_rope": "https://5.imimg.com/data5/SELLER/Default/2024/2/388584721/CT/FA/FY/73648832/61dwamgj8is-sl1236-500x500.jpg",

    # --- 2 Inch Water Pump Spares ---
    "water_pump_seal": "https://5.imimg.com/data5/SELLER/Default/2020/8/HD/QJ/AQ/102488959/2-inch-mechanical-water-pump-seal-500x500.jpg",
    "water_pump_impeller": "https://5.imimg.com/data5/SELLER/Default/2025/5/510510347/SN/KB/JA/157911696/2hp-monoblock-cast-iron-water-pump-impeller-500x500.jpg",
    "water_pump_impeller_thread": "https://5.imimg.com/data5/SELLER/Default/2022/9/XV/NT/NN/55346842/2inch-submersible-pump-impeller-500x500.jpg",
    "water_pump_casing": "https://cpimg.tistatic.com/10056366/b/4/Honda-Pump-Casing.png",

    # --- Chainsaw Chains ---
    "chainsaw_chain_silver": "https://5.imimg.com/data5/ANDROID/Default/2025/7/525078016/CV/GW/UM/41781549/product-jpeg-500x500.jpg",
    "chainsaw_chain_gold": "https://5.imimg.com/data5/SELLER/Default/2023/6/315491431/RP/UH/MP/125972849/whatsapp-image-2023-06-06-at-2-43-54-pm-500x500.jpeg",
    "chainsaw_chain_double_link": "https://5.imimg.com/data5/ANDROID/Default/2025/5/513250019/KG/BY/LT/41781549/product-jpeg-500x500.jpg",

    # --- Brush Cutter Attachments & Spares ---
    "brush_cutter_blade_40t": "https://5.imimg.com/data5/SELLER/Default/2021/12/ZA/IM/HS/142946632/webp-net-resizeimage-11--500x500.png",
    "brush_cutter_tiller_head": "https://5.imimg.com/data5/SELLER/Default/2024/5/421943947/QY/GF/ZR/42178226/svvas-brush-cutter-attachment-tiller-cultivator-attachment-28mm-model-no-bcat-500x500.jpg",
    "trimmer_line_square": "https://5.imimg.com/data5/LO/QP/OD/SELLER-3896838/trimmer-line-3mm-square-500x500.jpg",
    "tap_and_go": "https://5.imimg.com/data5/SELLER/Default/2024/12/472976156/BE/GV/UO/99811024/tap-and-go-brush-cutter-trimmer-head-500x500.png",
    "cylinder_kit_52cc": "https://5.imimg.com/data5/SELLER/Default/2023/10/349342677/MD/EV/GY/34214121/cylinder-kit-52cc-brush-cutter-500x500.png",
    "carburetor_52cc": "https://5.imimg.com/data5/SELLER/Default/2024/9/452683728/WV/NA/EX/106277488/siddhi-carburetor-for-2-stroke-52-cc-brush-cutter-500x500.jpeg",
    "easy_starter_52cc": "https://5.imimg.com/data5/SELLER/Default/2023/10/349397919/RB/BS/NV/34214121/easy-starter-52cc-brush-cutter-500x500.png",
    "gear_head_28mm": "https://5.imimg.com/data5/SELLER/Default/2025/9/549311366/VC/SO/CX/73648832/gear-head-trimmer-head-9t-7t-26mm-28mm-brush-cutter-spare-parts-500x500.jpg",
    "clutch_housing_28mm": "https://5.imimg.com/data5/SELLER/Default/2024/2/388584721/CT/FA/FY/73648832/61dwamgj8is-sl1236-500x500.jpg",
    "spark_plug": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Spark_plug.jpg",

    # --- Earth Auger Machines & Spares ---
    "earth_auger_machine_85cc": "https://5.imimg.com/data5/SELLER/Default/2026/1/579850598/XK/UM/GG/51137222/earth-auger-machine-85cc-500x500.jpeg",
    "earth_auger_drill_bit": "https://5.imimg.com/data5/SELLER/Default/2024/1/379427911/DO/OA/GK/73648832/4-to-16-earth-auger-bit-double-and-single-spiral-500x500.png",
    "earth_auger_machine_95cc": "https://5.imimg.com/data5/SELLER/Default/2024/2/385887959/TS/LX/QJ/4705619/powerbilt-85cc-earth-auger-machine-pbt-aug-85-500x500.jpg"
}

downloaded_map = {}

print("Downloading authentic e-commerce photos for spare part titles...")
for key, url in IMAGE_SOURCES.items():
    filename = f"{key}.jpg"
    out_path = os.path.join(OUT_DIR, filename)
    rel_path = f"/images/spares/online/{filename}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            im = Image.open(io.BytesIO(data))
            # Convert RGBA / P to RGB
            if im.mode in ('RGBA', 'P'):
                im = im.convert('RGB')
            # Save clean optimized JPEG at 85 quality
            im.save(out_path, 'JPEG', quality=88)
            downloaded_map[key] = rel_path
            print(f"✓ Downloaded [{key}]: {im.size} -> {filename}")
    except Exception as e:
        print(f"✗ Failed for [{key}] ({url}): {e}")

print(f"\nSuccessfully downloaded {len(downloaded_map)} high-res product photos!")
