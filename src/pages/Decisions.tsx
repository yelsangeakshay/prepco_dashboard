import { Link } from 'react-router-dom'
import { SiteNav } from '../components/SiteNav'
import { BUILD_ORDER, DECISIONS, EDGE, NOT_DESIGNED } from '../data/decisions'
import { useTitle } from '../lib/hooks'
import '../styles/decisions.css'

export default function Decisions() {
  useTitle('Prep Co Decisions')

  return (
    <div className="pg-decisions">
      <div className="wrap">
        <SiteNav />
        <header className="top">
          <p className="eyebrow">Decisions · version 1</p>
          <h1>What we still need to decide</h1>
          <p className="lede">
            The mockups had to assume a few things the website never states. Each decision below shows what the screens
            assume and where it appears. Edge cases and what is not designed yet follow.
          </p>
          <nav className="jump" aria-label="On this page">
            <a href="#decisions">{DECISIONS.length} decisions</a>
            <a href="#edge">Edge cases</a>
            <a href="#todo">Not designed yet</a>
            <a href="#order">Build order</a>
          </nav>
        </header>

        <section className="sec" id="decisions">
          <h2>Open decisions</h2>
          <p>Anything tagged Proposed in a screen comes from this list. Answer these and the screens can be finalised.</p>
          <ol className="decs">
            {DECISIONS.map((d, i) => (
              <li className="dec" key={d.q}>
                <span className="n">{i + 1}</span>
                <div className="body">
                  <h3>{d.q}</h3>
                  <p className="prop">
                    <b>Assumed in the mockups:</b> {d.proposal}
                  </p>
                  <div className="meta">
                    <span>Shows on</span>
                    {d.screens.map((c) => (
                      <span className="code" key={c}>
                        {c}
                      </span>
                    ))}
                    <Link to={{ pathname: '/journeys', hash: d.journey }}>See the journey</Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="sec" id="edge">
          <h2>Edge cases</h2>
          <p>
            P0 blocks a launch, P1 should be in the first release, P2 can follow. Cases marked Designed link to the
            journey that shows them.
          </p>
          {EDGE.map((g) => (
            <div className="grp" key={g.group}>
              <h3>{g.group}</h3>
              {g.cases.map((c) => (
                <div className="case" key={c.text}>
                  <span className={`prio ${c.prio.toLowerCase()}`}>{c.prio}</span>
                  <p>{c.text}</p>
                  {c.journey ? (
                    <span className="state ok">
                      <Link to={{ pathname: '/journeys', hash: c.journey }}>Designed</Link>
                    </span>
                  ) : (
                    <span className="state no">Not designed yet</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </section>

        <section className="sec" id="todo">
          <h2>Not designed yet</h2>
          <ul className="todo">
            {NOT_DESIGNED.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section className="sec" id="order">
          <h2>Recommended build order</h2>
          <div className="order">
            {BUILD_ORDER.map((b) => (
              <div className="step" key={b.name}>
                <b>{b.name}</b>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="foot">
          <p>Screens marked Proposed use sample figures and policies made up for the mockups. They are not commitments.</p>
        </footer>
      </div>
    </div>
  )
}
