import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { searchMyQnaSet } from '@/apis/generated/qna-set-my-controller/qna-set-my-controller'
import type { ApiResponsePageQnaSetSearchResponse } from '@/apis/generated/refit-api.schemas'
import type { QuestionFilter } from '@/types/interview'
import { mapSearchQuestionToQnaCard, type QnaCardItemModel } from '../mappers'

const PAGE_SIZE = 4
const OBSERVER_ROOT_MARGIN = '200px'

export function useInfiniteQuestionList(filter: QuestionFilter) {
  // 화면 하단 감지용 sentinel 요소를 관찰해서 하단 도달 시 다음 페이지 로드
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const hasFilterCondition = useMemo(() => hasActiveFilterCondition(filter), [filter])

  const searchBody = useMemo(() => toQuestionSearchRequestBody(filter), [filter])
  const sortParam = useMemo(() => (filter.sort ? [filter.sort] : undefined), [filter.sort])

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage, isError } = useInfiniteQuery({
    queryKey: ['my-interviews', 'question-list', searchBody, sortParam],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      searchMyQnaSet(searchBody, {
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

  const items = useMemo(() => toFlatQuestionItems(data?.pages), [data?.pages])

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

const toQuestionSearchRequestBody = (filter: QuestionFilter) => ({
  keyword: filter.keyword || undefined,
  searchFilter: {
    hasStarAnalysis: filter.hasStarAnalysis ?? undefined,
    sInclusionLevels: filter.sInclusionLevels.length > 0 ? filter.sInclusionLevels : undefined,
    tInclusionLevels: filter.tInclusionLevels.length > 0 ? filter.tInclusionLevels : undefined,
    aInclusionLevels: filter.aInclusionLevels.length > 0 ? filter.aInclusionLevels : undefined,
    rInclusionLevels: filter.rInclusionLevels.length > 0 ? filter.rInclusionLevels : undefined,
  },
})

const hasActiveFilterCondition = (filter: QuestionFilter) =>
  filter.keyword.trim().length > 0 ||
  filter.hasStarAnalysis !== null ||
  filter.sInclusionLevels.length > 0 ||
  filter.tInclusionLevels.length > 0 ||
  filter.aInclusionLevels.length > 0 ||
  filter.rInclusionLevels.length > 0

const toFlatQuestionItems = (pages: ApiResponsePageQnaSetSearchResponse[] | undefined): QnaCardItemModel[] =>
  (pages ?? []).flatMap((page) => (page.result?.content ?? []).map((item) => mapSearchQuestionToQnaCard(item)))

const getEmptyMessage = ({ isError, hasFilterCondition }: { isError: boolean; hasFilterCondition: boolean }) => {
  if (isError) return '질문 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
  if (hasFilterCondition) return '선택한 검색/필터 조건에 맞는 질문이 없어요. 조건을 바꿔서 다시 확인해보세요.'
  return '질문 데이터가 없어요. 면접 기록을 진행해서 질문을 모아보세요.'
}
