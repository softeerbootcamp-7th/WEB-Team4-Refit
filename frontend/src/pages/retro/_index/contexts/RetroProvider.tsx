import { useState, type PropsWithChildren } from 'react'
import type { StarAnalysisResult } from '@/types/interview'
import { MOCK_RETRO_LIST } from '../example'
import { RetroContext, type RetroContextType } from './RetroContext'

export function RetroProvider({ children }: PropsWithChildren) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPdfOpen, setIsPdfOpen] = useState(false)
  const [retroTexts, setRetroTexts] = useState<Record<number, string>>({})
  const [starAnalysis, setStarAnalysis] = useState<Record<number, StarAnalysisResult>>({})

  const currentItem = MOCK_RETRO_LIST[currentIndex]
  const isLast = currentIndex === MOCK_RETRO_LIST.length - 1

  const navigate = (targetIndex: number) => {
    // TODO: 현재 문항 저장 API 호출
    setCurrentIndex(targetIndex)
  }

  const togglePdf = () => setIsPdfOpen((v) => !v)

  const updateRetroText = (qnaSetId: number, text: string) => {
    setRetroTexts((prev) => ({ ...prev, [qnaSetId]: text }))
  }

  const updateStarAnalysis = (qnaSetId: number, analysis: StarAnalysisResult) => {
    setStarAnalysis((prev) => ({ ...prev, [qnaSetId]: analysis }))
  }

  const value: RetroContextType = {
    currentIndex,
    currentItem,
    isLast,
    navigate,
    isPdfOpen,
    togglePdf,
    retroTexts,
    updateRetroText,
    starAnalysis,
    updateStarAnalysis,
  }

  return <RetroContext.Provider value={value}>{children}</RetroContext.Provider>
}
