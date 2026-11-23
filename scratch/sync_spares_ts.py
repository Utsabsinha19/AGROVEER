import json
import re

CATALOG_PATH = "frontend/src/data/complete_extracted_spares_catalog.json"
SPARES_COMPAT_PATH = "frontend/src/data/sparesCompatibility.ts"

with open(CATALOG_PATH, "r", encoding="utf-8") as f:
    catalog = json.load(f)

# Build a lookup of productCode -> image
code_to_img = {}
code_to_name = {}
for cat in catalog["categories"]:
    for item in cat["items"]:
        code = item["productCode"].strip()
        code_to_img[code] = item["imageUrl"]
        code_to_name[code] = item["name"]

with open(SPARES_COMPAT_PATH, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Replace images in COMPATIBLE_SPARES array
# Each spare has "sku": "...", ..., "image": "..."
def replace_spare_image(match):
    full_block = match.group(0)
    sku_match = re.search(r'"sku":\s*"([^"]+)"', full_block)
    if sku_match:
        sku = sku_match.group(1).strip()
        if sku in code_to_img:
            new_img = code_to_img[sku]
            # Replace the "image": "..." in this block
            replaced_block = re.sub(r'"image":\s*"[^"]+"', f'"image": "{new_img}"', full_block)
            return replaced_block
    return full_block

# Split into individual spare objects or use regex on the object blocks
# In sparesCompatibility.ts, each object starts with { "id": "sp-... and ends with }
pattern = re.compile(r'\{\s*"id":\s*"sp-[^}]+\}', re.DOTALL)
updated_ts = pattern.sub(replace_spare_image, ts_content)

with open(SPARES_COMPAT_PATH, "w", encoding="utf-8") as f:
    f.write(updated_ts)

print("Updated sparesCompatibility.ts successfully with online high-res images!")
