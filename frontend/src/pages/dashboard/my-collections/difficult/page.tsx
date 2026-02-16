import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getMyDifficultQnaSets } from '@/apis'
import type { ApiResponsePageDashboardMyDifficultQuestionResponse } from '@/apis/generated/refit-api.schemas'
import QnaCardListSection from '@/features/dashboard/my-collections/components/QnaCardListSection'
import { DIFFICULT_FOLDER_NAME, mapDifficultQnaToCardItem } from '@/features/dashboard/my-collections/mappers'

const DIFFICULT_QNA_PAGE_SIZE = 10
const OBSERVER_ROOT_MARGIN = '200px'

export default function DifficultQuestionPage() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const { data, isPending, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
    ApiResponsePageDashboardMyDifficultQuestionResponse,
    unknown,
    ApiResponsePageDashboardMyDifficultQuestionResponse,
    readonly [string, string],
    number
  >({
    queryKey: ['my-collections', 'difficult-qna'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getMyDifficultQnaSets({
        page: pageParam,
        size: DIFFICULT_QNA_PAGE_SIZE,
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

  const items = useMemo(() => {
    return (data?.pages ?? []).flatMap((page, pageIndex) =>
      (page.result?.content ?? []).map((item, itemIndex) =>
        mapDifficultQnaToCardItem(item, pageIndex * DIFFICULT_QNA_PAGE_SIZE + itemIndex),
      ),
    )
  }, [data?.pages])

  return (
    <QnaCardListSection
      title={DIFFICULT_FOLDER_NAME}
      items={items}
      isLoading={isPending}
      isFetchingNext={isFetchingNextPage}
      hasNextPage={Boolean(hasNextPage)}
      loadMoreRef={loadMoreRef}
      errorMessage={isError ? '어려웠던 질문을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' : undefined}
      emptyMessage="아직 어려웠던 질문으로 저장된 항목이 없어요."
    />
  )
}
