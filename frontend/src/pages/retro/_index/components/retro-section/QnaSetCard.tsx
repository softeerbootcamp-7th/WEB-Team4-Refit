import { StarAnalysisSection } from '@/pages/retro/_index/components/retro-section'
import { useRetroContext } from '@/pages/retro/_index/contexts'
import { MOCK_STAR_ANALYSIS } from '@/pages/retro/_index/example'
import { Badge, Border, Button } from '@/shared/components'

type QnaSetCardProps = {
  idx: number
  qnaSetId: number
  questionText: string
  answerText: string
}

export function QnaSetCard({ idx, qnaSetId, questionText, answerText }: QnaSetCardProps) {
  const { starAnalysis, updateStarAnalysis } = useRetroContext()
  const analysis = starAnalysis[qnaSetId]
  const isStarAnalyzed = !!analysis

  const handleStarButtonClick = () => {
    // TODO: StarAnalysisSection 이나 버튼 로딩 처리
    updateStarAnalysis(qnaSetId, MOCK_STAR_ANALYSIS)
  }
  return (
    <div className="bg-gray-white flex flex-col gap-4 rounded-lg p-5">
      <div className="inline-flex flex-wrap items-center gap-2.5">
        <Badge type="question-label" theme="gray-100" content={`${idx}번 질문`} />
        <span className="title-m-semibold">{questionText}</span>
      </div>
      <Border />
      <p className="body-m-regular mb-2 text-gray-800">{answerText}</p>
      {isStarAnalyzed && analysis ? (
        <StarAnalysisSection analysis={analysis} />
      ) : (
        <div className="flex items-center justify-end">
          <Button variant="outline-gray-white" size="xs" onClick={handleStarButtonClick}>
            답변 STAR 분석 하기
          </Button>
        </div>
      )}
    </div>
  )
}
