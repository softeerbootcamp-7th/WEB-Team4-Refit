type QnaSetType = {
  qnaSetId: number
  interviewId: number
  questionText: string
  answerText: string
  qnaSetSelfReviewText: string
  starAnalysis: StarAnalysisType
  isMarkedDifficult: boolean
}

type InclusionLevel = 'present' | 'insufficient' | 'absent'

type StarAnalysisType = {
  sInclusionLevel: InclusionLevel
  tInclusionLevel: InclusionLevel
  aInclusionLevel: InclusionLevel
  rInclusionLevel: InclusionLevel
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
