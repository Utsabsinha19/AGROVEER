import json

with open('frontend/src/data/complete_extracted_spares_catalog.json', encoding='utf-8') as f:
    cat = json.load(f)

for c in cat['categories']:
    print(f"=== {c['category']} ({len(c['items'])} items) ===")
    for it in c['items']:
        print(f"  [{it['productCode']}] {it['name']} -> {it.get('subCategory')}")
