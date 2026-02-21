import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { searchInterviews } from '@/apis/generated/interview-my-api/interview-my-api'
import type { InterviewSearchRequest } from '@/apis/generated/refit-api.schemas'
import {
  mapInterviewCard,
  type InterviewCardModel,
} from '@/features/dashboard/my-interviews/components/interviews/mappers'
import type { InterviewFilter } from '@/types/interview'

const PAGE_SIZE = 9
const OBSERVER_ROOT_MARGIN = '200px'

export function useInfiniteInterviewList(filter: InterviewFilter) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const hasFilterCondition = useMemo(() => hasActiveFilterCondition(filter), [filter])
  const searchBody = useMemo(() => toInterviewSearchRequestBody(filter), [filter])
  const sortParam = useMemo(() => (filter.sort ? [filter.sort] : undefined), [filter.sort])

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage, isError } = useInfiniteQuery({
    queryKey: ['my-interviews', 'interview-list', searchBody, sortParam],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      searchInterviews(searchBody, {
        page: pageParam,
        size: PAGE_SIZE,
        sort: sortParam,
      }),
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const totalPages = lastPage.result?.totalPages ?? 0
      const nextPage = lastPageParam + 1
      return nextPage < totalPages ? nextPage : undefined
    },
  })

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || !hasNextPage || isPending || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void fetchNextPage()
      },
      { rootMargin: OBSERVER_ROOT_MARGIN },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isPending])

  const items = useMemo(() => toFlatInterviewItems(data?.pages), [data?.pages])
  const emptyMessage = useMemo(() => getEmptyMessage({ isError, hasFilterCondition }), [hasFilterCondition, isError])

  return {
    items,
    loadMoreRef,
    isInitialLoading: isPending,
    isFetchingNext: isFetchingNextPage,
    isPending,
    hasNextPage: Boolean(hasNextPage),
    emptyMessage,
  }
}

const toInterviewSearchRequestBody = (filter: InterviewFilter): InterviewSearchRequest => ({
  keyword: filter.keyword || undefined,
  searchFilter: {
    // searchFilter 조건 없어도 null/빈배열로 채워서 전송
    interviewType: filter.interviewType,
    interviewResultStatus: filter.resultStatus,
    // 검색어 있으면 전체 상태 조회, 없으면 복기 완료된 면접만 조회
    interviewReviewStatus: filter.keyword ? [] : ['DEBRIEF_COMPLETED'],
    startDate: toNullableDate(filter.startDate),
    endDate: toNullableDate(filter.endDate),
  } as InterviewSearchRequest['searchFilter'],
})

const hasActiveFilterCondition = (filter: InterviewFilter) =>
  filter.keyword.trim().length > 0 ||
  filter.interviewType.length > 0 ||
  filter.resultStatus.length > 0 ||
  filter.startDate.length > 0 ||
  filter.endDate.length > 0

const toFlatInterviewItems = (
  pages: Awaited<ReturnType<typeof searchInterviews>>[] | undefined,
): InterviewCardModel[] =>
  (pages ?? []).flatMap((page) => (page.result?.content ?? []).map((item) => mapInterviewCard(item)))

const getEmptyMessage = ({ isError, hasFilterCondition }: { isError: boolean; hasFilterCondition: boolean }) => {
  if (isError) return '면접 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
  if (hasFilterCondition) return '선택한 검색/필터 조건에 맞는 면접이 없어요. 조건을 바꿔서 다시 확인해보세요.'
  return '아직 면접 기록이 없어요. 면접을 등록하고 기록을 모아보세요.'
}

function toNullableDate(value: string): string | null {
  return value.trim() ? value : null
}
