import urllib.request
import urllib.parse
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

def search_bing_images(query, count=3):
    url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}&form=HDRSC2&first=1"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Bing embeds image URLs in m="{...&quot;murl&quot;:&quot;URL&quot;...}"
            matches = re.findall(r'murl&quot;:&quot;(https?://[^&]+)&quot;', html)
            if not matches:
                # alternative pattern
                matches = re.findall(r'&quot;murl&quot;:&quot;(http[^&]+)&quot;', html)
            return matches[:count]
    except Exception as e:
        print(f"Error fetching Bing images for '{query}': {e}")
        return []

urls = search_bing_images("170F petrol engine crankcase cover")
print("Bing Image URLs found:", urls)
