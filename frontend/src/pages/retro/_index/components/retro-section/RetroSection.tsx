import { KptWriteCard, QnaSetCard, RetroActionBar, RetroWriteCard } from '@/pages/retro/_index/components/retro-section'
import { useRetroContext } from '@/pages/retro/_index/contexts'
import { FileIcon } from '@/shared/assets'
import { Button, FadeScrollArea } from '@/shared/components'
import { MOCK_INTERVIEW_INFO_DATA } from '../../example'

export function RetroSection() {
  const { currentIndex, currentItem, isPdfOpen, togglePdf } = useRetroContext()

  const title = `${MOCK_INTERVIEW_INFO_DATA.company} ${MOCK_INTERVIEW_INFO_DATA.jobRole} ${MOCK_INTERVIEW_INFO_DATA.interviewType} 회고 작성`

  if (!currentItem) return null

  return (
    <div className="flex h-full flex-col gap-5 overflow-hidden p-6">
      <div className="flex items-center gap-3">
        <h1 className="title-xl-bold">{title}</h1>
        <Button variant="outline-gray-150" size="xs" onClick={togglePdf} className="caption-l-medium text-gray-600">
          <FileIcon className="h-4 w-4" />
          {isPdfOpen ? '자기소개서 pdf 닫기' : '자기소개서 pdf 열기'}
        </Button>
      </div>
      <FadeScrollArea className="flex flex-1 flex-col gap-5 overflow-y-auto rounded-lg">
        {currentItem.isKpt ? (
          <KptWriteCard />
        ) : (
          <>
            <QnaSetCard
              key={currentIndex}
              idx={currentIndex + 1}
              qnaSetId={currentItem.qnaSetId}
              questionText={currentItem.questionText}
              answerText={currentItem.answerText}
            />
            <RetroWriteCard idx={currentIndex + 1} qnaSetId={currentItem.qnaSetId} />
          </>
        )}
      </FadeScrollArea>

      <RetroActionBar />
    </div>
  )
}
