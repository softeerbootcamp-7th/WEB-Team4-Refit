import type { InterviewDtoInterviewReviewStatus } from '@/apis'

export type ReviewWaitingStatusLabel = '기록 전' | '기록 중'

export const REVIEW_WAITING_STATUS_LABEL: Record<InterviewDtoInterviewReviewStatus, ReviewWaitingStatusLabel> = {
  NOT_LOGGED: '기록 전',
  LOG_DRAFT: '기록 중',
  QNA_SET_DRAFT: '기록 중',
  SELF_REVIEW_DRAFT: '기록 중',
  DEBRIEF_COMPLETED: '기록 중',
}
