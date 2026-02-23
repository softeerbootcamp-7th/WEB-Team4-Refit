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
  const [saveErrors, setSaveErrors] = useState<Map<number, string>>(new Map())
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
    const prevHighlight = highlights.get(linkingQnaSetId)

    if (prevHighlight && isHighlightEqual(prevHighlight, data)) {
      setLinkingQnaSetId(null)
      setPendingSelection(null)
      return
    }

    setHighlights((prev) => new Map(prev).set(linkingQnaSetId, data))
    setSaveErrors((prev) => {
      const next = new Map(prev)
      next.delete(linkingQnaSetId)
      return next
    })

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
        onError: () => {
          setHighlights((prev) => {
            const next = new Map(prev)
            if (prevHighlight) {
              next.set(linkingQnaSetId, prevHighlight)
            } else {
              next.delete(linkingQnaSetId)
            }
            return next
          })
          setSaveErrors((prev) =>
            new Map(prev).set(linkingQnaSetId, '자기소개서 연결에 실패했습니다. 다시 시도해주세요.'),
          )
        },
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
    saveErrors,
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

function isHighlightEqual(a: HighlightData, b: HighlightData): boolean {
  if (a.text !== b.text) return false
  if (a.rects.length !== b.rects.length) return false
  return a.rects.every(
    (r, i) =>
      r.pageNumber === b.rects[i].pageNumber &&
      r.x === b.rects[i].x &&
      r.y === b.rects[i].y &&
      r.width === b.rects[i].width &&
      r.height === b.rects[i].height,
  )
}
