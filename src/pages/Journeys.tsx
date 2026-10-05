import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lightbox } from '../components/Lightbox'
import type { LightboxItem } from '../components/Lightbox'
import { SiteNav } from '../components/SiteNav'
import { JOURNEYS, JOURNEY_TABS, SECTION_INFO } from '../data/journeys'
import { BY_SLUG, fullPath, thumbPath } from '../data/screens'
import type { Journey, JourneyTab } from '../data/types'
import { useHashTab, useTitle } from '../lib/hooks'
import '../styles/journeys.css'

type Role = 'student' | 'panelist' | 'admin' | 'web'
const ROLE_NAME: Record<Role, string> = {
  student: 'Student',
  panelist: 'Panelist',
  admin: 'Admin',
  web: 'Outside the app',
}

function roleOf(code: string | null): Role {
  if (!code) return 'web'
  const c = code[0]
  if (c === 'p') return 'panelist'
  if (c === 'a') return 'admin'
  return 'student'
}

function codeLabel(slug: string) {
  const base = BY_SLUG[slug.replace('-mobile', '')]
  return base.code + (slug.endsWith('-mobile') ? ' · mobile' : '')
}

const TAB_KEYS = ['all', 'student', 'edge', 'panelist', 'admin', 'cross'] as const
type Tab = (typeof TAB_KEYS)[number]
const SECTION_ORDER: JourneyTab[] = ['student', 'edge', 'panelist', 'admin', 'cross']

function journeyRoles(j: Journey): Role[] {
  const roles: Role[] = []
  for (const s of j.steps) {
    const r = roleOf(s.code)
    if (r !== 'web' && !roles.includes(r)) roles.push(r)
  }
  return roles
}

function lightboxItems(j: Journey): LightboxItem[] {
  const out: LightboxItem[] = []
  j.steps.forEach((s, i) => {
    if (!s.code) return
    const sc = BY_SLUG[s.code]
    out.push({
      full: fullPath(s.code),
      thumb: thumbPath(s.code),
      width: sc.cssw,
      label: `Step ${i + 1}, ${codeLabel(s.code)}: ${s.title}`,
      count: `Step ${i + 1} of ${j.steps.length}`,
    })
  })
  return out
}

export default function Journeys() {
  useTitle('Prep Co Journey Maps')
  const [tab, setTab] = useHashTab<Tab>(TAB_KEYS, 'all')
  const [open, setOpen] = useState<{ id: string; index: number } | null>(null)

  const totalSteps = JOURNEYS.reduce((n, j) => n + j.steps.length, 0)
  const edgeCount = JOURNEYS.filter((j) => j.tab === 'edge').length
  const boxes = useMemo(() => Object.fromEntries(JOURNEYS.map((j) => [j.id, lightboxItems(j)])), [])
  const openItems = open ? boxes[open.id] : []

  return (
    <div className="pg-journeys">
      <div className="wrap">
        <SiteNav />
        <header className="top">
          <div style={{ display: 'grid', gap: 12 }}>
            <p className="eyebrow">Journey maps · version 1</p>
            <h1>Every path through the Prep Co app</h1>
            <p className="lede">
              Each journey is a numbered sequence of the actual mockups, from the first click to the last. Tap a screen
              to open it full size and step through the journey with the arrow keys or a swipe.
            </p>
          </div>
          <div className="stats" aria-label="Contents">
            <div className="stat">
              <b>{JOURNEYS.length}</b>
              <span>journeys</span>
            </div>
            <div className="stat">
              <b>{totalSteps}</b>
              <span>steps</span>
            </div>
            <div className="stat">
              <b>3</b>
              <span>roles</span>
            </div>
            <div className="stat">
              <b>{edgeCount}</b>
              <span>edge cases</span>
            </div>
          </div>
          <p className="legend">
            <span>
              <span className="role student">Student</span>
              <span className="role panelist">Panelist</span>
              <span className="role admin">Admin</span>
              <span className="role web">Outside the app</span>
            </span>
            <span>
              <span className="tag">Proposed</span> a policy or step the website does not state yet
            </span>
          </p>
        </header>

        <section className="index" aria-label="All journeys">
          <h2>Jump to a journey</h2>
          {SECTION_ORDER.map((key) => (
            <div className="igroup" key={key}>
              <h3>{SECTION_INFO[key].name}</h3>
              <div className="ilist">
                {JOURNEYS.filter((j) => j.tab === key).map((j) => (
                  <Link className="ilink" key={j.id} to={{ hash: j.id }}>
                    <b>{j.title}</b>
                    <span>{j.steps.length} steps</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        <nav className="bar" aria-label="Sections">
          <div className="tabs">
            {JOURNEY_TABS.map(({ key, label }) => (
              <button
                key={key}
                className="tab"
                type="button"
                aria-pressed={tab === key}
                onClick={() => setTab(key as Tab)}
              >
                {label} <span>{key === 'all' ? JOURNEYS.length : JOURNEYS.filter((j) => j.tab === key).length}</span>
              </button>
            ))}
          </div>
        </nav>

        <main>
          {SECTION_ORDER.filter((key) => tab === 'all' || tab === key).map((key) => (
            <section className="sec" key={key}>
              <div className="sechead">
                <h2>{SECTION_INFO[key].name}</h2>
                <p>{SECTION_INFO[key].blurb}</p>
              </div>
              {JOURNEYS.filter((j) => j.tab === key).map((j) => {
                let shown = -1
                return (
                  <article className="journey" id={j.id} key={j.id}>
                    <div className="jhead">
                      <div className="jtitle">
                        <h3>{j.title}</h3>
                        {journeyRoles(j).map((r) => (
                          <span key={r} className={`role ${r}`}>
                            {ROLE_NAME[r]}
                          </span>
                        ))}
                        <span className="jcount">{j.steps.length} steps</span>
                      </div>
                      <div className="jmeta">
                        <p>
                          <b>Starts</b> {j.starts}
                        </p>
                        <p>
                          <b>Ends</b> {j.ends}
                        </p>
                      </div>
                    </div>
                    <ol className="steps">
                      {j.steps.map((s, i) => {
                        const r = roleOf(s.code)
                        const sc = s.code ? BY_SLUG[s.code] : null
                        if (s.code) shown += 1
                        const boxIndex = shown
                        const label = s.code ? `${codeLabel(s.code)}: ${s.title}` : ''
                        return (
                          <li className="step" key={i}>
                            <div className="rail">
                              <span className={`num ${r}`}>{i + 1}</span>
                            </div>
                            <div className="body">
                              {s.code && sc ? (
                                <button
                                  className={`shot${sc.mobile ? ' m' : ''}`}
                                  type="button"
                                  aria-label={`Open step ${i + 1}, ${label}, full size`}
                                  onClick={() => setOpen({ id: j.id, index: boxIndex })}
                                >
                                  <img
                                    src={thumbPath(s.code)}
                                    width={sc.tw}
                                    height={sc.th}
                                    alt={`Mockup: ${sc.title}${sc.mobile ? ' on a phone' : ''}`}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                </button>
                              ) : (
                                <div className="nofig">
                                  <div>
                                    <b>{s.kind}</b>No mockup, this step happens outside the app
                                  </div>
                                </div>
                              )}
                              <div className="txt">
                                <div className="row">
                                  <span className={`role ${r}`}>{ROLE_NAME[r]}</span>
                                  {s.code && <span className="code">{codeLabel(s.code)}</span>}
                                  {s.tag && <span className="tag">{s.tag}</span>}
                                </div>
                                <h4>{s.title}</h4>
                                <p>{s.note}</p>
                                {s.branch && (
                                  <p className="branch">
                                    If this goes differently: <Link to={{ hash: s.branch[0] }}>{s.branch[1]}</Link>
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  </article>
                )
              })}
            </section>
          ))}
        </main>

        <footer className="foot">
          <p>
            People in the sample: Riya Kulkarni (student, Premium, finals), Arjun Mehta (Marketing &amp; Brand
            panelist) and the ops team. Dates assume today is Monday 5 October 2026 and Day 0 is Monday 9 November.
          </p>
          <p>
            Every screen is also in the <Link to="/gallery">mockup gallery</Link>.
          </p>
        </footer>
      </div>

      <Lightbox
        items={openItems}
        index={open ? open.index : null}
        onIndex={(index) => setOpen((o) => (o ? { ...o, index } : o))}
        onClose={() => setOpen(null)}
      />
    </div>
  )
}
