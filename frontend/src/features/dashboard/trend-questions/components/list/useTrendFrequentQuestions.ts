import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getFrequentQuestions } from '@/apis/generated/qna-set-api/qna-set-api'
import type { FrequentQnaSetResponse } from '@/apis/generated/refit-api.schemas'

type UseTrendFrequentQuestionsParams = {
  industryIds: number[]
  jobCategoryIds: number[]
  isBlurred: boolean
}

const PAGE_SIZE = 10
const OBSERVER_ROOT_MARGIN = '200px 0px'

export function useTrendFrequentQuestions({ industryIds, jobCategoryIds, isBlurred }: UseTrendFrequentQuestionsParams) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const baseParams = useMemo(
    () => ({
      industryIds: industryIds.length > 0 ? industryIds : undefined,
      jobCategoryIds: jobCategoryIds.length > 0 ? jobCategoryIds : undefined,
    }),
    [industryIds, jobCategoryIds],
  )

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['trend-questions', 'frequent', baseParams],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getFrequentQuestions({
        industryIds: baseParams.industryIds ?? [],
        jobCategoryIds: baseParams.jobCategoryIds ?? [],
        page: pageParam,
        size: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (isBlurred) return undefined
      const totalPages = lastPage.result?.totalPages ?? 0
      const nextPage = lastPageParam + 1
      return nextPage < totalPages ? nextPage : undefined
    },
  })

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || isBlurred || !hasNextPage || isPending || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void fetchNextPage()
      },
      { rootMargin: OBSERVER_ROOT_MARGIN },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [isBlurred, fetchNextPage, hasNextPage, isFetchingNextPage, isPending])

  const frequentQuestions: FrequentQnaSetResponse[] = data?.pages.flatMap((page) => page.result?.content ?? []) ?? []
  const totalCount = data?.pages[0]?.result?.totalElements ?? frequentQuestions.length

  return {
    loadMoreRef,
    frequentQuestions,
    totalCount,
    isPending,
    isFetchingNextPage,
  }
}
