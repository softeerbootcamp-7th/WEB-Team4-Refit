import { useState } from 'react'
import { QnaSetCard, StarAnalysisSection } from '@/features/_common/components/qna-set'
import { KptWriteCard, RetroWriteCard } from '@/features/retro/_common/components'
import { RetroActionBar } from '@/features/retro/_index/components/retro-section/RetroActionBar'
import { Border, FadeScrollArea } from '@/shared/components'
import { MOCK_QNA_SET_LIST } from '@/shared/constants/example'
import type { RetroListItem } from '@/shared/constants/example'
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

  const { questionText, answerText, qnaSetId, isKpt } = currentItem

  const handleStarButtonClick = () => {
    setStarAnalysis((prev) => ({ ...prev, [qnaSetId]: MOCK_QNA_SET_LIST[currentIndex].starAnalysis }))
  }

  const handleRetroTextChange = (text: string) => {
    setRetroTexts((prev) => ({ ...prev, [qnaSetId]: text }))
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
            >
              <StarAnalysisSection starAnalysis={starAnalysis[qnaSetId]} onAnalyze={handleStarButtonClick} />
              <Border />
              <RetroWriteCard
                idx={currentIndex + 1}
                value={retroTexts[qnaSetId] ?? ''}
                onChange={handleRetroTextChange}
              />
            </QnaSetCard>
          </>
        )}
      </FadeScrollArea>
      <RetroActionBar currentIndex={currentIndex} totalCount={totalCount} onIndexChange={onIndexChange} />
    </>
  )
}
