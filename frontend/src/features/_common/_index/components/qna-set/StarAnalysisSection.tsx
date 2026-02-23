import { STAR_LABELS, STAR_VALUES, STATUS_THEME } from '@/constants/retro'
import type { StarAnalysisResult } from '@/types/interview'
import { Badge, Button } from '@/ui/components'

type StarAnalysisSectionProps = {
  starAnalysis?: StarAnalysisResult
  isAnalyzing?: boolean
  onAnalyze: () => void
}

export function StarAnalysisSection({ starAnalysis, isAnalyzing = false, onAnalyze }: StarAnalysisSectionProps) {
  const hasAnalysis = !!starAnalysis
  return (
    <>
      {hasAnalysis ? (
        <StarAnalysisResultSection starAnalysis={starAnalysis} />
      ) : isAnalyzing ? (
        <StarAnalysisSkeleton />
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

export function StarAnalysisResultSection({ starAnalysis }: StarAnalysisResultSectionProps) {
  if (!starAnalysis) return null

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

function StarAnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="body-l-semibold">답변 STAR 분석 중...</span>
      </div>
      <div className="rounded-lg bg-gray-100 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {['S', 'T', 'A', 'R'].map((label) => (
            <div key={label} className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
          ))}
        </div>
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}
