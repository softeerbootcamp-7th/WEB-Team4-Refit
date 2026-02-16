import { useGetDebriefIncompletedInterviews } from '@/apis/generated/dashboard-api/dashboard-api'
import type { DashboardDebriefIncompletedInterviewResponse } from '@/apis/generated/refit-api.schemas'
import { INTERVIEW_REVIEW_STATUS_LABEL } from '@/constants/interviewReviewStatus'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import type { ReviewWaitingData } from '../components/review-waiting-interview/ReviewWaitingCard'

export const useReviewWaitingInterviews = () => {
  const { data: response } = useGetDebriefIncompletedInterviews(
    {
      page: 0,
      size: 10,
    },
    {
      query: {
        select: (data): { content: DashboardDebriefIncompletedInterviewResponse[]; totalElements: number } => ({
          content: data?.result?.content ?? [],
          totalElements: data?.result?.totalElements ?? 0,
        }),
      },
    },
  )

  // API 데이터가 없으면 빈 배열 반환
  const content = response?.content ?? []

  const data: ReviewWaitingData[] = content.map((item) => {
    const interview = item.interview
    const interviewTypeKey = interview?.interviewType as keyof typeof INTERVIEW_TYPE_LABEL | undefined
    return {
      id: interview?.interviewId ?? 0,
      reviewStatus: interview?.interviewReviewStatus ?? 'NOT_LOGGED',
      status: INTERVIEW_REVIEW_STATUS_LABEL[interview?.interviewReviewStatus ?? 'NOT_LOGGED'],
      // passedDays가 0일 때 처리 (오늘 완료됨 등) 로직은 기획에 따라 다를 수 있음
      elapsedText: `면접 끝난지 ${item.passedDays ?? 0}일 지남`,
      companyName: interview?.companyName ?? '',
      // Industry 정보가 API에 없으므로 임시 하드코딩 또는 빈 문자열
      industry: interview?.companyName === '현대자동차' ? '제조업' : 'IT/플랫폼',
      jobCategory: interview?.jobCategoryName ?? '',
      interviewType: interviewTypeKey ? INTERVIEW_TYPE_LABEL[interviewTypeKey] : (interview?.interviewType ?? ''),
    }
  })

  return {
    data,
    count: response?.totalElements ?? 0,
  }
}
