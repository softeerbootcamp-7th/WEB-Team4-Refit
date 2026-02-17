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
