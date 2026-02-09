import { Badge } from '@/shared/components'
import { STAR_LABELS, STAR_VALUES, STATUS_THEME } from '@/shared/constants/retro'
import type { StarAnalysisResult } from '@/types/interview'

type StarAnalysisSectionProps = {
  analysis: StarAnalysisResult
}

export function StarAnalysisSection({ analysis }: StarAnalysisSectionProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="body-l-semibold">답변 STAR 분석 결과</span>
      </div>
      <div className="border-gray-150 rounded-lg border p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {STAR_LABELS.map(({ key, label }) => {
            const status = analysis[key]
            return (
              <Badge
                key={key}
                type="star-label"
                theme={STATUS_THEME[status]}
                content={`${label} ${STAR_VALUES[status]}`}
              />
            )
          })}
        </div>
        <p className="body-s-medium">{analysis.overallSummary}</p>
      </div>
    </div>
  )
}
