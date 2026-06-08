import urllib.request
import re
import json
import time
import html

BASE = "https://pitomnik-kukushkin.kz"

# All plant pages found in the navigation submenu HTML
PAGES = {
    "хвойные": [
        ("Ель", "/page2887209.html"),
        ("Сосна", "/page2887231.html"),
        ("Пихта", "/page2887242.html"),
        ("Можжевельник", "/page2887253.html"),
        ("Тис", "/page2887261.html"),
        ("Тсуга", "/page2887269.html"),
        ("Туя", "/page2887278.html"),
        ("Платикладус", "/page2887286.html"),
        ("Псевдотсуга", "/page2887294.html"),
        ("Кипарисовик", "/page2887302.html"),
        ("Головчатотис", "/page2887310.html"),
        ("Гинкго", "/page2887318.html"),
    ],
    "лиственные": [
        ("Магнолия", "/page2887326.html"),
        ("Алыча", "/page2887334.html"),
        ("Береза", "/page2887342.html"),
        ("Боярышник", "/page2887350.html"),
        ("Вишня", "/page2887358.html"),
        ("Вяз", "/page2887366.html"),
        ("Дуб", "/page2887374.html"),
        ("Клен", "/page2887382.html"),
        ("Крушина", "/page2887655.html"),
        ("Лещина", "/page2887292.html"),
        ("Липа", "/page2887696.html"),
        ("Робиния", "/page2887468.html"),
        ("Сирень", "/page2887733.html"),
        ("Тополь", "/page2888019.html"),
        ("Церсис", "/page2887545.html"),
        ("Яблоня", "/page2887781.html"),
    ],
    "кустарники": [
        ("Барбарис", "/page2891826.html"),
        ("Гортензия", "/page2891882.html"),
        ("Вейгела", "/page2890693.html"),
        ("Дёрен", "/page2890717.html"),
        ("Диервилла", "/page2890727.html"),
        ("Кизил", "/page2890734.html"),
        ("Лаванда", "/page2890751.html"),
        ("Пион", "/page2890756.html"),
        ("Пузыреплодник", "/page2890813.html"),
        ("Самшит", "/page2890791.html"),
        ("Скумпия", "/page2890757.html"),
        ("Смородина", "/page2890764.html"),
        ("Спирея", "/page2891069.html"),
    ]
}

def extract_text(content):
    """Extract visible text and images from HTML"""
    # Get OG title
    og_title = re.findall(r'og:title" content="([^"]+)"', content)
    title = html.unescape(og_title[0]) if og_title else ""

    # Get description text - find t-text blocks, card descriptions, etc.
    # Extract text from common Tilda content fields
    texts = []
    
    # Find text in tn-atom text elements (main content)
    text_blocks = re.findall(r"field='tn_text_[^']+'>(.+?)(?:</div>|$)", content, re.DOTALL)
    for block in text_blocks:
        clean = re.sub(r'<[^>]+>', ' ', block)
        clean = html.unescape(clean).strip()
        clean = re.sub(r'\s+', ' ', clean).strip()
        if len(clean) > 20:
            texts.append(clean)

    # Find card content (t-card elements)
    card_names = re.findall(r't-card__title[^>]*>(.+?)</div>', content, re.DOTALL)
    card_descs = re.findall(r't-card__descr[^>]*>(.+?)</div>', content, re.DOTALL)
    
    varieties = []
    for name in card_names:
        clean = re.sub(r'<[^>]+>', '', name).strip()
        clean = html.unescape(clean).strip()
        if clean:
            varieties.append(clean)
    
    # Find images with data-original
    images = re.findall(r"data-original='(https://static\.tildacdn\.pro/[^']+)'", content)
    images += re.findall(r'data-original="(https://static\.tildacdn\.pro/[^"]+)"', content)
    images = list(set(images))
    # Filter out icons/logos
    images = [img for img in images if not any(x in img for x in ['logo', 'arrow', 'photo.ico', '1.png'])]
    
    return {
        "title": title,
        "texts": texts[:5],  # First 5 text blocks
        "varieties": varieties[:20],
        "images": images[:10]
    }

def fetch_page(name, url):
    full_url = BASE + url
    try:
        req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode('utf-8', errors='replace')
            data = extract_text(content)
            data['name'] = name
            data['url'] = full_url
            print(f"OK: {name} - {data['title']} - {len(data['images'])} images")
            return data
    except Exception as e:
        print(f"ERROR {name} ({full_url}): {e}")
        return {"name": name, "url": full_url, "error": str(e)}

result = {}
for category, plants in PAGES.items():
    result[category] = []
    for name, url in plants:
        data = fetch_page(name, url)
        result[category].append(data)
        time.sleep(0.3)

with open("d:\\pitomnik\\plants_data.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("\nDone! Saved to plants_data.json")
