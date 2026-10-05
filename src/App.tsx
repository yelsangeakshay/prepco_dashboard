import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Decisions from './pages/Decisions'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Journeys from './pages/Journeys'

/** Scrolls to the element named by the URL hash after each navigation, or to the top when there is none. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const id = decodeURIComponent(hash.slice(1))
    const frame = requestAnimationFrame(() => {
      const el = id ? document.getElementById(id) : null
      if (el) el.scrollIntoView()
      else window.scrollTo(0, 0)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/decisions" element={<Decisions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
