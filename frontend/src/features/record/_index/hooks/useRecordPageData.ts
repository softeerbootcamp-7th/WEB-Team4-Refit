import { getInterview, useGetInterviewSuspense } from '@/apis'
import type { InterviewType } from '@/types/interview'

export function useRecordPageData(interviewId: number) {
  return useGetInterviewSuspense(interviewId, {
    query: { select: transformInterviewInfo },
  })
}

function transformInterviewInfo(res: Awaited<ReturnType<typeof getInterview>>) {
  const interview = res.result
  if (!interview) throw new Error('인터뷰 데이터가 존재하지 않습니다.')

  return {
    interviewInfo: {
      company: interview.companyName ?? '',
      jobRole: interview.jobCategoryName ?? '',
      interviewType: interview.interviewType as InterviewType,
      interviewStartAt: interview.interviewStartAt ?? '',
    },
    interviewReviewStatus: interview.interviewReviewStatus ?? 'NOT_LOGGED',
  }
}
