import type { TabItem } from '@/shared/components/tab'
import type { InterviewFilter } from '@/types/interview'

export const TAB_ITEMS: TabItem[] = [
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
}

export const RESULT_LABEL = {
  pass: '합격',
  wait: '발표 대기',
  fail: '불합격',
}

export type InterviewResultStatus = 'pass' | 'wait' | 'fail'
