import { useState } from 'react'
import { MOCK_QNA_SET_LIST, type RetroListItem } from '@/constants/example'
import { BookmarkIcon } from '@/designs/assets'
import { Border, Button, FadeScrollArea } from '@/designs/components'
import { QnaSetCard, StarAnalysisSection } from '@/features/_common/components/qna-set'
import { KptWriteCard, RetroWriteCard } from '@/features/retro/_common/components'
import { ScrapModal } from '@/features/retro/_common/components/ScrapModal'
import { RetroActionBar } from '@/features/retro/_index/components/retro-section/RetroActionBar'
import type { StarAnalysisResult } from '@/types/interview'

type RetroSectionProps = {
  currentIndex: number
  currentItem: RetroListItem
  totalCount: number
  onIndexChange: (index: number) => void
}

export function RetroSection({ currentIndex, currentItem, totalCount, onIndexChange }: RetroSectionProps) {
  // TODO: 훅 분리
  const [retroTexts, setRetroTexts] = useState<Record<number, string>>({})
  const [starAnalysis, setStarAnalysis] = useState<Record<number, StarAnalysisResult>>({})
  const [isScrapModalOpen, setIsScrapModalOpen] = useState(false)

  // TODO: STAR 분석, KPT 자기회고 API 연동 필요
  // const { mutate: createStarAnalysis } = useCreateStarAnalysis()
  // const { mutate: updateKptSelfReview } = useUpdateKptSelfReview()

  const { questionText, answerText, qnaSetId, isKpt } = currentItem

  const handleStarButtonClick = () => {
    // TODO: star 분석 API 연동 필요
    setStarAnalysis((prev) => ({ ...prev, [qnaSetId]: MOCK_QNA_SET_LIST[currentIndex].starAnalysis }))
  }

  const handleRetroTextChange = (text: string) => {
    setRetroTexts((prev) => ({ ...prev, [qnaSetId]: text }))
  }

  const handleSaveRetro = () => {
    if (isKpt) {
      // KPT 저장 API
    } else {
      // TODO: 회고 수정 API 연동 필요
      // const selfReviewText = retroTexts[qnaSetId] ?? ''
      // updateQnaSet({ qnaSetId, data: { selfReviewText } })
    }
  }

  return (
    <>
      <FadeScrollArea className="flex flex-1 flex-col gap-5 overflow-y-auto rounded-lg">
        {isKpt ? (
          <KptWriteCard />
        ) : (
          <>
            <QnaSetCard
              key={qnaSetId}
              idx={currentIndex + 1}
              questionText={questionText}
              answerText={answerText}
              badgeTheme="gray-100"
              topRightComponent={
                <Button onClick={() => setIsScrapModalOpen(true)}>
                  <BookmarkIcon className="h-5 w-5" />
                </Button>
              }
            >
              <StarAnalysisSection starAnalysis={starAnalysis[qnaSetId]} onAnalyze={handleStarButtonClick} />
              <Border />
              <RetroWriteCard
                idx={currentIndex + 1}
                value={retroTexts[qnaSetId] ?? ''}
                onChange={handleRetroTextChange}
              />
            </QnaSetCard>
            <ScrapModal isOpen={isScrapModalOpen} onClose={() => setIsScrapModalOpen(false)} qnaSetId={qnaSetId} />
          </>
        )}
      </FadeScrollArea>
      <RetroActionBar
        currentIndex={currentIndex}
        totalCount={totalCount}
        onIndexChange={onIndexChange}
        onSaveRetro={handleSaveRetro}
      />
    </>
  )
}
