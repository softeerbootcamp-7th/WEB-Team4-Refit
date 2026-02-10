import { useState, type PropsWithChildren } from 'react'
import { HighlightContext, type HighlightContextType, type HighlightData } from './HighlightContext'

export function HighlightProvider({ children }: PropsWithChildren) {
  const [hasPdf, setHasPdf] = useState(false)
  const [linkingQnaSetId, setLinkingQnaSetId] = useState<number | null>(null)
  const [highlights, setHighlights] = useState<Map<number, HighlightData>>(new Map())
  const [pendingSelection, setPendingSelection] = useState<HighlightData | null>(null)

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
    setLinkingQnaSetId(null)
    setPendingSelection(null)
  }

  const removeHighlight = (qnaSetId: number) => {
    setHighlights((prev) => {
      const next = new Map(prev)
      next.delete(qnaSetId)
      return next
    })
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
    pendingSelection,
    setPendingSelection,
  }

  return <HighlightContext.Provider value={value}>{children}</HighlightContext.Provider>
}
