import type {
  InterviewDto,
  InterviewSimpleDto,
  InterviewSimpleDtoInterviewReviewStatus,
} from '@/apis/generated/refit-api.schemas'
import { formatDate } from '@/features/_common/utils/date'
import type { InterviewResultStatus } from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewType } from '@/types/interview'

export type DraftInterviewRowModel = {
  interviewId: number
  interviewReviewStatus: InterviewSimpleDtoInterviewReviewStatus
  interviewStartAt: string
  company: string
  jobCategoryName: string
  interviewType: InterviewType
}

export type InterviewCardModel = {
  resultStatus: InterviewResultStatus
  date: string
  company: string
  jobRole: string
  interviewType: InterviewType
}

export function mapDraftInterviewRow(item: InterviewSimpleDto): DraftInterviewRowModel {
  return {
    interviewId: item.interviewId!,
    interviewReviewStatus: item.interviewReviewStatus,
    interviewStartAt: `${formatDate(item.interviewStartAt)} 응시`,
    company: item.companyInfo?.companyName ?? '',
    jobCategoryName: item.jobCategoryName ?? '',
    interviewType: toInterviewType(item.interviewType),
  }
}

export function mapInterviewCard(item: InterviewDto): InterviewCardModel {
  return {
    resultStatus: toResultStatus(item.interviewResultStatus),
    date: item.interviewStartAt,
    company: item.companyName ?? '',
    jobRole: item.jobCategoryName ?? '',
    interviewType: toInterviewType(item.interviewType),
  }
}

function toInterviewType(value?: string): InterviewType {
  if (!value) return 'FIRST'
  return value as InterviewType
}

function toResultStatus(value?: string): InterviewResultStatus {
  if (value === 'PASS' || value === 'FAIL' || value === 'WAIT') return value
  return 'WAIT'
}
