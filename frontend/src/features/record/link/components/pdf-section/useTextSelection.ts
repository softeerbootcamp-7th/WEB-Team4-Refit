import { useCallback } from 'react'
import type { HighlightData, HighlightRect } from '@/features/record/link/contexts'

type UseTextSelectionParams = {
  containerRef: React.RefObject<HTMLElement | null>
  pageNum: number
  isLinkingMode: boolean
  pendingSelection: HighlightData | null
  setPendingSelection: (data: HighlightData | null) => void
}

export function useTextSelection({
  containerRef,
  pageNum,
  isLinkingMode,
  pendingSelection,
  setPendingSelection,
}: UseTextSelectionParams) {
  const handleMouseUp = useCallback(() => {
    if (!isLinkingMode) return

    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || !containerRef.current) return

    const text = selection.toString().trim()
    if (!text) return

    const range = selection.getRangeAt(0)
    const clientRects = range.getClientRects()
    const containerRect = containerRef.current.getBoundingClientRect()

    const rects: HighlightRect[] = Array.from(clientRects).map((rect) => ({
      x: (rect.x - containerRect.x) / containerRect.width,
      y: (rect.y - containerRect.y) / containerRect.height,
      width: rect.width / containerRect.width,
      height: rect.height / containerRect.height,
      pageNum,
    }))

    const merged: HighlightData = pendingSelection
      ? { text: pendingSelection.text + '\n' + text, rects: [...pendingSelection.rects, ...rects] }
      : { text, rects }

    setPendingSelection(merged)
    selection.removeAllRanges()
  }, [isLinkingMode, pageNum, setPendingSelection, pendingSelection, containerRef])

  return { handleMouseUp }
}
