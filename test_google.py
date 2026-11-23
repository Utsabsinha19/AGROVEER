import requests
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

url = "https://www.google.com/search?tbm=isch&q=170F+engine+crankcase+cover"
resp = requests.get(url, headers=headers, timeout=10)
tbn_urls = re.findall(r'\"(https://encrypted-tbn0\.gstatic\.com/images\?q=[^\"]+?)\"', resp.text)
print("Found gstatic thumbnail URLs:", len(tbn_urls))
for u in tbn_urls[:5]:
    print(" -", u)
