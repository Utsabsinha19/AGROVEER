import urllib.request
import urllib.parse
import json
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Referer': 'https://duckduckgo.com/'
}

url = f"https://duckduckgo.com/?q=170F+crankcase+cover&t=h_&iax=images&ia=images"
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=10) as resp:
    content = resp.read().decode('utf-8', errors='ignore')
    match = re.search(r'vqd=([\d-]+)&', content) or re.search(r'vqd=\"([\d-]+)\"', content) or re.search(r'vqd=([a-zA-Z0-9_-]+)', content)
    vqd = match.group(1) if match else None
    print("VQD:", vqd)

if vqd:
    i_url = f"https://duckduckgo.com/i.js?l=us-en&o=json&q=170F+crankcase+cover&vqd={vqd}&f=,,,&p=1"
    req2 = urllib.request.Request(i_url, headers=headers)
    with urllib.request.urlopen(req2, timeout=10) as resp2:
        raw = resp2.read().decode('utf-8', errors='ignore')
        print("Raw response:", raw[:300])
