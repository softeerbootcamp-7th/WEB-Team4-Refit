import { StarAnalysisSection } from '@/pages/retro/_index/components/retro-section/StarAnalysisSection'
import { Badge, Border, Button } from '@/shared/components'
import type { StarAnalysisResult } from '@/types/interview'

type QnaSetCardProps = {
  idx: number
  questionText: string
  answerText: string
  starAnalysis?: StarAnalysisResult
  onAnalyze?: () => void
}

export function QnaSetCard({ idx, questionText, answerText, starAnalysis, onAnalyze }: QnaSetCardProps) {
  return (
    <div className="bg-gray-white flex flex-col gap-4 rounded-lg p-5">
      <div className="inline-flex flex-wrap items-center gap-2.5">
        <Badge type="question-label" theme="gray-100" content={`${idx}번 질문`} />
        <span className="title-m-semibold">{questionText}</span>
      </div>
      <Border />
      <p className="body-m-regular mb-2 text-gray-800">{answerText}</p>
      {starAnalysis ? (
        <StarAnalysisSection analysis={starAnalysis} />
      ) : (
        onAnalyze && (
          <div className="flex items-center justify-end">
            <Button variant="outline-gray-white" size="xs" onClick={onAnalyze}>
              답변 STAR 분석 하기
            </Button>
          </div>
        )
      )}
    </div>
  )
}
