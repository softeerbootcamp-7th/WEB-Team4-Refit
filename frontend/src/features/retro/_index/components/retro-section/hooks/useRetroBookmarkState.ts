import { useState } from 'react'
import { useGetScrapFoldersContainingQnaSet } from '@/apis/generated/qna-set-api/qna-set-api'
import { SCRAP_FOLDERS_STALE_TIME } from '@/constants/queryCachePolicy'

type UseRetroBookmarkStateParams = {
  qnaSetId: number
  isKptStep: boolean
  initialMarkedDifficult: boolean
}

export function useRetroBookmarkState({ qnaSetId, isKptStep, initialMarkedDifficult }: UseRetroBookmarkStateParams) {
  const [markedDifficultByQnaSetId, setMarkedDifficultByQnaSetId] = useState<Record<number, boolean>>({})
  const currentMarkedDifficult = markedDifficultByQnaSetId[qnaSetId] ?? initialMarkedDifficult

  const folderQueryParams = { page: 0, size: 10 }
  const { data: scrapFolderData } = useGetScrapFoldersContainingQnaSet(qnaSetId, folderQueryParams, {
    query: {
      enabled: !isKptStep && qnaSetId > 0,
      staleTime: SCRAP_FOLDERS_STALE_TIME,
    },
  })
  const hasAnyScrapFolder = (scrapFolderData?.result?.content ?? []).some((folder) => folder.contains)
  const isBookmarked = currentMarkedDifficult || hasAnyScrapFolder

  const handleDifficultMarkedChange = (isMarked: boolean) => {
    if (qnaSetId <= 0) return
    setMarkedDifficultByQnaSetId((prev) => ({ ...prev, [qnaSetId]: isMarked }))
  }

  return {
    isBookmarked,
    currentMarkedDifficult,
    handleDifficultMarkedChange,
  }
}
