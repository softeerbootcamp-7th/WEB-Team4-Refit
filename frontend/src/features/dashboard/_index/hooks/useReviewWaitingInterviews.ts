import { useEffect, useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getDebriefIncompletedInterviews } from '@/apis/generated/dashboard-api/dashboard-api'
import type { DashboardDebriefIncompletedInterviewResponse } from '@/apis/generated/refit-api.schemas'
import { INTERVIEW_REVIEW_STATUS_LABEL } from '@/constants/interviewReviewStatus'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import type { ReviewWaitingData } from '../components/review-waiting-interview/ReviewWaitingCard'

const PAGE_SIZE = 10

function mapReviewWaitingInterview(item: DashboardDebriefIncompletedInterviewResponse): ReviewWaitingData {
  const interview = item.interview
  const interviewTypeKey = interview?.interviewType as keyof typeof INTERVIEW_TYPE_LABEL | undefined

  return {
    id: interview?.interviewId ?? 0,
    reviewStatus: interview?.interviewReviewStatus ?? 'NOT_LOGGED',
    status: INTERVIEW_REVIEW_STATUS_LABEL[interview?.interviewReviewStatus ?? 'NOT_LOGGED'],
    elapsedText: `면접 끝난지 ${item.passedDays ?? 0}일 지남`,
    companyName: interview?.companyName ?? '',
    companyLogoUrl: interview?.companyLogoUrl,
    industry: interview?.companyName === '현대자동차' ? '제조업' : 'IT/플랫폼',
    jobCategory: interview?.jobCategoryName ?? '',
    interviewType: interviewTypeKey ? INTERVIEW_TYPE_LABEL[interviewTypeKey] : (interview?.interviewType ?? ''),
  }
}

export const useReviewWaitingInterviews = () => {
  const { data: pages, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['dashboard', 'review-waiting-interviews'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getDebriefIncompletedInterviews({
        page: pageParam,
        size: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const totalPages = lastPage.result?.totalPages ?? 0
      const nextPage = lastPageParam + 1
      return nextPage < totalPages ? nextPage : undefined
    },
  })

  useEffect(() => {
    if (!hasNextPage || isPending || isFetchingNextPage) return
    void fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isPending])

  const data: ReviewWaitingData[] = useMemo(
    () =>
      (pages?.pages ?? [])
        .flatMap((page) => page.result?.content ?? [])
        .map((item) => mapReviewWaitingInterview(item)),
    [pages?.pages],
  )

  const count = pages?.pages[0]?.result?.totalElements ?? data.length

  return {
    data,
    count,
  }
}
