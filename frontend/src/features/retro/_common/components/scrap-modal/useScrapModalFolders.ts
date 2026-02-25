import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  getGetScrapFoldersContainingQnaSetQueryKey,
  useGetScrapFoldersContainingQnaSet,
} from '@/apis/generated/qna-set-api/qna-set-api'
import { getGetMyScrapFoldersQueryKey } from '@/apis/generated/scrap-folder-api/scrap-folder-api'
import { SCRAP_FOLDERS_STALE_TIME } from '@/constants/queryCachePolicy'

const FOLDER_QUERY_PARAMS = { page: 0, size: 10 } as const

export function useScrapModalFolders(qnaSetId: number, isOpen: boolean) {
  const queryClient = useQueryClient()
  const { data } = useGetScrapFoldersContainingQnaSet(qnaSetId, FOLDER_QUERY_PARAMS, {
    query: {
      enabled: isOpen && qnaSetId > 0,
      staleTime: SCRAP_FOLDERS_STALE_TIME,
    },
  })

  const folders = useMemo(() => data?.result?.content ?? [], [data?.result?.content])
  const initialSelectedIds = useMemo(
    () =>
      new Set(
        folders
          .filter((folder) => folder.contains && folder.scrapFolderId)
          .map((folder) => folder.scrapFolderId as number),
      ),
    [folders],
  )

  const invalidateCurrentQnaSetFolders = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: getGetScrapFoldersContainingQnaSetQueryKey(qnaSetId, FOLDER_QUERY_PARAMS),
      }),
    [qnaSetId, queryClient],
  )

  const invalidateAllQnaSetFoldersAndFolderList = useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({
          predicate: (query) => {
            const [head] = query.queryKey
            return typeof head === 'string' && head.startsWith('/qna-set/') && head.endsWith('/scrap-folder')
          },
        }),
        queryClient.invalidateQueries({
          queryKey: getGetMyScrapFoldersQueryKey(),
        }),
      ]),
    [queryClient],
  )

  return {
    folders,
    initialSelectedIds,
    invalidateCurrentQnaSetFolders,
    invalidateAllQnaSetFoldersAndFolderList,
  }
}
