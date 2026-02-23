import type { InterviewDtoInterviewReviewStatus } from '@/apis'
import { ROUTES } from '@/routes/routes'

export const INTERVIEW_ROUTE_BY_REVIEW_STATUS: Record<InterviewDtoInterviewReviewStatus, string> = {
  NOT_LOGGED: ROUTES.RECORD,
  LOG_DRAFT: ROUTES.RECORD,
  QNA_SET_DRAFT: ROUTES.RECORD_CONFIRM,
  SELF_REVIEW_DRAFT: ROUTES.RETRO,
  DEBRIEF_COMPLETED: ROUTES.RETRO_DETAILS,
}

export function getInterviewNavigationPath(
  interviewId: number | string,
  reviewStatus: InterviewDtoInterviewReviewStatus,
) {
  return INTERVIEW_ROUTE_BY_REVIEW_STATUS[reviewStatus].replace(':interviewId', String(interviewId))
}
