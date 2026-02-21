import type {
  FrequentQnaSetCategoryQuestionResponse,
  FrequentQnaSetCategoryResponse,
  InterviewSearchFilterInterviewResultStatusItem,
  QnaSetSearchResponse,
} from '@/apis/generated/refit-api.schemas'
import type { InterviewType } from '@/types/interview'

export type FrequentQuestionCategory = {
  categoryId: number
  categoryName: string
  frequentCount: number
}

export type QuestionCardModel = {
  question: string
  companyName: string
  companyLogoUrl: string
  date: string
  jobRole: string
  interviewType: InterviewType
}

export type QnaCardItemModel = {
  interviewId: number
  qnaSetId: number
  resultStatus: InterviewSearchFilterInterviewResultStatusItem
  date: string
  companyName: string
  companyLogoUrl?: string
  jobRole: string
  interviewType: InterviewType
  question: string
  answer: string
}

export function mapFrequentCategory(item: FrequentQnaSetCategoryResponse): FrequentQuestionCategory {
  return {
    categoryId: item.categoryId ?? 0,
    categoryName: item.categoryName ?? '',
    frequentCount: item.frequentCount ?? 0,
  }
}

export function mapFrequentQuestion(item: FrequentQnaSetCategoryQuestionResponse): QuestionCardModel {
  return {
    question: item.question ?? '',
    companyName: item.interviewInfo?.companyInfo?.companyName ?? '',
    companyLogoUrl: item.interviewInfo?.companyInfo?.companyLogoUrl ?? '',
    date: item.interviewInfo?.updatedAt ?? '',
    jobRole: item.interviewInfo?.jobCategoryName ?? '',
    interviewType: item.interviewInfo?.interviewType ?? 'FIRST',
  }
}

export function mapSearchQuestionToQnaCard(item: QnaSetSearchResponse): QnaCardItemModel {
  return {
    interviewId: item.interviewInfo?.interviewId ?? 0,
    qnaSetId: item.qnaSetInfo?.qnaSetId ?? 0,
    resultStatus: item.interviewInfo?.interviewResultStatus ?? 'WAIT',
    date: item.interviewInfo?.updatedAt ?? '',
    companyName: item.interviewInfo?.companyName ?? '',
    companyLogoUrl: item.interviewInfo?.companyLogoUrl,
    jobRole: item.interviewInfo?.jobCategoryName ?? '',
    interviewType: item.interviewInfo?.interviewType ?? 'FIRST',
    question: item.qnaSetInfo?.questionText ?? '',
    answer: item.qnaSetInfo?.answerText ?? '',
  }
}
