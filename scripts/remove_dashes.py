# -*- coding: utf-8 -*-
with open(r'c:\Users\PramudithaN\Documents\antigravity\lively-babbage\scripts\build_site.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace specific titles and descriptions
text = text.replace('<title>merci — Earthy Elegance & Timeless Silhouettes | Sri Lanka</title>', '<title>merci | Earthy Elegance & Timeless Silhouettes | Sri Lanka</title>')
text = text.replace('content="merci (merci.clothing_) — Understated', 'content="merci (merci.clothing_) : Understated')

text = text.replace('alt="merci — Olive Green Balloon Sleeve Top"', 'alt="merci : Olive Green Balloon Sleeve Top"')
text = text.replace('"LET\'S PACK ORDERS" — PACKAGING', '"LET\'S PACK ORDERS" : PACKAGING')

text = text.replace('2–4 business days', '2 to 4 business days')
text = text.replace('1–2 business days', '1 to 2 business days')

text = text.replace('Signature Linen — Soft Sage', 'Signature Linen: Soft Sage')
text = text.replace('Pure Linen — Charcoal Blue', 'Pure Linen: Charcoal Blue')
text = text.replace('Signature Linen Wide-Leg Pant — Soft Sage', 'Signature Linen Wide-Leg Pant: Soft Sage')
text = text.replace('Signature Linen Wide-Leg Pant — Charcoal Blue', 'Signature Linen Wide-Leg Pant: Charcoal Blue')
text = text.replace('Terra Muse Halter Neck Top — Pure Chalk', 'Terra Muse Halter Neck Top: Pure Chalk')
text = text.replace('High-Waisted Flared Linen Skirt — Earth Clay', 'High-Waisted Flared Linen Skirt: Earth Clay')
text = text.replace('Textured Strapless Bandeau Top — Raw Sand', 'Textured Strapless Bandeau Top: Raw Sand')
text = text.replace('Pure Linen Relaxed Trouser — Warm Oat', 'Pure Linen Relaxed Trouser: Warm Oat')

# Replace any other em and en dashes
text = text.replace('—', ': ')
text = text.replace('–', '-')

# Clean up any accidental double spaces or ": :"
text = text.replace(': :', ':')

# Add merci Favicon
favicon_tag = '''
  <!-- merci Favicon (SVG and Apple Touch Icon) -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%231E1A18'/%3E%3Ctext x='50' y='63' font-family='Bodoni Moda, Playfair Display, Didot, Georgia, serif' font-size='33' font-weight='600' fill='%23FAF7F2' text-anchor='middle' letter-spacing='0.5'%3Emerci%3C/text%3E%3C/svg%3E">
  <link rel="apple-touch-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%231E1A18'/%3E%3Ctext x='50' y='63' font-family='Bodoni Moda, Playfair Display, Didot, Georgia, serif' font-size='33' font-weight='600' fill='%23FAF7F2' text-anchor='middle' letter-spacing='0.5'%3Emerci%3C/text%3E%3C/svg%3E">
'''

if 'rel="icon"' not in text:
    target_meta = '<meta name="description" content="merci (merci.clothing_) : Understated sophistication through timeless silhouettes and effortless craftsmanship. Pure linen basics, Terra Muse collection, and natural fiber essentials.">'
    text = text.replace(target_meta, target_meta + '\n' + favicon_tag)

with open(r'c:\Users\PramudithaN\Documents\antigravity\lively-babbage\scripts\build_site.py', 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Remaining em-dashes: {text.count('—')}, en-dashes: {text.count('–')}")
print("build_site.py processed.")
