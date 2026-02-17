import { useState } from 'react'
import { useCreateStarAnalysis } from '@/apis/generated/qna-set-api/qna-set-api'
import type { StarAnalysisResult } from '@/types/interview'

type UseRetroStarAnalysisParams = {
  qnaSetId: number
  isKptStep: boolean
  initialStarAnalysis?: StarAnalysisResult
}

export function useRetroStarAnalysis({ qnaSetId, isKptStep, initialStarAnalysis }: UseRetroStarAnalysisParams) {
  const [starAnalysisByQnaSetId, setStarAnalysisByQnaSetId] = useState<Record<number, StarAnalysisResult>>({})
  const [analyzingQnaSetIds, setAnalyzingQnaSetIds] = useState<Set<number>>(new Set())
  const { mutate: createStarAnalysis } = useCreateStarAnalysis()

  const handleStarButtonClick = () => {
    if (isKptStep || qnaSetId <= 0) return
    if (analyzingQnaSetIds.has(qnaSetId)) return

    setAnalyzingQnaSetIds((prev) => new Set(prev).add(qnaSetId))
    createStarAnalysis(
      { qnaSetId },
      {
        onSuccess: (response) => {
          const result = response.result
          if (!result) return

          setStarAnalysisByQnaSetId((prev) => ({
            ...prev,
            [qnaSetId]: {
              sInclusionLevel: result.sInclusionLevel,
              tInclusionLevel: result.tInclusionLevel,
              aInclusionLevel: result.aInclusionLevel,
              rInclusionLevel: result.rInclusionLevel,
              overallSummary: result.overallSummary ?? '',
            },
          }))
        },
        onSettled: () => {
          setAnalyzingQnaSetIds((prev) => {
            const next = new Set(prev)
            next.delete(qnaSetId)
            return next
          })
        },
      },
    )
  }

  return {
    starAnalysis: starAnalysisByQnaSetId[qnaSetId] ?? initialStarAnalysis,
    isAnalyzing: analyzingQnaSetIds.has(qnaSetId),
    handleStarButtonClick,
  }
}
