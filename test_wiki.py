import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'Mozilla/5.0'}

def search_wikimedia(query):
    endpoint = "https://commons.wikimedia.org/w/api.php"
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrsearch': query,
        'gsrnamespace': 6,
        'gsrlimit': 5,
        'prop': 'imageinfo',
        'iiprop': 'url|size|mime',
        'format': 'json'
    }
    url = f"{endpoint}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, pdata in pages.items():
                title = pdata.get('title', '')
                infos = pdata.get('imageinfo', [])
                if infos and any(infos[0].get('url', '').lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    results.append((title, infos[0].get('url'), infos[0].get('width'), infos[0].get('height')))
            return results
    except Exception as e:
        print(f"Error: {e}")
        return []

terms = ["piston", "carburetor", "flywheel", "crankshaft", "camshaft", "valve engine", "recoil starter", "water pump impeller", "chainsaw chain", "drill bit auger", "rotary tiller blade"]
for t in terms:
    res = search_wikimedia(t)
    print(f"Term '{t}': {len(res)} results")
    if res:
        print("  Top result:", res[0][0], "->", res[0][1][:80])
