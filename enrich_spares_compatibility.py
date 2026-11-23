import json
import re

with open('frontend/src/data/brush_cutter_spares_extracted.json', 'r', encoding='utf-8') as f:
    bc_data = json.load(f)

# Map by productCode / sku
sku_map = {}
for item in bc_data['items']:
    sku = item['productCode'].strip().upper()
    sku_map[sku] = item

with open('frontend/src/data/sparesCompatibility.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update each spare item in COMPATIBLE_SPARES that matches brush cutter items
updated_count = 0
for item in bc_data['items']:
    img = item['referenceImage']
    demand = item['demand']
    stock = item['stockStatus']
    
    # Locate item in content by its unique image path
    # e.g. "image": "/images/spares/brush_cutter/bc_sr1_bcsmb2t_stl_1_6mm.png",
    pattern = rf'("image":\s*"{re.escape(img)}",\s*\n\s*"diagramPosition":\s*"[^"]*")'
    replacement_tail = f',\n    "demand": "{demand}",\n    "stockStatus": "{stock}"'
    
    match = re.search(pattern, content)
    if match:
        old_part = match.group(1)
        new_part = old_part + replacement_tail
        content = content.replace(old_part, new_part, 1)
        updated_count += 1

print(f"Updated {updated_count} items in sparesCompatibility.ts with demand and stockStatus.")

with open('frontend/src/data/sparesCompatibility.ts', 'w', encoding='utf-8') as f:
    f.write(content)
