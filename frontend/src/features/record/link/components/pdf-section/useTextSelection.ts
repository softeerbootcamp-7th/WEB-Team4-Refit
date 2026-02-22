import { useCallback } from 'react'
import type { HighlightData, HighlightRect } from '@/features/record/link/contexts'

const RECT_KEY_PRECISION = 4

type UseTextSelectionParams = {
  containerRef: React.RefObject<HTMLElement | null>
  pageNumber: number
  isLinkingMode: boolean
  pendingSelection: HighlightData | null
  setPendingSelection: (data: HighlightData | null) => void
}

export function useTextSelection({
  containerRef,
  pageNumber,
  isLinkingMode,
  pendingSelection,
  setPendingSelection,
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

    const { mergedRects, hasNewRects } = mergeUniqueRects(pendingSelection?.rects ?? [], rects)

    if (!hasNewRects && pendingSelection) {
      selection.removeAllRanges()
      return
    }

    const mergedText = mergeUniqueHighlightText(pendingSelection?.text, text)
    const merged: HighlightData = { text: mergedText, rects: mergedRects }

    setPendingSelection(merged)
    selection.removeAllRanges()
  }, [isLinkingMode, pageNumber, setPendingSelection, pendingSelection, containerRef])

  return { handleMouseUp }
}

function mergeUniqueRects(
  existingRects: HighlightRect[],
  selectedRects: HighlightRect[],
): { mergedRects: HighlightRect[]; hasNewRects: boolean } {
  const mergedRects: HighlightRect[] = []
  const seen = new Set<string>()

  // 기존 rect 순서는 유지하면서 좌표 중복만 제거
  for (const rect of existingRects) {
    const key = getHighlightRectKey(rect)
    if (seen.has(key)) continue
    seen.add(key)
    mergedRects.push(rect)
  }

  const existingCount = mergedRects.length

  // 이미 있는 좌표를 제외하고 새로 선택한 rect만 뒤에 붙임
  for (const rect of selectedRects) {
    const key = getHighlightRectKey(rect)
    if (seen.has(key)) continue
    seen.add(key)
    mergedRects.push(rect)
  }

  return {
    mergedRects,
    hasNewRects: mergedRects.length > existingCount,
  }
}

function getHighlightRectKey(rect: HighlightRect): string {
  return [
    rect.pageNumber,
    roundRectValue(rect.x),
    roundRectValue(rect.y),
    roundRectValue(rect.width),
    roundRectValue(rect.height),
  ].join(':')
}

function roundRectValue(value: number): number {
  return Number(value.toFixed(RECT_KEY_PRECISION))
}

function mergeUniqueHighlightText(previousText: string | undefined, selectedText: string): string {
  const merged: string[] = []
  const seen = new Set<string>()

  appendUniqueTextSegments(previousText, merged, seen)
  appendUniqueTextSegments(selectedText, merged, seen)

  return merged.join('\n')
}

function appendUniqueTextSegments(rawText: string | undefined, merged: string[], seen: Set<string>) {
  if (!rawText) return

  for (const segment of rawText.split('\n')) {
    const trimmedSegment = segment.trim()
    if (!trimmedSegment) continue

    const normalizedSegment = normalizeTextSegment(trimmedSegment)
    if (seen.has(normalizedSegment)) continue

    seen.add(normalizedSegment)
    merged.push(trimmedSegment)
  }
}

// 공백을 한 칸으로 정규화하여 같은 문장이 중복으로 쌓이지 않게 함
function normalizeTextSegment(segment: string): string {
  return segment.replace(/\s+/g, ' ').trim()
}
