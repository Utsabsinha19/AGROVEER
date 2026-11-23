import urllib.request
import urllib.parse
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

def check_domains(query):
    url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}&form=HDRSC2&first=1"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'murl&quot;:&quot;(https?://[^&]+)&quot;', html)
        print(f"Query: '{query}' -> {len(matches)} matches")
        for m in matches[:3]:
            print("  -", m)

check_domains("170F engine crankcase cover")
check_domains("170F engine intake and exhaust valve")
check_domains("2 inch water pump impeller")
