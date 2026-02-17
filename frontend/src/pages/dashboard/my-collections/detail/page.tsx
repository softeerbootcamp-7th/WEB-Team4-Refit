import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useOutletContext, useParams } from 'react-router'
import { getQnaSetsInScrapFolder } from '@/apis'
import QnaCardListSection from '@/features/dashboard/my-collections/components/QnaCardListSection'
import { mapScrapFolderQnaToCardItem } from '@/features/dashboard/my-collections/mappers'

const SCRAP_FOLDER_QNA_PAGE_SIZE = 10
const OBSERVER_ROOT_MARGIN = '200px'

interface CollectionDetailContext {
  folderName?: string
}

export default function CollectionDetailPage() {
  const { folderId } = useParams()
  const { folderName } = useOutletContext<CollectionDetailContext>()

  const numericFolderId = Number(folderId)
  const scrapFolderId = Number.isInteger(numericFolderId) ? numericFolderId : 0

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const { data, isPending, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['my-collections', 'folder-qna', scrapFolderId],
    initialPageParam: 0,
    enabled: scrapFolderId > 0,
    queryFn: ({ pageParam }) =>
      getQnaSetsInScrapFolder(scrapFolderId, {
        page: pageParam,
        size: SCRAP_FOLDER_QNA_PAGE_SIZE,
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
    return (data?.pages ?? []).flatMap((page) => (page.result?.content ?? []).map(mapScrapFolderQnaToCardItem))
  }, [data?.pages])

  return (
    <QnaCardListSection
      title={folderName || '질문 리스트'}
      items={items}
      isLoading={isPending}
      isFetchingNext={isFetchingNextPage}
      hasNextPage={Boolean(hasNextPage)}
      loadMoreRef={loadMoreRef}
      errorMessage={isError ? '질문 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' : undefined}
      emptyMessage="스크랩된 질문이 아직 없어요."
    />
  )
}
