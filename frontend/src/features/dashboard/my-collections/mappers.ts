import type {
  DashboardMyDifficultQuestionResponse,
  ScrapFolderQnaSetResponse,
  ScrapFolderResponse,
} from '@/apis/generated/refit-api.schemas'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import type { QnaCardListItem } from '@/features/dashboard/my-collections/components/QnaCardListSection'
import type { InterviewResultStatus } from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewType } from '@/types/interview'

export const DIFFICULT_FOLDER_ID = 'difficult-questions'
export const DIFFICULT_FOLDER_NAME = '어려웠던 질문'

export type CollectionFolderItem = {
  id: string
  name: string
  count: number
  isFixed?: boolean
  scrapFolderId?: number
}

export function mapScrapFolderToCollectionFolder(item: ScrapFolderResponse): CollectionFolderItem {
  return {
    id: String(item.scrapFolderId),
    scrapFolderId: item.scrapFolderId,
    name: item.scrapFolderName,
    count: item.qnaSetCount,
  }
}

export function mapScrapFolderQnaToCardItem(item: ScrapFolderQnaSetResponse): QnaCardListItem {
  return {
    id: item.qnaSet.qnaSetId,
    resultStatus: toInterviewResultStatus(item.interview.interviewResultStatus),
    date: formatInterviewDateLabel(item.interview.interviewStartAt),
    company: item.interview.companyName,
    job: item.interview.jobCategoryName,
    interviewType: toInterviewType(item.interview.interviewType),
    question: item.qnaSet.questionText,
    answer: item.qnaSet.answerText,
    createdAt: item.interview.interviewStartAt,
  }
}

export function mapDifficultQnaToCardItem(item: DashboardMyDifficultQuestionResponse, index: number): QnaCardListItem {
  return {
    id: `${item.interview.interviewId}-${index}`,
    resultStatus: toInterviewResultStatus(item.interview.interviewResultStatus),
    date: formatInterviewDateLabel(item.interview.interviewStartAt),
    company: item.interview.companyName,
    job: item.interview.jobCategoryName,
    interviewType: toInterviewType(item.interview.interviewType),
    question: item.question,
    answer: '',
    createdAt: item.interview.interviewStartAt,
  }
}

export function formatInterviewDateLabel(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '일시 미정'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}. ${month}. ${day} 응시`
}

const RESULT_STATUSES: readonly InterviewResultStatus[] = ['PASS', 'WAIT', 'FAIL']

function toInterviewResultStatus(value: string): InterviewResultStatus {
  return RESULT_STATUSES.includes(value as InterviewResultStatus) ? (value as InterviewResultStatus) : 'WAIT'
}

function toInterviewType(value: string): InterviewType {
  return value in INTERVIEW_TYPE_LABEL ? (value as InterviewType) : 'FIRST'
}
