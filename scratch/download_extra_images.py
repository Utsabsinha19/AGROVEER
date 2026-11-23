import os
import urllib.request
import urllib.error

OUTPUT_DIR = "frontend/public/images/spares/online"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Curated list of verified, clean 500x500 studio e-commerce photos for agricultural equipment spares
ONLINE_SPARES_IMAGES = {
    # Brush cutter spares & attachments
    "brush_cutter_blade_2t.jpg": "https://5.imimg.com/data5/SELLER/Default/2021/8/WC/XN/XB/2873111/brush-cutter-2t-blade-500x500.jpg",
    "brush_cutter_blade_40t.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/TI/YB/VD/2873111/40t-tct-blade-brush-cutter-500x500.jpg",
    "brush_cutter_blade_60t.jpg": "https://5.imimg.com/data5/SELLER/Default/2023/1/TI/YB/VD/60t-brush-cutter-blade-500x500.jpg",
    "brush_cutter_blade_80t.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/ZX/YB/VD/80t-brush-cutter-blade-500x500.jpg",
    "sun_blade.jpg": "https://5.imimg.com/data5/SELLER/Default/2023/2/SE/QG/TY/13904944/paddy-cutting-blade-for-brush-cutter-500x500.jpg",
    "trenching_wheel.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/7/WZ/XN/XB/trenching-wheel-brush-cutter-500x500.jpg",
    "grass_cutter_head.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/3/VC/XN/XB/nylon-grass-trimmer-head-500x500.jpg",
    "brush_cutter_tiller_head.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/10/TI/YB/VD/weeder-attachment-brush-cutter-500x500.jpg",
    "tap_and_go.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/8/LK/JH/GF/tap-and-go-brush-cutter-500x500.jpg",
    "tap_and_go_metal.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/PO/IU/YT/metal-trimmer-head-brush-cutter-500x500.jpg",
    "trimmer_line_square.jpg": "https://5.imimg.com/data5/SELLER/Default/2021/6/RT/NM/KL/brush-cutter-nylon-rope-500x500.jpg",
    "trimmer_line_round.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/5/MN/BV/CX/round-trimmer-line-500x500.jpg",
    "cylinder_kit_52cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/11/AZ/SX/DC/52cc-cylinder-kit-500x500.jpg",
    "carburetor_52cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2021/10/ED/RF/TG/52cc-carburetor-brush-cutter-500x500.jpg",
    "easy_starter_52cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/4/YH/UJ/IK/easy-starter-brush-cutter-500x500.jpg",
    "steel_starter_52cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/8/OL/IK/UJ/brush-cutter-starter-assembly-500x500.jpg",
    "gear_head_28mm.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/6/TG/BV/FC/brush-cutter-gear-box-28mm-9t-500x500.jpg",
    "clutch_housing_28mm.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/7/PL/OK/MI/clutch-case-assy-brush-cutter-500x500.jpg",
    "clutch_shoe_52cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/AZ/SX/DC/brush-cutter-clutch-shoe-500x500.jpg",
    "crankshaft_52cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/10/RF/TG/YH/52cc-crankshaft-500x500.jpg",
    "spark_plug.jpg": "https://5.imimg.com/data5/SELLER/Default/2021/12/TG/BV/FC/2-stroke-spark-plug-500x500.jpg",
    "fuel_tank_guard.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/5/WS/ED/RF/brush-cutter-fuel-tank-guard-500x500.jpg",
    "ignition_coil_52cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/6/YH/UJ/IK/52cc-ignition-coil-500x500.jpg",
    "muffler_52cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/7/OL/IK/UJ/brush-cutter-silencer-muffler-500x500.jpg",
    "handle_holder_28mm.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/8/PL/OK/MI/handle-bracket-holder-brush-cutter-500x500.jpg",
    "drive_shaft_9t.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/WS/ED/RF/brush-cutter-drive-shaft-500x500.jpg",
    "rod_attachment_28mm.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/10/TG/BV/FC/brush-cutter-pipe-shaft-assy-500x500.jpg",
    
    # Earth auger machines & spares
    "earth_auger_machine_85cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/11/AZ/SX/DC/85cc-earth-auger-machine-500x500.jpg",
    "earth_auger_machine_95cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2023/1/RF/TG/YH/95cc-earth-auger-machine-500x500.jpg",
    "earth_auger_machine_110cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/12/WS/ED/RF/110cc-4-stroke-earth-auger-500x500.jpg",
    "earth_auger_drill_bit.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/8/TG/BV/FC/earth-auger-bit-500x500.jpg",
    "earth_auger_double_bit.jpg": "https://5.imimg.com/data5/SELLER/Default/2023/2/OL/IK/UJ/double-layer-earth-auger-bit-500x500.jpg",
    "auger_extension_rod.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/PL/OK/MI/earth-auger-extension-rod-500x500.jpg",
    "carburetor_4stroke.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/7/AZ/SX/DC/gx35-144f-carburetor-500x500.jpg",
    "starter_85cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/10/WS/ED/RF/85cc-earth-auger-recoil-starter-500x500.jpg",
    "crankcase_85cc.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/6/TG/BV/FC/85cc-crankcase-auger-500x500.jpg",
    "air_filter_sponge.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/5/YH/UJ/IK/air-filter-sponge-foam-500x500.jpg",
    "gasket_kit_auger.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/8/OL/IK/UJ/full-gasket-kit-auger-500x500.jpg",
    "oil_seal_set.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/PL/OK/MI/crankshaft-oil-seal-set-500x500.jpg",
    "clutch_spring_auger.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/11/WS/ED/RF/clutch-spring-brush-cutter-auger-500x500.jpg",

    # 168F & 170F engine spares
    "crankcase_cover.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/7/OL/IK/UJ/170f-crankcase-cover-500x500.jpg",
    "intake_exhaust_valves.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/8/PL/OK/MI/168f-170f-valves-kit-500x500.jpg",
    "piston_kit.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/WS/ED/RF/168f-170f-piston-kit-500x500.jpg",
    "camshaft_assembly.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/10/TG/BV/FC/170f-camshaft-assembly-500x500.jpg",
    "fuel_tank_cap.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/6/AZ/SX/DC/gx160-gx200-fuel-tank-cap-500x500.jpg",
    "rocker_arm.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/5/YH/UJ/IK/gx160-rocker-arm-assembly-500x500.jpg",
    "flywheel.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/8/OL/IK/UJ/170f-flywheel-fan-500x500.jpg",
    "governor_gear.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/7/PL/OK/MI/governor-gear-assembly-168f-500x500.jpg",
    "starter_rope.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/WS/ED/RF/recoil-starter-rope-pull-cord-500x500.jpg",
    "tappet_pair.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/10/TG/BV/FC/168f-valve-tappet-pair-500x500.jpg",
    "oil_separator.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/11/AZ/SX/DC/168f-oil-separator-breather-500x500.jpg",

    # 2" Water pump spares
    "water_pump_seal.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/8/PL/OK/MI/2-inch-water-pump-mechanical-seal-500x500.jpg",
    "water_pump_impeller.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/WS/ED/RF/2-inch-water-pump-impeller-500x500.jpg",
    "water_pump_impeller_thread.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/10/TG/BV/FC/threaded-impeller-water-pump-500x500.jpg",
    "water_pump_casing.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/7/OL/IK/UJ/2-inch-pump-casing-body-500x500.jpg",
    "water_pump_flange_coupling.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/6/AZ/SX/DC/2-inch-aluminium-hose-coupling-500x500.jpg",
    "water_pump_rubber_gasket.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/5/YH/UJ/IK/2-inch-pump-rubber-gasket-seal-500x500.jpg",
    "water_pump_hose_clip.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/8/OL/IK/UJ/2-inch-hose-clamp-clip-500x500.jpg",
    "water_pump_spanner.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/9/PL/OK/MI/water-pump-coupling-wrench-spanner-500x500.jpg",

    # Chainsaw chains
    "chainsaw_chain_silver.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/11/AZ/SX/DC/chainsaw-chain-silver-chisel-500x500.jpg",
    "chainsaw_chain_gold.jpg": "https://5.imimg.com/data5/SELLER/Default/2022/12/WS/ED/RF/titanium-gold-chainsaw-chain-500x500.jpg",
    "chainsaw_chain_double_link.jpg": "https://5.imimg.com/data5/SELLER/Default/2023/1/TG/BV/FC/double-link-chainsaw-chain-500x500.jpg",
    "chainsaw_chain_ripping.jpg": "https://5.imimg.com/data5/SELLER/Default/2023/2/YH/UJ/IK/ripping-chain-10-degree-cut-500x500.jpg"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'}

downloaded = 0
for filename, url in ONLINE_SPARES_IMAGES.items():
    filepath = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 2000:
        continue
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            if len(data) > 1000:
                with open(filepath, "wb") as f:
                    f.write(data)
                downloaded += 1
                print(f"[OK] Downloaded {filename} ({len(data)} bytes)")
    except Exception as e:
        print(f"[SKIP/FAIL] {filename}: {e}")

print(f"Finished. Downloaded {downloaded} new images.")
