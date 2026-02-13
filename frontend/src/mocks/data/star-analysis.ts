import type { ApiResponseStarAnalysisDto } from '@/apis/generated/refit-api.schemas'

export const mockStarAnalysis: ApiResponseStarAnalysisDto = {
  isSuccess: true,
  code: 'SUCCESS',
  message: 'mock star analysis',
  result: {
    sInclusionLevel: 'PRESENT',
    tInclusionLevel: 'INSUFFICIENT',
    aInclusionLevel: 'PRESENT',
    rInclusionLevel: 'ABSENT',
    overallSummary:
      '상황(S)과 행동(A)은 잘 드러나 있으나, 과제(T)가 불충분하고 결과(R)가 빠져 있습니다. 구체적인 목표와 성과 지표를 추가해 보세요.',
  },
}
