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
  company: string
  companyLogoUrl: string
  date: string
  jobRole: string
  interviewType: InterviewType
}

export type QnaCardItemModel = {
  resultStatus: InterviewSearchFilterInterviewResultStatusItem
  date: string
  company: string
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
    company: item.interviewInfo?.companyInfo?.companyName ?? '',
    companyLogoUrl: item.interviewInfo?.companyInfo?.companyLogoUrl ?? '',
    date: item.interviewInfo?.updatedAt ?? '',
    jobRole: item.interviewInfo?.jobCategoryName ?? '',
    interviewType: item.interviewInfo?.interviewType ?? 'FIRST',
  }
}

export function mapSearchQuestionToQnaCard(item: QnaSetSearchResponse): QnaCardItemModel {
  return {
    resultStatus: item.interviewInfo?.interviewResultStatus ?? 'WAIT',
    date: item.interviewInfo?.updatedAt ?? '',
    company: item.interviewInfo?.companyName ?? '',
    jobRole: item.interviewInfo?.jobCategoryName ?? '',
    interviewType: item.interviewInfo?.interviewType ?? 'FIRST',
    question: item.qnaSetInfo?.questionText ?? '',
    answer: item.qnaSetInfo?.answerText ?? '',
  }
}
