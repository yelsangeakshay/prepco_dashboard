import raw from './screens.json'
import type { Screen } from './types'

export const SCREENS = raw as Screen[]

export const BY_SLUG: Record<string, Screen> = Object.fromEntries(SCREENS.map((s) => [s.slug, s]))

export const fullPath = (slug: string) => `/shared/img/${slug}.png`
export const thumbPath = (slug: string) => `/shared/thumb/${slug}.jpg`

export function screenLabel(s: Screen) {
  return `${s.code}${s.mobile ? ' mobile' : ''}: ${s.title}`
}
