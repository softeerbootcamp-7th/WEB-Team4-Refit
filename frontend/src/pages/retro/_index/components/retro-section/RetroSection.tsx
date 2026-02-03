import { useState } from 'react'
import { KptWriteCard, QnaSetCard, RetroActionBar, RetroWriteCard } from '@/pages/retro/_index/components/retro-section'
import { useRetroContext } from '@/pages/retro/_index/contexts'
import { MOCK_STAR_ANALYSIS } from '@/pages/retro/_index/example'
import { FileIcon } from '@/shared/assets'
import { Button, FadeScrollArea } from '@/shared/components'
import type { StarAnalysisResult } from '@/types/interview'
import { MOCK_INTERVIEW_INFO_DATA } from '../../example'

type RetroSectionProps = {
  isPdfOpen: boolean
  togglePdf: () => void
}

export function RetroSection({ isPdfOpen, togglePdf }: RetroSectionProps) {
  const { currentIndex, currentItem } = useRetroContext()
  // TODO: 훅 분리
  const [retroTexts, setRetroTexts] = useState<Record<number, string>>({})
  const [starAnalysis, setStarAnalysis] = useState<Record<number, StarAnalysisResult>>({})

  const { questionText, answerText, qnaSetId, isKpt } = currentItem

  const title = `${MOCK_INTERVIEW_INFO_DATA.company} ${MOCK_INTERVIEW_INFO_DATA.jobRole} ${MOCK_INTERVIEW_INFO_DATA.interviewType} 회고 작성`

  const handleStarButtonClick = () => {
    setStarAnalysis((prev) => ({ ...prev, [qnaSetId]: MOCK_STAR_ANALYSIS }))
  }

  const handleRetroTextChange = (text: string) => {
    setRetroTexts((prev) => ({ ...prev, [qnaSetId]: text }))
  }

  return (
    <div className="flex h-full flex-col gap-5 overflow-hidden p-6">
      <div className="flex items-center gap-3">
        <h1 className="title-xl-bold">{title}</h1>
        <Button variant="outline-gray-150" size="xs" onClick={togglePdf} className="caption-l-medium text-gray-600">
          <FileIcon className="h-4 w-4" />
          {isPdfOpen ? '닫기' : '자기소개서 pdf 열기'}
        </Button>
      </div>
      <FadeScrollArea className="flex flex-1 flex-col gap-5 overflow-y-auto rounded-lg">
        {isKpt ? (
          <KptWriteCard />
        ) : (
          <>
            <QnaSetCard
              key={currentIndex}
              idx={currentIndex + 1}
              questionText={questionText}
              answerText={answerText}
              starAnalysis={starAnalysis[qnaSetId]}
              onAnalyze={handleStarButtonClick}
            />
            <RetroWriteCard
              idx={currentIndex + 1}
              value={retroTexts[qnaSetId] ?? ''}
              onChange={handleRetroTextChange}
            />
          </>
        )}
      </FadeScrollArea>
      <RetroActionBar />
    </div>
  )
}
