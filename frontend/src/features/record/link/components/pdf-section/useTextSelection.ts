import { useCallback } from 'react'
import type { HighlightData, HighlightRect } from '@/features/record/link/contexts'

type UseTextSelectionParams = {
  containerRef: React.RefObject<HTMLElement | null>
  pageNumber: number
  isLinkingMode: boolean
  pendingSelection: HighlightData | null
  setPendingSelection: (data: HighlightData | null) => void
  highlights: Map<number, HighlightData>
  linkingQnaSetId: number | null
}

export function useTextSelection({
  containerRef,
  pageNumber,
  isLinkingMode,
  pendingSelection,
  setPendingSelection,
  highlights,
  linkingQnaSetId,
}: UseTextSelectionParams) {
  const handleMouseUp = useCallback(() => {
    if (!isLinkingMode) {
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed && selection.toString().trim()) {
        alert("먼저 질문의 '자기소개서 연결하기' 버튼을 눌러주세요.")
        selection.removeAllRanges()
      }
      return
    }

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
      pageNumber,
    }))

    // 같은 qnaSet에 이미 저장된 하이라이트에 포함된 선택이면 무시
    const currentHighlight = linkingQnaSetId !== null ? highlights.get(linkingQnaSetId) : undefined
    if (currentHighlight && areAllRectsAlreadyIn(rects, currentHighlight.rects)) {
      selection.removeAllRanges()
      return
    }

    // 현재 pending에 이미 포함된 선택이면 무시
    if (pendingSelection && areAllRectsAlreadyIn(rects, pendingSelection.rects)) {
      selection.removeAllRanges()
      return
    }

    const merged: HighlightData = {
      text: pendingSelection ? `${pendingSelection.text}\n${text}` : text,
      rects: [...(pendingSelection?.rects ?? []), ...rects],
    }

    setPendingSelection(merged)
    selection.removeAllRanges()
  }, [isLinkingMode, pageNumber, setPendingSelection, pendingSelection, containerRef, highlights, linkingQnaSetId])

  return { handleMouseUp }
}

// 브라우저 getBoundingClientRect()의 부동소수점 오차(~1e-10 ~ 1e-6)를 흡수하기 위한 허용 범위
const EPSILON = 1e-4

// 새로 선택한 rect가 모두 기존 rect 목록에 이미 존재하면 true
function areAllRectsAlreadyIn(newRects: HighlightRect[], existing: HighlightRect[]): boolean {
  return newRects.every((nr) =>
    existing.some(
      (er) =>
        er.pageNumber === nr.pageNumber &&
        Math.abs(er.x - nr.x) < EPSILON &&
        Math.abs(er.y - nr.y) < EPSILON &&
        Math.abs(er.width - nr.width) < EPSILON &&
        Math.abs(er.height - nr.height) < EPSILON,
    ),
  )
}
