import type { BadgeTheme } from '@/shared/components/badge'
import type { StarStatus } from '@/types/interview'

export const KPT_SECTIONS = [
  { key: 'keepText' as const, label: 'Keep', question: '계속 유지하고 싶은 것은 무엇인가요?' },
  { key: 'problemText' as const, label: 'Problem', question: '어려움을 느꼈던 부분은 무엇인가요?' },
  { key: 'tryText' as const, label: 'Try', question: '새롭게 시도해 볼 내용은 무엇인가요?' },
]

export const KPT_LABELS = {
  keepText: 'Keep',
  problemText: 'Problem',
  tryText: 'Try',
}

export const STAR_LABELS = [
  { key: 'sInclusionLevel', label: 'Situation' },
  { key: 'tInclusionLevel', label: 'Task' },
  { key: 'aInclusionLevel', label: 'Action' },
  { key: 'rInclusionLevel', label: 'Result' },
] as const

export const STAR_VALUES: Record<StarStatus, string> = {
  present: '충분',
  insufficient: '부족',
  absent: '없음',
}

export const STATUS_THEME: Record<StarStatus, BadgeTheme> = {
  present: 'green-50-outline',
  insufficient: 'orange-50-outline',
  absent: 'red-50-outline',
}
