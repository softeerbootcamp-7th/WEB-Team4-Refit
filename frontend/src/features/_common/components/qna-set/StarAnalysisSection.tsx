import { STAR_LABELS, STAR_VALUES, STATUS_THEME } from '@/constants/retro'
import { Badge, Button } from '@/shared/components'
import type { StarAnalysisResult } from '@/types/interview'

type StarAnalysisSectionProps = {
  starAnalysis: StarAnalysisResult
  onAnalyze: () => void
}

export function StarAnalysisSection({ starAnalysis, onAnalyze }: StarAnalysisSectionProps) {
  const hasAnalysis = !!starAnalysis
  return (
    <>
      {hasAnalysis ? (
        <StarAnalysisResultSection starAnalysis={starAnalysis} />
      ) : (
        onAnalyze && (
          <div className="flex items-center justify-end">
            <Button variant="outline-gray-white" size="xs" onClick={onAnalyze}>
              답변 STAR 분석 하기
            </Button>
          </div>
        )
      )}
    </>
  )
}

type StarAnalysisResultSectionProps = Pick<StarAnalysisSectionProps, 'starAnalysis'>

function StarAnalysisResultSection({ starAnalysis }: StarAnalysisResultSectionProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="body-l-semibold">답변 STAR 분석 결과</span>
      </div>
      <div className="rounded-lg bg-gray-100 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {STAR_LABELS.map(({ key, label }) => {
            const status = starAnalysis[key]
            return (
              <Badge
                key={key}
                type="star-label"
                theme={STATUS_THEME[status]}
                content={`${label} / ${STAR_VALUES[status]}`}
              />
            )
          })}
        </div>
        <p className="body-s-medium">{starAnalysis.overallSummary}</p>
      </div>
    </div>
  )
}
