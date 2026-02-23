import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetInterviewFullQueryKey, useUpdateKptSelfReview } from '@/apis/generated/interview-api/interview-api'
import { useUpdateQnaSetSelfReview } from '@/apis/generated/qna-set-api/qna-set-api'

type KptTexts = { keepText?: string; problemText?: string; tryText?: string }

type UseRetroStepSaveParams = {
  interviewId: number
  isKptStep: boolean
  qnaSetId: number
  currentRetroText: string
  kptTexts: KptTexts
  isQuestionDirty: boolean
  isKptDirty: boolean
  markQuestionSaved: (savedText: string) => void
  markKptSaved: (savedTexts: KptTexts) => void
}

export function useRetroStepSave({
  interviewId,
  isKptStep,
  qnaSetId,
  currentRetroText,
  kptTexts,
  isQuestionDirty,
  isKptDirty,
  markQuestionSaved,
  markKptSaved,
}: UseRetroStepSaveParams) {
  const queryClient = useQueryClient()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { mutateAsync: updateQnaSetSelfReview } = useUpdateQnaSetSelfReview()
  const { mutateAsync: updateKptSelfReview } = useUpdateKptSelfReview()

  const saveCurrentStep = useCallback(async () => {
    if (isSaving) return

    setSaveError(null)
    if (isKptStep) {
      if (!isKptDirty) return

      setIsSaving(true)
      try {
        await updateKptSelfReview({
          interviewId,
          data: {
            keepText: kptTexts.keepText,
            problemText: kptTexts.problemText,
            tryText: kptTexts.tryText,
          },
        })
        markKptSaved(kptTexts)
        void queryClient.invalidateQueries({ queryKey: getGetInterviewFullQueryKey(interviewId) })
      } catch {
        setSaveError('KPT 회고 저장에 실패했습니다. 잠시 후 다시 시도해주세요.')
      } finally {
        setIsSaving(false)
      }
      return
    }

    if (qnaSetId <= 0) return

    if (!isQuestionDirty) return

    setIsSaving(true)
    try {
      await updateQnaSetSelfReview({ qnaSetId, data: { selfReviewText: currentRetroText } })
      markQuestionSaved(currentRetroText)
      void queryClient.invalidateQueries({ queryKey: getGetInterviewFullQueryKey(interviewId) })
    } catch {
      setSaveError('질문 회고 저장에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }, [
    currentRetroText,
    interviewId,
    isKptDirty,
    isKptStep,
    isQuestionDirty,
    isSaving,
    kptTexts,
    markKptSaved,
    markQuestionSaved,
    qnaSetId,
    updateKptSelfReview,
    updateQnaSetSelfReview,
  ])

  return {
    saveError,
    isSaving,
    saveCurrentStep,
  }
}
