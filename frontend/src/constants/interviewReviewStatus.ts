import type { InterviewDtoInterviewReviewStatus } from '@/apis'

export const INTERVIEW_REVIEW_STATUS_LABEL = {
  NOT_LOGGED: '기록 전',
  LOG_DRAFT: '기록 중',
  QNA_SET_DRAFT: '기록 확인',
  SELF_REVIEW_DRAFT: '회고 중',
  DEBRIEF_COMPLETED: '회고 완료',
} as const satisfies Record<InterviewDtoInterviewReviewStatus, string>

export type InterviewReviewStatusLabel =
  (typeof INTERVIEW_REVIEW_STATUS_LABEL)[keyof typeof INTERVIEW_REVIEW_STATUS_LABEL]
