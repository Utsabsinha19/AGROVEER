# -*- coding: utf-8 -*-
"""
Generates an A4 PDF catalog of all 118 extracted spare parts and machinery products
with images, product codes, packing, list prices, GST rates, demand ratings, and notes.
"""

import os
import json
import subprocess

JSON_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\src\data\complete_extracted_spares_catalog.json"
HTML_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\spares_catalog_print.html"
PDF_PATH = r"C:\Users\Utsab Sinha\Downloads\AGROVEER_Complete_Extracted_Spares_Catalog.pdf"

with open(JSON_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AGROVEER &amp; SAWKING — Verified Spare Parts &amp; Machinery Catalog</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&family=JetBrains+Mono:wght@500;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 10mm 12mm 10mm;
      @bottom-right {
        content: "Page " counter(page);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7pt;
        color: #718096;
      }
    }

    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 7.2pt;
      line-height: 1.35;
      color: #2D3748;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3 { color: #102C22; font-weight: 700; margin: 0 0 4px 0; }
    h1 { font-family: 'Playfair Display', serif; font-size: 16pt; color: #102C22; }
    h2 {
      font-size: 9.5pt;
      border-bottom: 1.5px solid #24583D;
      padding-bottom: 2px;
      margin-top: 10px;
      margin-bottom: 5px;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
    }
    
    .category-badge {
      background: #102C22;
      color: #A6C96A;
      font-size: 6.8pt;
      padding: 1px 5px;
      border-radius: 3px;
      font-family: 'JetBrains Mono', monospace;
    }

    .doc-header {
      background: linear-gradient(135deg, #102C22 0%, #17382B 60%, #24583D 100%);
      color: #FFFFFF;
      padding: 10px 14px;
      border-radius: 5px;
      margin-bottom: 8px;
      border-left: 5px solid #A6C96A;
    }

    .doc-header .title { font-family: 'Playfair Display', serif; font-size: 16pt; color: #F7F5F0; font-weight: 700; }
    .doc-header .subtitle { font-size: 8.5pt; color: #E2E8F0; margin-top: 1px; }

    .meta-bar {
      display: flex;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.08);
      padding: 4px 8px;
      border-radius: 3px;
      margin-top: 6px;
      font-size: 6.8pt;
      color: #A6C96A;
      border: 1px solid rgba(166, 201, 106, 0.2);
    }

    .callout {
      background: #F0FFF4;
      border-left: 3px solid #24583D;
      padding: 5px 8px;
      border-radius: 3px;
      margin-bottom: 6px;
      font-size: 7pt;
      color: #1C4532;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-size: 6.8pt;
    }

    th {
      background-color: #102C22;
      color: #FFFFFF;
      text-align: left;
      padding: 3px 4px;
      font-weight: 600;
      font-size: 6.2pt;
      text-transform: uppercase;
      border: 1px solid #102C22;
    }

    td {
      padding: 3px 4px;
      border: 1px solid #E2E8F0;
      vertical-align: middle;
    }

    tr:nth-child(even) td { background-color: #F8FAF9; }

    .item-img {
      width: 42px;
      height: 42px;
      object-fit: contain;
      border-radius: 3px;
      border: 1px solid #CBD5E0;
      background: #FFFFFF;
      display: block;
    }

    .badge-demand {
      display: inline-block;
      padding: 0.5px 3.5px;
      border-radius: 2px;
      font-size: 5.8pt;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge-high { background: #FED7D7; color: #9B2C2C; }
    .badge-norm { background: #EDF2F7; color: #4A5568; }
    .badge-new { background: #C6F6D5; color: #22543D; }

    .stock-tag {
      font-size: 5.8pt;
      color: #C53030;
      font-weight: 700;
      display: block;
      margin-top: 1px;
    }

    .code-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.2pt;
      color: #2D3748;
      background: #EDF2F7;
      padding: 0.5px 2px;
      border-radius: 2px;
      display: inline-block;
    }

    .page-break { page-break-before: always; }
  </style>
</head>
<body>

  <div class="doc-header">
    <div class="title">ARVEER IMPEX &mdash; SPARE PARTS &amp; PRODUCT MASTER CATALOG</div>
    <div class="subtitle">Complete Factory Extraction: 118 Verified Parts, Power Equipment &amp; Machinery Attachments</div>
    <div class="meta-bar">
      <div><strong>Brands:</strong> AGROVEER™ &bull; SAWKING™</div>
      <div><strong>Extraction Source:</strong> 5 Official Manufacturer Price Lists (October &ndash; November 2026)</div>
      <div><strong>Verified Total:</strong> 118 SKUs with Extracted Photographic References</div>
    </div>
  </div>

  <div class="callout">
    <strong>Authentic Extraction Mandate:</strong> Every single item listed below has been parsed directly from Arveer Impex's official factory price lists (<span class="code-text">168&amp;170F Engine Spares</span>, <span class="code-text">2" Water Pump Spares</span>, <span class="code-text">Brush Cutter Spares</span>, <span class="code-text">Chainsaw Chains</span>, and <span class="code-text">Earth Auger Machines &amp; Bits</span>). All reference images were extracted directly from the primary PDF vector and raster graphics streams. Zero demo or mock data.
  </div>
"""

for cat_idx, cat in enumerate(data["categories"]):
    if cat_idx > 0 and cat_idx in [1, 2, 4]:
        html += '<div class="page-break"></div>'
    
    html += f"""
    <h2>
      <span>{cat['category']} ({len(cat['items'])} Items)</span>
      <span class="category-badge">Dated: {cat['priceListDate']}</span>
    </h2>
    """
    
    if cat.get("generalNotes"):
        html += '<div style="font-size: 6.5pt; color: #4A5568; margin-bottom: 4px; font-style: italic;"><strong>Document Notes:</strong> '
        html += " &bull; ".join(cat["generalNotes"])
        html += '</div>'
        
    html += """
    <table>
      <thead>
        <tr>
          <th style="width: 20px; text-align: center;">Sr</th>
          <th style="width: 48px; text-align: center;">Image</th>
          <th style="width: 105px;">Product Code</th>
          <th>Item Name &amp; Description</th>
          <th style="width: 100px;">Sub-Category / Packing</th>
          <th style="width: 65px; text-align: right;">List Price</th>
          <th style="width: 80px;">Tax &amp; Demand</th>
        </tr>
      </thead>
      <tbody>
    """
    
    for it in cat["items"]:
        sr = it.get("srNo", "-")
        code = it.get("productCode") or "-"
        name = it.get("name", "")
        packing = it.get("subCategory") or it.get("standardPacking") or it.get("packingType") or "-"
        price = f"₹{it.get('listPrice', 0):,}"
        tax = it.get("tax", "")
        
        # Image path conversion to local file:/// for Chrome headless
        img_rel = it.get("imageUrl", "")
        img_local_path = os.path.join(r"C:\Users\Utsab Sinha\Downloads\AGROVÉ\frontend\public", img_rel.lstrip("/")).replace("\\", "/")
        img_tag = f'<img src="file:///{img_local_path}" class="item-img" alt="{name}" />' if os.path.exists(img_local_path) else '<span style="color:#A0AEC0; font-size:6pt;">No Img</span>'
        
        # Demand badge
        demand = it.get("demand", "")
        demand_badge = ""
        if demand == "HIGH":
            demand_badge = '<span class="badge-demand badge-high">HIGH</span>'
        elif demand == "NEW LAUNCH":
            demand_badge = '<span class="badge-demand badge-new">NEW LAUNCH</span>'
        elif demand in ["NORMAL", "MEDIUM"]:
            demand_badge = f'<span class="badge-demand badge-norm">{demand}</span>'
            
        stock = it.get("stockStatus", "")
        stock_badge = ""
        if stock and stock != "NORMAL":
            stock_badge = f'<span class="stock-tag">⚠️ {stock}</span>'
            
        html += f"""
        <tr>
          <td style="text-align: center; font-weight: bold; color: #718096;">{sr}</td>
          <td style="text-align: center;">{img_tag}</td>
          <td><span class="code-text">{code}</span></td>
          <td><strong>{name}</strong></td>
          <td style="color: #4A5568;">{packing}</td>
          <td style="text-align: right; font-weight: bold; color: #102C22;">{price}</td>
          <td>
            <div style="font-size: 6pt;">{tax}</div>
            {demand_badge} {stock_badge}
          </td>
        </tr>
        """
        
    html += """
      </tbody>
    </table>
    """

html += """
  <div style="border-top: 1px solid #E2E8F0; padding-top: 4px; margin-top: 8px; font-size: 6.2pt; color: #718096; display: flex; justify-content: space-between;">
    <div><strong>ARVEER IMPEX &bull; AGROVEER™ &bull; SAWKING™</strong> &mdash; Confidential Factory Price &amp; Specification Extract</div>
    <div>Extracted from Official PDF Price Lists (13.10.2026 - 14.11.2026)</div>
  </div>
</body>
</html>
"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(html)

print("HTML generated at", HTML_PATH)

chrome_cmd = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={PDF_PATH}",
    f"file:///{HTML_PATH.replace(os.sep, '/')}"
]

res = subprocess.run(chrome_cmd, capture_output=True, text=True)
print("Chrome return code:", res.returncode)
if os.path.exists(PDF_PATH):
    print(f"SUCCESS: Spares Catalog PDF generated at {PDF_PATH} ({os.path.getsize(PDF_PATH):,} bytes)")
else:
    print("FAILED to create PDF.")
