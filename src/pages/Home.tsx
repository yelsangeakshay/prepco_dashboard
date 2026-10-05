import { Link } from 'react-router-dom'
import { SiteNav } from '../components/SiteNav'
import { DECISIONS } from '../data/decisions'
import { JOURNEYS } from '../data/journeys'
import { BY_SLUG, SCREENS, thumbPath } from '../data/screens'
import { useTitle } from '../lib/hooks'
import '../styles/home.css'

const STRIP: [string, string][] = [
  ['s05', 'Student home'],
  ['s08', 'Answer bank'],
  ['p03', 'Pre-panel brief'],
  ['a01', 'Cohort overview'],
]

export default function Home() {
  useTitle('Prep Co App Mockups')
  const total = SCREENS.length
  const journeys = JOURNEYS.length
  const decisions = DECISIONS.length

  return (
    <div className="pg-home">
      <div className="wrap">
        <SiteNav />
        <header className="hero">
          <p className="eyebrow">Mockups · version 1</p>
          <h1>The Prep Co app, before it is built</h1>
          <p className="lede">
            {total} screens for students, panelists and the ops team, the {journeys} journeys that connect them, and
            the decisions still open. Start with the journeys.
          </p>
          <div className="stats" aria-label="Contents">
            <div className="stat">
              <b>{total}</b>
              <span>screens</span>
            </div>
            <div className="stat">
              <b>{journeys}</b>
              <span>journeys</span>
            </div>
            <div className="stat">
              <b>3</b>
              <span>roles</span>
            </div>
            <div className="stat">
              <b>{decisions}</b>
              <span>open decisions</span>
            </div>
          </div>
        </header>

        <section className="cards" aria-label="Sections">
          <Link className="hub" to="/journeys">
            <span className="n">{journeys}</span>
            <h2>Journey maps</h2>
            <p>
              Every path through the app as a numbered sequence of real screens, from the first click to Day 0,
              including what happens when things go wrong.
            </p>
            <span className="go">Open the journeys →</span>
          </Link>
          <Link className="hub" to="/gallery">
            <span className="n">{total}</span>
            <h2>All screens</h2>
            <p>Each mockup at full size, grouped by role, with the phone layouts and the edge-case screens.</p>
            <span className="go">Browse the screens →</span>
          </Link>
          <Link className="hub" to="/decisions">
            <span className="n">{decisions}</span>
            <h2>Decisions</h2>
            <p>
              The policies and numbers the mockups assume but the website never states, the edge cases they affect and
              what is not designed yet.
            </p>
            <span className="go">See what is open →</span>
          </Link>
        </section>

        <section aria-label="Preview" className="strip">
          {STRIP.map(([slug, caption]) => {
            const s = BY_SLUG[slug]
            return (
              <Link key={slug} to="/gallery">
                <img
                  src={thumbPath(slug)}
                  width={s.tw}
                  height={s.th}
                  alt={`Mockup of ${s.title}`}
                  loading="lazy"
                  decoding="async"
                />
                <span>{caption}</span>
              </Link>
            )
          })}
        </section>

        <section className="how">
          <h2>How to read this</h2>
          <ol>
            <li>
              <p>
                <b>Start with a journey.</b> Pick a path, such as Join and buy a plan, and tap through its steps.
              </p>
            </li>
            <li>
              <p>
                <b>Open a screen full size</b> to read the detail. The arrow keys or a swipe move to the next step.
              </p>
            </li>
            <li>
              <p>
                <b>Check the decisions</b> before the build. Anything tagged Proposed is a guess we need confirmed.
              </p>
            </li>
          </ol>
          <p className="legend">
            <span>
              <span className="role student">Student</span>
              <span className="role panelist">Panelist</span>
              <span className="role admin">Admin</span>
            </span>
            <span>
              <span className="tag">Proposed</span> a policy the website does not state yet
            </span>
            <span>
              <span className="tag">Sample data</span> made-up figures
            </span>
          </p>
        </section>

        <footer className="foot">
          <p>
            People in the sample: Riya Kulkarni (student, Premium, finals), Arjun Mehta (Marketing &amp; Brand
            panelist) and the ops team. Dates assume today is Monday 5 October 2026 and Day 0 is Monday 9 November.
          </p>
          <p>
            Colors, fonts and radii come from theprep.co.in. Prices and seat counts are the Season 1 figures on the
            site.
          </p>
        </footer>
      </div>
    </div>
  )
}
