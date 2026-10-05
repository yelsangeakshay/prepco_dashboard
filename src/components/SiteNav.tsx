import { Link, NavLink } from 'react-router-dom'
import '../styles/nav.css'

export function SiteNav() {
  return (
    <nav className="sn" aria-label="Site">
      <Link className="sn-brand" to="/">
        <b>[</b>The Prep Co.<b>]</b>
        <span>Mockups</span>
      </Link>
      <div className="sn-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/journeys">Journeys</NavLink>
        <NavLink to="/gallery">Screens</NavLink>
        <NavLink to="/decisions">Decisions</NavLink>
      </div>
    </nav>
  )
}
