"""Build the static site from tools/data and tools/templates.

Usage:  python3 tools/build.py

Writes index.html, journeys/, gallery/, decisions/ and assets/. Run tools/process_images.py first
whenever the exported PNGs change.
"""
import html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT + '/tools/data')
from journeys import JOURNEYS, TABS, SECTION_INFO
from decisions import DECISIONS, EDGE, NOT_DESIGNED, BUILD_ORDER

screens = json.load(open(ROOT + '/tools/data/screens.json'))
by_slug = {s['slug']: s for s in screens}
esc = html.escape


def tpl(name):
    return open(ROOT + '/tools/templates/' + name).read()


BASE = tpl('_base.css') + tpl('_nav.css')
NAVCSS = tpl('_nav.css')
RESET = '[hidden]{display:none!important}\nimg{max-width:100%}\n:root{color-scheme:light}\n'
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">')
BRAND = '<span class="brand"><b>[</b>The Prep Co.<b>]</b></span>'


def nav(cur):
    items = [('/', 'Home', 'home'), ('/journeys/', 'Journeys', 'journeys'), ('/gallery/', 'Screens', 'gallery'), ('/decisions/', 'Decisions', 'decisions')]
    links = ''
    for href, label, key in items:
        cur_attr = ' aria-current="page"' if key == cur else ''
        links += '<a href="%s"%s>%s</a>' % (href, cur_attr, label)
    return ('<nav class="sn" aria-label="Site"><a class="sn-brand" href="/"><b>[</b>The Prep Co.<b>]</b><span>Mockups</span></a>'
            '<div class="sn-links">%s</div></nav>' % links)


def write_page(page, template, desc, repl):
    t = tpl(template)
    title = re.search(r'<title>(.*?)</title>', t).group(1)
    style = re.search(r'<style>(.*?)</style>', t, re.S).group(1)
    sm = re.search(r'<script>(.*?)</script>', t, re.S)
    script = sm.group(1) if sm else ''
    markup = t[t.index('</style>') + len('</style>'): sm.start() if sm else len(t)]
    style = style.replace('%%BASE%%', BASE)
    if page in ('gallery', 'journeys'):
        style += '\n' + NAVCSS
        markup = markup.replace(BRAND, '')
        markup = markup.replace('<header class="top">', nav(page) + '\n  <header class="top">', 1)
    markup = markup.replace('%%NAV%%', nav(page))
    for k, v in repl.items():
        markup = markup.replace(k, v)
    os.makedirs(ROOT + '/assets', exist_ok=True)
    open('%s/assets/%s.css' % (ROOT, page), 'w').write(RESET + style.strip() + '\n')
    if script.strip():
        open('%s/assets/%s.js' % (ROOT, page), 'w').write(script.strip() + '\n')
    out = ROOT + ('/index.html' if page == 'home' else '/%s/index.html' % page)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    doc = ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
           '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
           '<title>%s</title><meta name="description" content="%s"><meta name="robots" content="noindex,nofollow">'
           '%s<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/%s.css"></head>\n<body>\n%s\n%s</body></html>\n'
           % (esc(title), esc(desc), FONTS, page, markup.strip(),
              '<script src="/assets/%s.js"></script>\n' % page if script.strip() else ''))
    open(out, 'w').write(doc)


# ---------------------------------------------------------------- gallery
def gcard(s):
    wide = ' wide' if s['code'] == 'Review' else ''
    tags = ''.join('<span class="tag">%s</span>' % esc(t) for t in s['tags'])
    label = '%s%s: %s' % (s['code'], ' mobile' if s['mobile'] else '', s['title'])
    alt = 'Mockup of %s%s' % (s['title'], ' on a phone' if s['mobile'] else '')
    sl = s['slug']
    return ('<figure class="card%s"><button class="shot" type="button" data-open data-full="/shared/img/%s.png" data-thumb="/shared/thumb/%s.jpg" data-w="%d" data-label="%s" aria-label="Open %s full size">'
            '<img src="/shared/thumb/%s.jpg" width="%d" height="%d" alt="%s" loading="lazy" decoding="async"></button>'
            '<figcaption><span class="code">%s</span><span class="ttl">%s</span>%s</figcaption></figure>'
            % (wide, sl, sl, s['cssw'], esc(label), esc(label), sl, s['tw'], s['th'], esc(alt), esc(s['code']), esc(s['title']), tags))


G_SECTIONS = [
    ('overview', 'Overview', 'Cover with the theme, and the product review that lists coverage, edge cases and open decisions.'),
    ('student', 'Student', 'From sign-up and the free session to the CV Builder, answer bank, sessions and billing.'),
    ('panelist', 'Panelist', 'How a working practitioner applies, reads a brief, scores a panel and sets availability.'),
    ('admin', 'Admin / ops', 'The console that keeps a cohort moving: seats, students, assignment, bookings and the ledger.'),
    ('edge', 'Edge cases and states', 'What happens when a payment fails, a panelist cancels, a seat is gone or a date moves.'),
]
G_TAB = {'overview': 'Overview', 'student': 'Student', 'panelist': 'Panelist', 'admin': 'Admin / ops', 'edge': 'Edge cases'}
gbody = []
for key, name, blurb in G_SECTIONS:
    its = [s for s in screens if s['section'] == key]
    desk = [s for s in its if not s['mobile']]
    mob = [s for s in its if s['mobile']]
    out = ['<section class="sec" id="%s" data-section="%s"><div class="sechead"><h2>%s</h2><p>%s</p></div>' % (key, key, esc(name), esc(blurb))]
    if desk:
        if mob:
            out.append('<h3 class="grp">Desktop <span>%d screens</span></h3>' % len(desk))
        out.append('<div class="grid">' + ''.join(gcard(s) for s in desk) + '</div>')
    if mob:
        out.append('<h3 class="grp">Mobile <span>%d screens</span></h3>' % len(mob))
        out.append('<div class="grid mgrid">' + ''.join(gcard(s) for s in mob) + '</div>')
    out.append('</section>')
    gbody.append(''.join(out))
gtabs = '<button class="tab" type="button" data-tab="all" aria-pressed="true">All <span>%d</span></button>' % len(screens)
for key, _, _ in G_SECTIONS:
    n = len([s for s in screens if s['section'] == key])
    gtabs += '<button class="tab" type="button" data-tab="%s" aria-pressed="false">%s <span>%d</span></button>' % (key, G_TAB[key], n)
n_mobile = len([s for s in screens if s['mobile']])
write_page('gallery', 'gallery.html', 'Every Prep Co app mockup at full size, grouped by role.',
           {'%%TABS%%': gtabs, '%%BODY%%': '\n'.join(gbody), '%%TOTAL%%': str(len(screens)), '%%MOBILE%%': str(n_mobile)})

# ---------------------------------------------------------------- journeys
ROLE_NAME = {'student': 'Student', 'panelist': 'Panelist', 'admin': 'Admin', 'web': 'Outside the app'}


def role_of(code):
    if code is None:
        return 'web'
    return {'s': 'student', 'e': 'student', 'p': 'panelist', 'a': 'admin'}[code[0]]


def code_label(slug):
    base = by_slug[slug.replace('-mobile', '')]
    return base['code'] + (' · mobile' if slug.endswith('-mobile') else '')


jbody, total_steps = [], 0
for tab, _ in TABS:
    if tab == 'all':
        continue
    sname, sblurb = SECTION_INFO[tab]
    out = ['<section class="sec" data-section="%s"><div class="sechead"><h2>%s</h2><p>%s</p></div>' % (tab, esc(sname), esc(sblurb))]
    for j in [j for j in JOURNEYS if j['tab'] == tab]:
        roles = []
        for s in j['steps']:
            r = role_of(s['code'])
            if r != 'web' and r not in roles:
                roles.append(r)
        chips = ''.join('<span class="role %s">%s</span>' % (r, ROLE_NAME[r]) for r in roles)
        out.append('<article class="journey" id="%s"><div class="jhead"><div class="jtitle"><h3>%s</h3>%s<span class="jcount">%d steps</span></div>'
                   '<div class="jmeta"><p><b>Starts</b> %s</p><p><b>Ends</b> %s</p></div></div><ol class="steps">'
                   % (j['id'], esc(j['title']), chips, len(j['steps']), esc(j['starts']), esc(j['ends'])))
        for n, s in enumerate(j['steps'], 1):
            total_steps += 1
            code = s['code']
            r = role_of(code)
            tag = '<span class="tag">%s</span>' % esc(s['tag']) if s.get('tag') else ''
            if code:
                sc = by_slug[code]
                mobile = sc['mobile']
                label = '%s: %s' % (code_label(code), s['title'])
                chip = '<span class="code">%s</span>' % esc(code_label(code))
                alt = 'Mockup: %s%s' % (sc['title'], ' on a phone' if mobile else '')
                fig = ('<button class="shot%s" type="button" data-open data-j="%s" data-step="%d" data-total="%d" data-full="/shared/img/%s.png" data-thumb="/shared/thumb/%s.jpg" data-w="%d" '
                       'data-label="%s" aria-label="Open step %d, %s, full size"><img src="/shared/thumb/%s.jpg" width="%d" height="%d" alt="%s" loading="lazy" decoding="async"></button>'
                       % (' m' if mobile else '', j['id'], n, len(j['steps']), code, code, sc['cssw'], esc('Step %d, %s' % (n, label)), n, esc(label), code, sc['tw'], sc['th'], esc(alt)))
            else:
                chip = ''
                fig = '<div class="nofig"><div><b>%s</b>No mockup, this step happens outside the app</div></div>' % esc(s['kind'])
            br = ''
            if s.get('branch'):
                bid, blabel = s['branch']
                br = '<p class="branch">If this goes differently: <a href="#%s" data-jump="%s">%s</a></p>' % (bid, bid, esc(blabel))
            out.append('<li class="step"><div class="rail"><span class="num %s">%d</span></div><div class="body">%s<div class="txt"><div class="row"><span class="role %s">%s</span>%s%s</div><h4>%s</h4><p>%s</p>%s</div></div></li>'
                       % (r, n, fig, r, ROLE_NAME[r], chip, tag, esc(s['title']), esc(s['note']), br))
        out.append('</ol></article>')
    out.append('</section>')
    jbody.append(''.join(out))

jindex = []
for tab, _ in TABS:
    if tab == 'all':
        continue
    links = ''.join('<a class="ilink" href="#%s" data-jump="%s"><b>%s</b><span>%d steps</span></a>' % (j['id'], j['id'], esc(j['title']), len(j['steps'])) for j in JOURNEYS if j['tab'] == tab)
    jindex.append('<div class="igroup"><h3>%s</h3><div class="ilist">%s</div></div>' % (esc(SECTION_INFO[tab][0]), links))
jtabs = '<button class="tab" type="button" data-tab="all" aria-pressed="true">All <span>%d</span></button>' % len(JOURNEYS)
jtabs += ''.join('<button class="tab" type="button" data-tab="%s" aria-pressed="false">%s <span>%d</span></button>' % (k, esc(n), len([j for j in JOURNEYS if j['tab'] == k])) for k, n in TABS if k != 'all')
n_edge = len([j for j in JOURNEYS if j['tab'] == 'edge'])

# journeys.html carries the old gallery link; point it at this site
jt_path = ROOT + '/tools/templates/journeys.html'
jt = open(jt_path).read()
jt = jt.replace('<a href="https://claude.ai/artifact/R3q3K5g5vQJktE1ugf9oRh" target="_blank" rel="noopener">mockup gallery</a>', '<a href="/gallery/">mockup gallery</a>')
open(jt_path, 'w').write(jt)

write_page('journeys', 'journeys.html', 'Every user journey through the Prep Co app as numbered sequences of the actual mockups.',
           {'%%INDEX%%': '\n'.join(jindex), '%%TABS%%': jtabs, '%%BODY%%': '\n'.join(jbody), '%%J%%': str(len(JOURNEYS)), '%%S%%': str(total_steps), '%%E%%': str(n_edge)})

# ---------------------------------------------------------------- decisions
dec = []
for i, d in enumerate(DECISIONS, 1):
    codes = ''.join('<span class="code">%s</span>' % esc(c) for c in d['screens'])
    dec.append('<li class="dec"><span class="n">%d</span><div class="body"><h3>%s</h3><p class="prop"><b>Assumed in the mockups:</b> %s</p>'
               '<div class="meta"><span>Shows on</span>%s<a href="/journeys/#%s">See the journey</a></div></div></li>'
               % (i, esc(d['q']), esc(d['proposal']), codes, d['journey']))
edge = []
for group, cases in EDGE:
    rows = ''
    for prio, text, jid in cases:
        state = ('<span class="state ok"><a href="/journeys/#%s">Designed</a></span>' % jid) if jid else '<span class="state no">Not designed yet</span>'
        rows += '<div class="case"><span class="prio %s">%s</span><p>%s</p>%s</div>' % (prio.lower(), prio, esc(text), state)
    edge.append('<div class="grp"><h3>%s</h3>%s</div>' % (esc(group), rows))
todo = '\n'.join('<li>%s</li>' % esc(t) for t in NOT_DESIGNED)
order = '\n'.join('<div class="step"><b>%s</b><p>%s</p></div>' % (esc(a), esc(b)) for a, b in BUILD_ORDER)
write_page('decisions', 'decisions.html', 'Open product decisions, edge cases and what is not designed yet for the Prep Co app.',
           {'%%DECISIONS%%': '\n'.join(dec), '%%EDGE%%': '\n'.join(edge), '%%TODO%%': todo, '%%ORDER%%': order, '%%D%%': str(len(DECISIONS))})

# ---------------------------------------------------------------- home
STRIP = [('s05', 'Student home'), ('s08', 'Answer bank'), ('p03', 'Pre-panel brief'), ('a01', 'Cohort overview')]
strip = ''
for sl, cap in STRIP:
    s = by_slug[sl]
    strip += '<a href="/gallery/"><img src="/shared/thumb/%s.jpg" width="%d" height="%d" alt="Mockup of %s" loading="lazy" decoding="async"><span>%s</span></a>' % (sl, s['tw'], s['th'], esc(s['title']), esc(cap))
write_page('home', 'home.html', 'Mockups for The Prep Co app: journey maps, every screen and the open decisions.',
           {'%%STRIP%%': strip, '%%TOTAL%%': str(len(screens)), '%%J%%': str(len(JOURNEYS)), '%%D%%': str(len(DECISIONS))})

print('built: %d screens, %d journeys, %d steps, %d decisions' % (len(screens), len(JOURNEYS), total_steps, len(DECISIONS)))
