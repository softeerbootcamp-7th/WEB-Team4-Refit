import { createContext } from 'react'

export type HighlightRect = {
  x: number
  y: number
  width: number
  height: number
  pageNum: number
}

export type HighlightData = {
  text: string
  rects: HighlightRect[]
}

export type HighlightContextType = {
  // PDF 업로드 여부
  hasPdf: boolean
  setHasPdf: (value: boolean) => void

  // 연결 모드
  linkingQnaSetId: number | null
  startLinking: (qnaSetId: number) => void
  cancelLinking: () => void

  // 하이라이트 데이터
  highlights: Map<number, HighlightData>
  saveHighlight: (data: HighlightData) => void
  removeHighlight: (qnaSetId: number) => void

  // 현재 선택된 텍스트
  pendingSelection: HighlightData | null
  setPendingSelection: (data: HighlightData | null) => void
}

export const HighlightContext = createContext<HighlightContextType | null>(null)
