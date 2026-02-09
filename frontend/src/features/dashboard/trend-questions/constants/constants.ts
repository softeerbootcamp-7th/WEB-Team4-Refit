export type FilterType = 'industry' | 'job'

export type FilterBadge = {
  id: number
  type: FilterType
  label: string
}

export type FilterItem = {
  id: number
  label: string
}

export type ColorScheme = 'orange' | 'blue'

export const MAX_VISIBLE_BADGES = 7

type ColorSet = { bg: string; text: string; hover: string }

export const FILTER_COLORS = {
  industry: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-200' },
  job: { bg: 'bg-blue-050', text: 'text-blue-600', hover: 'hover:bg-blue-200' },
} as const satisfies Record<FilterType, ColorSet>
