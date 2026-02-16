import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import { getGetMyScrapFoldersQueryKey, getMyScrapFolders } from '@/apis'
import {
  DIFFICULT_FOLDER_ID,
  DIFFICULT_FOLDER_NAME,
  mapScrapFolderToCollectionFolder,
  type CollectionFolderItem,
} from '@/features/dashboard/my-collections/mappers'

const FOLDER_PAGE_SIZE = 20
const OBSERVER_ROOT_MARGIN = '200px'

export function useCollectionFolders() {
  const navigate = useNavigate()
  const { folderId } = useParams()
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const { data, isPending: isFoldersPending, isError: isFoldersError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: getGetMyScrapFoldersQueryKey({ size: FOLDER_PAGE_SIZE }),
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        getMyScrapFolders({
          page: pageParam,
          size: FOLDER_PAGE_SIZE,
        }),
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        const totalPages = lastPage.result?.totalPages ?? 0
        const nextPage = lastPageParam + 1
        return nextPage < totalPages ? nextPage : undefined
      },
    })

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || !hasNextPage || isFoldersPending || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void fetchNextPage()
      },
      { rootMargin: OBSERVER_ROOT_MARGIN },
    )

    observer.observe(target)
    return () => observer.disconnect()
  })

  const folders = useMemo<CollectionFolderItem[]>(() => {
    const normalFolders = (data?.pages ?? []).flatMap((page) =>
      (page.result?.content ?? []).map(mapScrapFolderToCollectionFolder),
    )
    return [{ id: DIFFICULT_FOLDER_ID, name: DIFFICULT_FOLDER_NAME, count: 0, isFixed: true }, ...normalFolders]
  }, [data?.pages])

  const selectedFolderId = folderId ?? DIFFICULT_FOLDER_ID
  const selectedFolder = folders.find((folder) => folder.id === selectedFolderId)

  useEffect(() => {
    if (!folderId || isFoldersPending || isFoldersError || !hasNextPage || isFetchingNextPage) return

    const isExistingFolder = folders.some((folder) => folder.id === folderId)
    if (!isExistingFolder) {
      void fetchNextPage()
    }
  }, [fetchNextPage, folderId, folders, hasNextPage, isFetchingNextPage, isFoldersError, isFoldersPending])

  useEffect(() => {
    if (!folderId || isFoldersPending || isFoldersError || hasNextPage || isFetchingNextPage) return

    const isExistingFolder = folders.some((folder) => folder.id === folderId)
    if (!isExistingFolder) {
      navigate(DIFFICULT_FOLDER_ID, { replace: true })
    }
  }, [folderId, folders, hasNextPage, isFetchingNextPage, isFoldersError, isFoldersPending, navigate])

  return {
    folders,
    folderId,
    selectedFolderId,
    selectedFolder,
    loadMoreRef,
    isFoldersPending,
    isFetchingNextFolders: isFetchingNextPage,
    hasNextFolders: Boolean(hasNextPage),
    isFoldersError,
    navigate,
  }
}
