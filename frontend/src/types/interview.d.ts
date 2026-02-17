import type {
  InterviewSearchRequest,
  QnaSetSearchRequest,
  QnaSearchFilterAInclusionLevelsItem,
  QnaSearchFilterRInclusionLevelsItem,
  QnaSearchFilterSInclusionLevelsItem,
  QnaSearchFilterTInclusionLevelsItem,
} from '@/apis/generated/refit-api.schemas'
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
  starAnalysis?: StarAnalysisResult
  isMarkedDifficult: boolean
}

export type StarStatus = 'PRESENT' | 'INSUFFICIENT' | 'ABSENT' | 'NULL'

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
  interviewType: NonNullable<InterviewSearchRequest['searchFilter']['interviewType']>
  resultStatus: NonNullable<InterviewSearchRequest['searchFilter']['interviewResultStatus']>
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

export type StarLevel =
  | QnaSearchFilterSInclusionLevelsItem
  | QnaSearchFilterTInclusionLevelsItem
  | QnaSearchFilterAInclusionLevelsItem
  | QnaSearchFilterRInclusionLevelsItem

type ApiQuestionSearchFilter = NonNullable<QnaSetSearchRequest['searchFilter']>

export type QuestionFilter = {
  keyword: string
  sort: string
  hasStarAnalysis: ApiQuestionSearchFilter['hasStarAnalysis'] | null
  sInclusionLevels: NonNullable<ApiQuestionSearchFilter['sInclusionLevels']>
  tInclusionLevels: NonNullable<ApiQuestionSearchFilter['tInclusionLevels']>
  aInclusionLevels: NonNullable<ApiQuestionSearchFilter['aInclusionLevels']>
  rInclusionLevels: NonNullable<ApiQuestionSearchFilter['rInclusionLevels']>
}
