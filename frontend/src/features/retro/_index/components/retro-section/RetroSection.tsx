import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCompleteSelfReview } from '@/apis/generated/interview-api/interview-api'
import { FadeScrollArea } from '@/designs/components'
import { KptWriteCard } from '@/features/retro/_common/components'
import { RetroActionBar } from '@/features/retro/_index/components/retro-section/action-bar/RetroActionBar'
import type { RetroListItem } from '@/features/retro/_index/components/retro-section/types'
import { ROUTES } from '@/routes/routes'
import { RetroCompleteConfirmModal } from './complete-confirm-modal/RetroCompleteConfirmModal'
import { RetroCompleteResultModal } from './complete-result-modal/RetroCompleteResultModal'
import { useRetroSectionController } from './hooks/useRetroSectionController'
import { RetroQuestionStep } from './qna-set-section/RetroQuestionStep'

type RetroSectionProps = {
  interviewId: number
  currentIndex: number
  currentItem?: RetroListItem
  retroItems: RetroListItem[]
  isKptStep: boolean
  totalCount: number
  onIndexChange: (index: number) => Promise<void>
  onRegisterSaveHandler?: (saveHandler: () => Promise<void>) => void
  initialKptTexts?: { keepText?: string; problemText?: string; tryText?: string }
}

export function RetroSection({
  interviewId,
  currentIndex,
  currentItem,
  retroItems,
  isKptStep,
  totalCount,
  onIndexChange,
  onRegisterSaveHandler,
  initialKptTexts,
}: RetroSectionProps) {
  const navigate = useNavigate()
  const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false)
  const [isCompleteResultOpen, setIsCompleteResultOpen] = useState(false)
  const { mutateAsync: completeSelfReview } = useCompleteSelfReview()
  const retro = useRetroSectionController({
    interviewId,
    currentItem,
    retroItems,
    isKptStep,
    initialKptTexts,
    onRegisterSaveHandler,
  })

  const handlePrev = async () => {
    await onIndexChange(currentIndex - 1)
  }

  const handleNext = async () => {
    await onIndexChange(currentIndex + 1)
  }

  const handleComplete = async () => {
    await retro.actions.saveCurrentStep()
    if (retro.flow.missingRetroNumbers.length > 0 || retro.flow.missingKptItems.length > 0) {
      setIsCompleteConfirmOpen(true)
      return
    }
    await completeSelfReview({ interviewId })
    setIsCompleteResultOpen(true)
  }

  const handleConfirmComplete = async () => {
    setIsCompleteConfirmOpen(false)
    await completeSelfReview({ interviewId })
    setIsCompleteResultOpen(true)
  }

  const handleCompleteResultClose = () => {
    setIsCompleteResultOpen(false)
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <>
      <FadeScrollArea className="flex flex-1 flex-col gap-5 overflow-y-auto rounded-lg">
        {isKptStep ? (
          <KptWriteCard defaultValue={retro.steps.kpt.kptTexts} onChange={retro.steps.kpt.setKptTexts} />
        ) : (
          <RetroQuestionStep
            currentIndex={currentIndex}
            viewModel={retro.steps.question}
            actions={retro.actions.question}
          />
        )}
      </FadeScrollArea>
      {retro.flow.saveError ? <p className="body-s-medium mt-3 text-red-500">{retro.flow.saveError}</p> : null}
      <RetroActionBar
        currentIndex={currentIndex}
        totalCount={totalCount}
        onPrev={handlePrev}
        onNext={handleNext}
        onComplete={handleComplete}
        isSaving={retro.flow.isSaving}
      />
      <RetroCompleteConfirmModal
        open={isCompleteConfirmOpen}
        missingRetroNumbers={retro.flow.missingRetroNumbers}
        missingKptItems={retro.flow.missingKptItems}
        onCancel={() => setIsCompleteConfirmOpen(false)}
        onConfirm={handleConfirmComplete}
      />
      <RetroCompleteResultModal
        open={isCompleteResultOpen}
        onClose={handleCompleteResultClose}
        onConfirm={handleCompleteResultClose}
      />
    </>
  )
}
