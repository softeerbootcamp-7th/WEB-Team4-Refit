import { useMemo, useState } from 'react'
import type { RetroListItem } from '@/constants/example'

type KptTexts = { keepText?: string; problemText?: string; tryText?: string }

type UseRetroStepDraftsParams = {
  currentItem?: RetroListItem
  retroItems: RetroListItem[]
  initialKptTexts?: KptTexts
}

export function useRetroStepDrafts({ currentItem, retroItems, initialKptTexts }: UseRetroStepDraftsParams) {
  const [retroTexts, setRetroTexts] = useState<Record<number, string>>({})
  const [kptTexts, setKptTexts] = useState({
    keepText: initialKptTexts?.keepText ?? '',
    problemText: initialKptTexts?.problemText ?? '',
    tryText: initialKptTexts?.tryText ?? '',
  })
  const [savedRetroTexts, setSavedRetroTexts] = useState<Record<number, string>>({})
  const [savedKptTexts, setSavedKptTexts] = useState<KptTexts | null>(null)

  const questionText = currentItem?.questionText ?? ''
  const answerText = currentItem?.answerText ?? ''
  const qnaSetId = currentItem?.qnaSetId ?? -1
  const initialSelfReviewText = currentItem?.qnaSetSelfReviewText ?? ''
  const initialMarkedDifficult = currentItem?.isMarkedDifficult ?? false
  const initialStarAnalysis = currentItem?.starAnalysis
  const currentRetroText = retroTexts[qnaSetId] ?? initialSelfReviewText

  const normalizedInitialKptTexts = useMemo(
    () => ({
      keepText: initialKptTexts?.keepText ?? '',
      problemText: initialKptTexts?.problemText ?? '',
      tryText: initialKptTexts?.tryText ?? '',
    }),
    [initialKptTexts],
  )

  const missingRetroNumbers = useMemo(
    () =>
      retroItems
        .map((item, index) => {
          const text = retroTexts[item.qnaSetId] ?? item.qnaSetSelfReviewText ?? ''
          return text.trim().length === 0 ? index + 1 : null
        })
        .filter((value): value is number => value !== null),
    [retroItems, retroTexts],
  )

  const handleRetroTextChange = (text: string) => {
    if (qnaSetId <= 0) return
    setRetroTexts((prev) => ({ ...prev, [qnaSetId]: text }))
  }

  const questionBaselineText = savedRetroTexts[qnaSetId] ?? initialSelfReviewText
  const isQuestionDirty = qnaSetId > 0 && currentRetroText !== questionBaselineText

  const kptBaselineTexts = savedKptTexts ?? normalizedInitialKptTexts
  const isKptDirty =
    kptTexts.keepText !== kptBaselineTexts.keepText ||
    kptTexts.problemText !== kptBaselineTexts.problemText ||
    kptTexts.tryText !== kptBaselineTexts.tryText

  const markQuestionSaved = (savedText: string) => {
    if (qnaSetId <= 0) return
    setSavedRetroTexts((prev) => ({ ...prev, [qnaSetId]: savedText }))
  }

  const markKptSaved = (savedTexts: KptTexts) => {
    setSavedKptTexts({
      keepText: savedTexts.keepText ?? '',
      problemText: savedTexts.problemText ?? '',
      tryText: savedTexts.tryText ?? '',
    })
  }

  return {
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
    handleRetroTextChange,
  }
}
