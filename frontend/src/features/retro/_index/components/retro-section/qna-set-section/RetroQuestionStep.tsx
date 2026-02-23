import { QnaSetCard, StarAnalysisSection } from '@/features/_common/components/qna-set'
import { RetroWriteCard, ScrapModal } from '@/features/retro/_common/components'
import { BookmarkIcon } from '@/ui/assets'
import { Border, Button } from '@/ui/components'
import type { RetroQuestionStepActions, RetroQuestionStepViewModel } from '../types'

type RetroQuestionStepProps = {
  currentIndex: number
  viewModel: RetroQuestionStepViewModel
  actions: RetroQuestionStepActions
}

export function RetroQuestionStep({ currentIndex, viewModel, actions }: RetroQuestionStepProps) {
  const {
    qnaSetId,
    questionText,
    answerText,
    currentRetroText,
    starAnalysis,
    isAnalyzing,
    isBookmarked,
    isScrapModalOpen,
    currentMarkedDifficult,
  } = viewModel

  return (
    <>
      <QnaSetCard
        key={qnaSetId}
        idx={currentIndex + 1}
        questionText={questionText}
        answerText={answerText}
        badgeTheme="gray-100"
        topRightComponent={
          <Button onClick={actions.openScrapModal}>
            <BookmarkIcon className={`h-5 w-5 ${isBookmarked ? 'text-gray-400' : 'text-gray-white'}`} />
          </Button>
        }
      >
        <StarAnalysisSection starAnalysis={starAnalysis} isAnalyzing={isAnalyzing} onAnalyze={actions.analyzeStar} />
        <Border />
        <RetroWriteCard idx={currentIndex + 1} value={currentRetroText} onChange={actions.changeRetroText} />
      </QnaSetCard>
      <ScrapModal
        isOpen={isScrapModalOpen}
        onClose={actions.closeScrapModal}
        qnaSetId={qnaSetId}
        isMarkedDifficult={currentMarkedDifficult}
        onDifficultMarkedChange={actions.changeDifficultMarked}
      />
    </>
  )
}
