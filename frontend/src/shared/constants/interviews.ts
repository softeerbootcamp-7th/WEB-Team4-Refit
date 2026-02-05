import type { LabelValueType } from '@/types/global'
import type { InterviewType } from '@/types/interview'

export const INTERVIEW_TYPE_LABEL: Record<InterviewType, string> = {
  first: '1차 면접',
  second: '2차 면접',
  third: '3차 면접',
  personality: '인성 면접',
  technical: '기술 면접',
  executive: '임원 면접',
  culture: '컬쳐핏 면접',
  coffee: '커피챗',
  mock: '모의 면접',
} as const

export const INTERVIEW_TYPE_OPTIONS: LabelValueType[] = Object.entries(INTERVIEW_TYPE_LABEL).map(([value, label]) => ({
  value,
  label,
}))
