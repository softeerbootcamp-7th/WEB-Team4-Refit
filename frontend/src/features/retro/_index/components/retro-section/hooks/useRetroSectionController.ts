import { useEffect, useState } from 'react'
import type { RetroListItem } from '@/constants/example'
import { useRetroBookmarkState } from './useRetroBookmarkState'
import { useRetroStarAnalysis } from './useRetroStarAnalysis'
import { useRetroStepDrafts } from './useRetroStepDrafts'
import { useRetroStepSave } from './useRetroStepSave'
import type { KptTexts, RetroQuestionStepActions, RetroQuestionStepViewModel } from '../types'

type UseRetroSectionControllerParams = {
  interviewId: number
  currentItem?: RetroListItem
  retroItems: RetroListItem[]
  isKptStep: boolean
  initialKptTexts?: KptTexts
  onRegisterSaveHandler?: (saveHandler: () => Promise<void>) => void
}

export function useRetroSectionController({
  interviewId,
  currentItem,
  retroItems,
  isKptStep,
  initialKptTexts,
  onRegisterSaveHandler,
}: UseRetroSectionControllerParams) {
  const [isScrapModalOpen, setIsScrapModalOpen] = useState(false)

  const {
    questionText,
    answerText,
    qnaSetId,
    initialMarkedDifficult,
    initialStarAnalysis,
    currentRetroText,
    kptTexts,
    setKptTexts,
    isQuestionDirty,
    isKptDirty,
    markQuestionSaved,
    markKptSaved,
    missingRetroNumbers,
    missingKptItems,
    handleRetroTextChange,
  } = useRetroStepDrafts({
    currentItem,
    retroItems,
    initialKptTexts,
  })

  const { starAnalysis, isAnalyzing, handleStarButtonClick } = useRetroStarAnalysis({
    qnaSetId,
    isKptStep,
    initialStarAnalysis,
  })

  const { isBookmarked, currentMarkedDifficult, handleDifficultMarkedChange } = useRetroBookmarkState({
    qnaSetId,
    isKptStep,
    initialMarkedDifficult,
  })

  const { saveError, isSaving, saveCurrentStep } = useRetroStepSave({
    interviewId,
    isKptStep,
    qnaSetId,
    currentRetroText,
    kptTexts,
    isQuestionDirty,
    isKptDirty,
    markQuestionSaved,
    markKptSaved,
  })

  useEffect(() => {
    onRegisterSaveHandler?.(saveCurrentStep)
  }, [onRegisterSaveHandler, saveCurrentStep])

  const questionStep: RetroQuestionStepViewModel = {
    qnaSetId,
    questionText,
    answerText,
    currentRetroText,
    starAnalysis,
    isAnalyzing,
    isBookmarked,
    isScrapModalOpen,
    currentMarkedDifficult,
  }

  const questionStepActions: RetroQuestionStepActions = {
    openScrapModal: () => setIsScrapModalOpen(true),
    closeScrapModal: () => setIsScrapModalOpen(false),
    analyzeStar: handleStarButtonClick,
    changeRetroText: handleRetroTextChange,
    changeDifficultMarked: handleDifficultMarkedChange,
  }

  return {
    steps: {
      question: questionStep,
      kpt: {
        kptTexts,
        setKptTexts,
      },
    },
    actions: {
      question: questionStepActions,
      saveCurrentStep,
    },
    flow: {
      saveError,
      isSaving,
      missingRetroNumbers,
      missingKptItems,
    },
  }
}
