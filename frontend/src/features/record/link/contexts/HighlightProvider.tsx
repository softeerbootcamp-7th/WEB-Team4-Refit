import { useState, type PropsWithChildren } from 'react'
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query'
import {
  getGetPdfHighlightingsQueryKey,
  getPdfHighlightings,
  useUpdatePdfHighlighting,
} from '@/apis/generated/qna-set-api/qna-set-api'
import { HighlightContext, type HighlightContextType, type HighlightData } from './HighlightContext'

type HighlightProviderProps = PropsWithChildren<{
  qnaSetIds: number[]
  hasPdf: boolean
}>

export function HighlightProvider({ qnaSetIds, hasPdf: initialHasPdf, children }: HighlightProviderProps) {
  const queryClient = useQueryClient()
  const [hasPdf, setHasPdf] = useState(initialHasPdf)
  const highlightResults = useSuspenseQueries({
    queries: (hasPdf ? qnaSetIds : []).map((qnaSetId) => ({
      queryKey: getGetPdfHighlightingsQueryKey(qnaSetId),
      queryFn: () => getPdfHighlightings(qnaSetId),
    })),
  })

  const [linkingQnaSetId, setLinkingQnaSetId] = useState<number | null>(null)
  const [highlights, setHighlights] = useState<Map<number, HighlightData>>(() =>
    buildInitialHighlights(qnaSetIds, highlightResults),
  )

  const [pendingSelection, setPendingSelection] = useState<HighlightData | null>(null)
  const { mutate: updatePdfHighlighting } = useUpdatePdfHighlighting()

  const startLinking = (qnaSetId: number) => {
    setLinkingQnaSetId(qnaSetId)
    setPendingSelection(null)
  }

  const cancelLinking = () => {
    setLinkingQnaSetId(null)
    setPendingSelection(null)
  }

  const saveHighlight = (data: HighlightData) => {
    if (linkingQnaSetId === null) return
    setHighlights((prev) => new Map(prev).set(linkingQnaSetId, data))

    updatePdfHighlighting(
      {
        qnaSetId: linkingQnaSetId,
        data: [
          {
            highlightingText: data.text,
            rects: data.rects.map((r) => ({
              x: r.x,
              y: r.y,
              width: r.width,
              height: r.height,
              pageNumber: r.pageNumber,
            })),
          },
        ],
      },
      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: getGetPdfHighlightingsQueryKey(linkingQnaSetId),
          })
        },
      },
    )

    setLinkingQnaSetId(null)
    setPendingSelection(null)
  }

  const removeHighlight = (qnaSetId: number) => {
    setHighlights((prev) => {
      const next = new Map(prev)
      next.delete(qnaSetId)
      return next
    })

    updatePdfHighlighting(
      { qnaSetId, data: [] },
      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: getGetPdfHighlightingsQueryKey(qnaSetId),
          })
        },
      },
    )
  }

  const clearAllHighlights = () => {
    setHighlights(new Map())
    setLinkingQnaSetId(null)
    setPendingSelection(null)
  }

  const value: HighlightContextType = {
    hasPdf,
    setHasPdf,
    linkingQnaSetId,
    startLinking,
    cancelLinking,
    highlights,
    saveHighlight,
    removeHighlight,
    clearAllHighlights,
    pendingSelection,
    setPendingSelection,
  }

  return <HighlightContext.Provider value={value}>{children}</HighlightContext.Provider>
}

function buildInitialHighlights(
  qnaSetIds: number[],
  results: { data: Awaited<ReturnType<typeof getPdfHighlightings>> }[],
): Map<number, HighlightData> {
  const map = new Map<number, HighlightData>()

  qnaSetIds.forEach((qnaSetId, idx) => {
    const result = results[idx]?.data.result
    if (!result?.length) return

    const first = result[0]
    map.set(qnaSetId, {
      text: first.highlightingText ?? '',
      rects: (first.rects ?? []).map((r) => ({
        x: r.x ?? 0,
        y: r.y ?? 0,
        width: r.width ?? 0,
        height: r.height ?? 0,
        pageNumber: r.pageNumber ?? 1,
      })),
    })
  })

  return map
}
