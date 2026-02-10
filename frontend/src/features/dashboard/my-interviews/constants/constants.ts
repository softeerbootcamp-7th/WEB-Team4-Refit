import type { LabelValueType } from '@/types/global'
import type { InterviewFilter } from '@/types/interview'

export const TAB_ITEMS: LabelValueType[] = [
  { label: '면접', value: 'interviews' },
  { label: '질문', value: 'questions' },
]

export const EMPTY_FILTER: InterviewFilter = {
  keyword: '',
  interviewType: [],
  resultStatus: [],
  startDate: '',
  endDate: '',
  sort: 'date-latest',
}

export const RESULT_THEME = {
  pass: 'green-100',
  wait: 'orange-50',
  fail: 'red-50',
} as const

export const RESULT_LABEL = {
  pass: '합격',
  wait: '발표 대기',
  fail: '불합격',
}

export const RESULT_STATUS_ITEMS: LabelValueType[] = [
  { label: '합격', value: 'pass' },
  { label: '발표 대기', value: 'wait' },
  { label: '불합격', value: 'fail' },
]

export type InterviewResultStatus = 'pass' | 'wait' | 'fail'
