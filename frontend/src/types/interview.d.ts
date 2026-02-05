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
  interviewType: string
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
  interviewType: string[]
  resultStatus: string[]
  startDate: string
  endDate: string
  sort: string
}

export type InterviewType =
  | 'first'
  | 'second'
  | 'third'
  | 'personality'
  | 'technical'
  | 'executive'
  | 'culture'
  | 'coffee'
  | 'mock'

type KptTextsType = {
  keep_text: string
  problem_text: string
  try_text: string
}
