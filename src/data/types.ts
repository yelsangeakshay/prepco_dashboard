export type Section = 'overview' | 'student' | 'panelist' | 'admin' | 'edge'
export type JourneyTab = 'student' | 'edge' | 'panelist' | 'admin' | 'cross'

export interface Screen {
  slug: string
  code: string
  mobile: boolean
  title: string
  tags: string[]
  section: Section
  cssw: number
  tw: number
  th: number
}

export interface Step {
  code: string | null
  title: string
  note: string
  kind?: string
  tag?: string
  branch?: [string, string]
}

export interface Journey {
  id: string
  tab: JourneyTab
  title: string
  starts: string
  ends: string
  steps: Step[]
}

export interface Decision {
  q: string
  proposal: string
  screens: string[]
  journey: string
}

export interface EdgeCase {
  prio: 'P0' | 'P1' | 'P2'
  text: string
  journey: string | null
}

export interface EdgeGroup {
  group: string
  cases: EdgeCase[]
}

export interface BuildStage {
  name: string
  text: string
}
