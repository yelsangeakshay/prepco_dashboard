// Turns a folder of exported Claude Design PNGs into the site's images and screen manifest.
//
//   npm run images -- path/to/png-export-folder
//
// Reads scripts/canvas.json (board order and titles), writes public/shared/img/*.png,
// public/shared/thumb/*.jpg and src/data/screens.json.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const src = process.argv[2]
if (!src || !fs.existsSync(src)) {
  console.error('Usage: npm run images -- <folder of exported PNGs>')
  process.exit(1)
}
const root = path.resolve(import.meta.dirname, '..')
const canvas = JSON.parse(fs.readFileSync(path.join(root, 'scripts/canvas.json'), 'utf8'))

// Exported files are named "<code> · <title>.png"; the key is the code plus whether it is the phone layout.
const pngs = new Map()
for (const f of fs.readdirSync(src)) {
  if (!f.endsWith('.png')) continue
  const stem = f.slice(0, -4)
  const i = stem.indexOf(' · ')
  pngs.set(`${stem.slice(0, i)}|${stem.slice(i + 3) === 'mobile'}`, path.join(src, f))
}

const SPECIAL = {
  'Main.dc.html': ['Cover', 'Theme & components', 'Cover'],
  'PO-Review.dc.html': ['Review', 'Coverage, edge cases & decisions', 'Product review'],
}

function slug(code, mobile) {
  const m = /^([A-Z])(\d+)$/.exec(code)
  const s = m ? m[1].toLowerCase() + m[2].padStart(2, '0') : code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return s + (mobile ? '-mobile' : '')
}

function clean(title) {
  const tags = []
  const out = title
    .replace(/\s*\(([^)]*)\)/g, (match, g) => {
      const l = g.toLowerCase()
      if (l.includes('proposed')) { tags.push('Proposed'); return '' }
      if (l.includes('sample data')) { tags.push('Sample data'); return '' }
      if (l.startsWith('tweak')) return ''
      return match
    })
    .trim()
  return [out, tags]
}

const section = (code) =>
  code === 'Cover' || code === 'Review' ? 'overview' : { S: 'student', P: 'panelist', A: 'admin', E: 'edge' }[code[0]]

const items = []
const desk = {}
for (const fn of canvas.order) {
  const b = canvas.boards[fn]
  let code, title, key, mobile = false, tags = []
  if (SPECIAL[fn]) {
    ;[code, title, key] = SPECIAL[fn]
  } else {
    const i = b.title.indexOf(' · ')
    code = b.title.slice(0, i)
    const rest = b.title.slice(i + 3)
    mobile = rest === 'mobile'
    key = code
    title = ''
    if (!mobile) [title, tags] = clean(rest)
  }
  if (!mobile) desk[code] = [title, tags]
  items.push({ code, mobile, key, title, tags })
}

fs.rmSync(path.join(root, 'public/shared'), { recursive: true, force: true })
fs.mkdirSync(path.join(root, 'public/shared/img'), { recursive: true })
fs.mkdirSync(path.join(root, 'public/shared/thumb'), { recursive: true })

const out = []
for (const it of items) {
  if (it.mobile) [it.title, it.tags] = desk[it.code]
  const file = pngs.get(`${it.key}|${it.mobile}`)
  if (!file) throw new Error(`No exported PNG found for ${it.code}${it.mobile ? ' (mobile)' : ''}`)
  const sl = slug(it.code, it.mobile)
  const { width: pw, height: ph } = await sharp(file).metadata()
  fs.copyFileSync(file, path.join(root, `public/shared/img/${sl}.png`))
  const tw = it.mobile ? 480 : 1000
  const th = Math.round((ph * tw) / pw)
  await sharp(file)
    .resize(tw, th)
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(root, `public/shared/thumb/${sl}.jpg`))
  out.push({ slug: sl, code: it.code, mobile: it.mobile, title: it.title, tags: it.tags, section: section(it.code), cssw: Math.floor(pw / 2), tw, th })
}

fs.writeFileSync(path.join(root, 'src/data/screens.json'), JSON.stringify(out, null, 1) + '\n')
console.log(`${out.length} screens written`)
