import json
import urllib.request
import urllib.parse
import re

def search_image_urls(query, max_results=3):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    }
    encoded_query = urllib.parse.quote_plus(query)
    url = f"https://html.duckduckgo.com/html/?q={encoded_query}+product+white+background"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract links or images
            img_matches = re.findall(r'//external-content\.duckduckgo\.com/iu/\?u=(https?[^&"]+)', html)
            if not img_matches:
                # try alternative pattern
                img_matches = re.findall(r'src="(https?[^"]+\.(?:jpg|jpeg|png))"', html)
            decoded = [urllib.parse.unquote(m) for m in img_matches]
            return decoded[:max_results]
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        return []

if __name__ == '__main__':
    results = search_image_urls("170F engine spark plug")
    print("Results:", results)
