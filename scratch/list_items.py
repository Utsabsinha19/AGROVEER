import json

with open('frontend/src/data/complete_extracted_spares_catalog.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for c in data['categories']:
    print('========================================')
    print(c['category'], f"({len(c['items'])} items)")
    print('========================================')
    for item in c['items']:
        code = item.get('productCode', '')
        name = item.get('name', '')
        sub = item.get('subCategory', '')
        img = item.get('imageUrl', '')
        print(f"[{code}] {name} | Sub: {sub} | Img: {img}")
