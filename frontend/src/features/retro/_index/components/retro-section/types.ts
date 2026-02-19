import type { Dispatch, SetStateAction } from 'react'
import type { StarAnalysisResult } from '@/types/interview'

export type KptTexts = {
  keepText?: string
  problemText?: string
  tryText?: string
}

export type RetroQuestionStepViewModel = {
  qnaSetId: number
  questionText: string
  answerText: string
  currentRetroText: string
  starAnalysis?: StarAnalysisResult
  isAnalyzing: boolean
  isBookmarked: boolean
  isScrapModalOpen: boolean
  currentMarkedDifficult: boolean
}

export type RetroQuestionStepActions = {
  openScrapModal: () => void
  closeScrapModal: () => void
  analyzeStar: () => void
  changeRetroText: (text: string) => void
  changeDifficultMarked: (isMarked: boolean) => void
}

export type RetroKptStepState = {
  kptTexts: KptTexts
  setKptTexts: Dispatch<SetStateAction<KptTexts>>
}

export type RetroSectionFlowState = {
  saveError: string | null
  isSaving: boolean
  missingRetroNumbers: number[]
}

export type RetroListItem = {
  qnaSetId: number
  questionText: string
  answerText: string
  qnaSetSelfReviewText: string
  isMarkedDifficult: boolean
  starAnalysis?: StarAnalysisResult
}
