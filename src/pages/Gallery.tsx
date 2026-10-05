import { useMemo, useState } from 'react'
import { Lightbox } from '../components/Lightbox'
import type { LightboxItem } from '../components/Lightbox'
import { SiteNav } from '../components/SiteNav'
import { SCREENS, fullPath, screenLabel, thumbPath } from '../data/screens'
import type { Screen, Section } from '../data/types'
import { useHashTab, useTitle } from '../lib/hooks'
import '../styles/gallery.css'

const SECTIONS: { key: Section; name: string; tab: string; blurb: string }[] = [
  {
    key: 'overview',
    name: 'Overview',
    tab: 'Overview',
    blurb: 'Cover with the theme, and the product review that lists coverage, edge cases and open decisions.',
  },
  {
    key: 'student',
    name: 'Student',
    tab: 'Student',
    blurb: 'From sign-up and the free session to the CV Builder, answer bank, sessions and billing.',
  },
  {
    key: 'panelist',
    name: 'Panelist',
    tab: 'Panelist',
    blurb: 'How a working practitioner applies, reads a brief, scores a panel and sets availability.',
  },
  {
    key: 'admin',
    name: 'Admin / ops',
    tab: 'Admin / ops',
    blurb: 'The console that keeps a cohort moving: seats, students, assignment, bookings and the ledger.',
  },
  {
    key: 'edge',
    name: 'Edge cases and states',
    tab: 'Edge cases',
    blurb: 'What happens when a payment fails, a panelist cancels, a seat is gone or a date moves.',
  },
]

const TAB_KEYS = ['all', 'overview', 'student', 'panelist', 'admin', 'edge'] as const
type Tab = (typeof TAB_KEYS)[number]

function Card({ s, onOpen }: { s: Screen; onOpen: () => void }) {
  const label = screenLabel(s)
  return (
    <figure className={`card${s.code === 'Review' ? ' wide' : ''}`}>
      <button className="shot" type="button" aria-label={`Open ${label} full size`} onClick={onOpen}>
        <img
          src={thumbPath(s.slug)}
          width={s.tw}
          height={s.th}
          alt={`Mockup of ${s.title}${s.mobile ? ' on a phone' : ''}`}
          loading="lazy"
          decoding="async"
        />
      </button>
      <figcaption>
        <span className="code">{s.code}</span>
        <span className="ttl">{s.title}</span>
        {s.tags.map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

export default function Gallery() {
  useTitle('Prep Co Mockup Gallery')
  const [tab, setTab] = useHashTab<Tab>(TAB_KEYS, 'all')
  const [open, setOpen] = useState<number | null>(null)

  const visible = useMemo(() => SCREENS.filter((s) => tab === 'all' || s.section === tab), [tab])
  const items: LightboxItem[] = useMemo(
    () =>
      visible.map((s, i) => ({
        full: fullPath(s.slug),
        thumb: thumbPath(s.slug),
        width: s.cssw,
        label: screenLabel(s),
        count: `${i + 1} / ${visible.length}`,
      })),
    [visible],
  )
  const mobileCount = SCREENS.filter((s) => s.mobile).length

  return (
    <div className="pg-gallery">
      <div className="wrap">
        <SiteNav />
        <header className="top">
          <div style={{ display: 'grid', gap: 12 }}>
            <p className="eyebrow">Dashboard mockups · version 1</p>
            <h1>Every screen of the Prep Co app</h1>
            <p className="lede">
              The logged-in product behind theprep.co.in, drawn for students, panelists and the ops team. Tap any
              screen to open it full size and use the arrow keys or swipe to move between them.
            </p>
          </div>
          <div className="stats" aria-label="Contents">
            <div className="stat">
              <b>{SCREENS.length}</b>
              <span>screens</span>
            </div>
            <div className="stat">
              <b>3</b>
              <span>roles</span>
            </div>
            <div className="stat">
              <b>{SCREENS.filter((s) => s.section === 'edge').length}</b>
              <span>edge cases</span>
            </div>
            <div className="stat">
              <b>{mobileCount}</b>
              <span>phone layouts</span>
            </div>
          </div>
          <p className="legend">
            <span>
              <span className="tag">Proposed</span> a policy, step or number the website does not state yet
            </span>
            <span>
              <span className="tag">Sample data</span> made-up figures
            </span>
          </p>
        </header>

        <nav className="bar" aria-label="Sections">
          <div className="tabs">
            <button className="tab" type="button" aria-pressed={tab === 'all'} onClick={() => setTab('all')}>
              All <span>{SCREENS.length}</span>
            </button>
            {SECTIONS.map((sec) => (
              <button
                key={sec.key}
                className="tab"
                type="button"
                aria-pressed={tab === sec.key}
                onClick={() => setTab(sec.key)}
              >
                {sec.tab} <span>{SCREENS.filter((s) => s.section === sec.key).length}</span>
              </button>
            ))}
          </div>
        </nav>

        <main>
          {SECTIONS.filter((sec) => tab === 'all' || tab === sec.key).map((sec) => {
            const desk = SCREENS.filter((s) => s.section === sec.key && !s.mobile)
            const mob = SCREENS.filter((s) => s.section === sec.key && s.mobile)
            return (
              <section className="sec" id={sec.key} key={sec.key}>
                <div className="sechead">
                  <h2>{sec.name}</h2>
                  <p>{sec.blurb}</p>
                </div>
                {desk.length > 0 && (
                  <>
                    {mob.length > 0 && (
                      <h3 className="grp">
                        Desktop <span>{desk.length} screens</span>
                      </h3>
                    )}
                    <div className="grid">
                      {desk.map((s) => (
                        <Card key={s.slug} s={s} onOpen={() => setOpen(visible.indexOf(s))} />
                      ))}
                    </div>
                  </>
                )}
                {mob.length > 0 && (
                  <>
                    <h3 className="grp">
                      Mobile <span>{mob.length} screens</span>
                    </h3>
                    <div className="grid mgrid">
                      {mob.map((s) => (
                        <Card key={s.slug} s={s} onOpen={() => setOpen(visible.indexOf(s))} />
                      ))}
                    </div>
                  </>
                )}
              </section>
            )
          })}
        </main>

        <footer className="foot">
          <p>
            Sample student throughout: Riya Kulkarni, Premium, finals track, targeting Sales &amp; Marketing. Dates
            assume today is Monday 5 October 2026 and Day 0 is Monday 9 November.
          </p>
          <p>Colors, fonts and radii come from the marketing site. Prices and seat counts are the Season 1 figures on the site.</p>
        </footer>
      </div>

      <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </div>
  )
}
