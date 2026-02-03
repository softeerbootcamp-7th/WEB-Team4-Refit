import { createContext } from 'react'
import type { StarAnalysisResult } from '@/types/interview'
import type { RetroListItem } from '../example'

export type RetroContextType = {
  currentIndex: number
  currentItem: RetroListItem
  isLast: boolean
  navigate: (targetIndex: number) => void
  isPdfOpen: boolean
  togglePdf: () => void
  retroTexts: Record<number, string>
  updateRetroText: (qnaSetId: number, text: string) => void
  starAnalysis: Record<number, StarAnalysisResult>
  updateStarAnalysis: (qnaSetId: number, analysis: StarAnalysisResult) => void
}

export const RetroContext = createContext<RetroContextType | null>(null)
