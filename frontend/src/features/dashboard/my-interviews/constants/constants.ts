import type { LabelValueType } from '@/types/global'
import type { InterviewFilter, QuestionFilter, StarLevel } from '@/types/interview'

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
  sort: 'interviewStartAt,desc',
}

export const RESULT_THEME = {
  PASS: 'green-100',
  WAIT: 'orange-50',
  FAIL: 'red-50',
} as const

export const RESULT_LABEL = {
  PASS: '합격',
  WAIT: '발표 대기',
  FAIL: '불합격',
}

export const RESULT_STATUS_ITEMS: LabelValueType[] = [
  { label: '합격', value: 'PASS' },
  { label: '발표 대기', value: 'WAIT' },
  { label: '불합격', value: 'FAIL' },
]

export type InterviewResultStatus = 'PASS' | 'WAIT' | 'FAIL'

export const INTERVIEW_SORT_OPTIONS = [
  { label: '면접 일시 최신순', value: 'interviewStartAt,desc' },
  { label: '면접 일시 오래된 순', value: 'interviewStartAt,asc' },
  { label: '최신 업데이트순', value: 'updatedAt,desc' },
  { label: '가나다순', value: 'companyName,asc' },
] as const

export const EMPTY_QUESTION_FILTER: QuestionFilter = {
  keyword: '',
  sort: 'interviewStartAt,desc',
  hasStarAnalysis: null,
  sInclusionLevels: [],
  tInclusionLevels: [],
  aInclusionLevels: [],
  rInclusionLevels: [],
}

export const QUESTION_SORT_OPTIONS = [
  { label: '면접 일시 최신순', value: 'interviewStartAt,desc' },
  { label: '면접 일시 오래된 순', value: 'interviewStartAt,asc' },
  { label: '최신 업데이트순', value: 'updatedAt,desc' },
] as const

export const STAR_LEVEL_OPTIONS: { label: string; value: StarLevel }[] = [
  { label: '충분', value: 'PRESENT' },
  { label: '부족', value: 'INSUFFICIENT' },
  { label: '없음', value: 'ABSENT' },
]

export const DATA_EMPTY_MESSAGE = {
  interviews: '아직 면접 기록이 없어요. 면접을 등록하고 기록을 모아보세요.',
  questions: '아직 질문 데이터가 없어요. 면접 기록을 진행해서 질문과 답변을 모아보세요.',
}
