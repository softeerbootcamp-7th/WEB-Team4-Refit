import type { BadgeTheme } from '@/shared/components/badge'
import type { StarStatus } from '@/types/interview'

export const KPT_SECTIONS = [
  { key: 'keep_text', label: 'Keep', question: '계속 유지하고 싶은 것은 무엇인가요?' },
  { key: 'problem_text', label: 'Problem', question: '어려움을 느꼈던 부분은 무엇인가요?' },
  { key: 'try_text', label: 'Try', question: '새롭게 시도해 볼 내용은 무엇인가요?' },
]

export const KPT_LABELS = {
  keep_text: 'Keep',
  problem_text: 'Problem',
  try_text: 'Try',
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
  present: 'green-100',
  insufficient: 'orange-50',
  absent: 'red-50',
}

export const INTERVIEW_INFO_LABELS = [
  { key: 'company', label: '기업명' },
  { key: 'interviewStartAt', label: '일시' },
  { key: 'jobRole', label: '직무' },
  { key: 'interviewType', label: '면접 유형' },
] as const
