"""Turn a folder of exported Claude Design PNGs into the site's images and screen manifest.

Usage:  python3 tools/process_images.py path/to/png-export-folder

Reads tools/data/canvas.json (board order and titles), writes shared/img/*.png,
shared/thumb/*.jpg and tools/data/screens.json.
"""
import glob, json, os, re, shutil, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = sys.argv[1] if len(sys.argv) > 1 else None
if not src or not os.path.isdir(src):
    sys.exit(__doc__)

canvas = json.load(open(ROOT + '/tools/data/canvas.json'))

pngs = {}
for p in glob.glob(src + '/*.png'):
    stem = os.path.basename(p)[:-4]
    code, rest = stem.split(' · ', 1)
    pngs[(code, rest == 'mobile')] = p

SPECIAL = {'Main.dc.html': ('Cover', 'Theme & components', ('Cover', False)),
           'PO-Review.dc.html': ('Review', 'Coverage, edge cases & decisions', ('Product review', False))}


def slug(code, mobile):
    m = re.match(r'^([A-Z])(\d+)$', code)
    s = (m.group(1).lower() + m.group(2).zfill(2)) if m else re.sub(r'[^a-z0-9]+', '-', code.lower()).strip('-')
    return s + ('-mobile' if mobile else '')


def clean(title):
    tags = []

    def repl(m):
        t = m.group(1).lower()
        if 'proposed' in t:
            tags.append('Proposed'); return ''
        if 'sample data' in t:
            tags.append('Sample data'); return ''
        if t.startswith('tweak'):
            return ''
        return m.group(0)
    return re.sub(r'\s*\(([^)]*)\)', repl, title).strip(), tags


def section(code):
    if code in ('Cover', 'Review'):
        return 'overview'
    return {'S': 'student', 'P': 'panelist', 'A': 'admin', 'E': 'edge'}[code[0]]


shutil.rmtree(ROOT + '/shared', ignore_errors=True)
os.makedirs(ROOT + '/shared/img'); os.makedirs(ROOT + '/shared/thumb')

items, desk = [], {}
for fn in canvas['order']:
    b = canvas['boards'][fn]
    if fn in SPECIAL:
        code, title, key = SPECIAL[fn]; mobile = False; tags = []
    else:
        code, rest = b['title'].split(' · ', 1)
        mobile = rest == 'mobile'; key = (code, mobile)
        title, tags = ('', []) if mobile else clean(rest)
    if not mobile:
        desk[code] = (title, tags)
    items.append(dict(code=code, mobile=mobile, key=key, title=title, tags=tags))

out = []
for it in items:
    if it['mobile']:
        it['title'], it['tags'] = desk[it['code']]
    sl = slug(it['code'], it['mobile'])
    im = Image.open(pngs[it['key']])
    pw, ph = im.size
    shutil.copy(pngs[it['key']], f'{ROOT}/shared/img/{sl}.png')
    tw = 480 if it['mobile'] else 1000
    th = round(ph * tw / pw)
    im.convert('RGB').resize((tw, th), Image.LANCZOS).save(f'{ROOT}/shared/thumb/{sl}.jpg', 'JPEG', quality=84, optimize=True)
    out.append(dict(slug=sl, code=it['code'], mobile=it['mobile'], title=it['title'], tags=it['tags'],
                    section=section(it['code']), cssw=pw // 2, tw=tw, th=th))

json.dump(out, open(ROOT + '/tools/data/screens.json', 'w'), indent=1)
print(len(out), 'screens written')
