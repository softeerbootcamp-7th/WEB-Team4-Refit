import type { INTERVIEW_TYPE_LABEL } from '@/shared/constants/interviews'

export type QnaSetType = {
  qnaSetId: number
  interviewId: number
  questionText: string
  answerText: string
  qnaSetSelfReviewText: string
  starAnalysis: StarAnalysisType
  isMarkedDifficult: boolean
}

export type StarStatus = 'present' | 'insufficient' | 'absent'

export type StarAnalysisResult = {
  sInclusionLevel: StarStatus
  tInclusionLevel: StarStatus
  aInclusionLevel: StarStatus
  rInclusionLevel: StarStatus
  overallSummary: string
}

type InterviewFullType = {
  interviewId: number
  interviewType: InterviewType
  interviewStartAt: string
  interviewReviewStatus: string
  interviewResultStatus: string
  company: string
  industryId: number
  jobCategoryId: number
  jobRole: string | null
  updatedAt: string
  pdfUrl: string | null
  qnaSets: QnaSetType[]
  questions: string[]
}

export type InterviewFilter = {
  keyword: string
  interviewType: InterviewType[]
  resultStatus: string[]
  startDate: string
  endDate: string
  sort: string
}

export type InterviewType = keyof typeof INTERVIEW_TYPE_LABEL

type KptTextsType = {
  keep_text: string
  problem_text: string
  try_text: string
}
