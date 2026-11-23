import requests
from bs4 import BeautifulSoup
import json
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

def search_yahoo_images(query):
    url = f"https://images.search.yahoo.com/search/images?p={requests.utils.quote(query)}"
    resp = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(resp.text, 'html.parser')
    results = []
    for li in soup.find_all('li', {'data-ld': True}):
        try:
            data = json.loads(li['data-ld'])
            img_url = data.get('iurl')
            title = data.get('tit')
            if img_url and img_url.startswith('http'):
                results.append((img_url, title))
        except Exception:
            continue
    return results

for q in ["170F engine crankcase cover", "170F intake exhaust valve", "2 inch water pump impeller"]:
    res = search_yahoo_images(q)
    print(f"Query: '{q}' -> {len(res)} results")
    for img_url, title in res[:3]:
        print(f"  [{title[:40]}] -> {img_url}")
