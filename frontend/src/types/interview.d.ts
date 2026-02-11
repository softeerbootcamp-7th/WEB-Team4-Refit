import type { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'

export type SimpleQnaType = {
  qnaSetId: number
  questionText: string
  answerText: string
  isMarkedDifficult?: boolean
}

export type QnaSetType = {
  qnaSetId: number
  interviewId: number
  questionText: string
  answerText: string
  qnaSetSelfReviewText: string
  starAnalysis: StarAnalysisResult
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

export type InterviewInfoType = Pick<InterviewFullType, 'company' | 'jobRole' | 'interviewType' | 'interviewStartAt'>

type InterviewFullType = {
  interviewId: number
  interviewType: keyof typeof INTERVIEW_TYPE_LABEL
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
  interviewSelfReview: KptTextsType
}

export type InterviewFilter = {
  keyword: string
  interviewType: string[]
  resultStatus: string[]
  startDate: string
  endDate: string
  sort: string
}

export type InterviewType = keyof typeof INTERVIEW_TYPE_LABEL

type KptTextsType = {
  keepText: string
  problemText: string
  tryText: string
}
