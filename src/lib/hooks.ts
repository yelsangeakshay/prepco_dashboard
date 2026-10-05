import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}

/** Tab state kept in the URL hash, so a tab can be linked to (for example /gallery#edge). */
export function useHashTab<T extends string>(keys: readonly T[], fallback: T): [T, (key: T) => void] {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const current = hash.slice(1) as T
  const tab = keys.includes(current) ? current : fallback
  const setTab = (key: T) => navigate({ hash: key === fallback ? '' : key }, { replace: true })
  return [tab, setTab]
}
