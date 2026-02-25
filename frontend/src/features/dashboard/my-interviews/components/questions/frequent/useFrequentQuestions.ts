import { useState, useMemo, useCallback } from 'react'
import {
  useGetMyFrequentQnaSetCategories,
  useGetMyFrequentQnaSetCategoryQuestions,
} from '@/apis/generated/qna-set-my-controller/qna-set-my-controller'
import { mapFrequentCategory, mapFrequentQuestion } from '../mappers'

const FREQUENT_CATEGORIES_LIMIT = 5

interface UseFrequentQuestionsParams {
  pageSize?: number
  enabled?: boolean
}

export function useFrequentQuestions({ pageSize = 3, enabled = true }: UseFrequentQuestionsParams = {}) {
  const [page, setPage] = useState(1)
  const { data: categories = [] } = useGetMyFrequentQnaSetCategories(
    { page: 0, size: FREQUENT_CATEGORIES_LIMIT },
    {
      query: {
        enabled,
        select: (response) => (response.result?.content ?? []).map(mapFrequentCategory),
      },
    },
  )

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  // 선택 전이면 첫 카테고리를 기본값으로 사용
  const resolvedCategoryId = selectedCategoryId ?? categories[0]?.categoryId ?? null

  const { data: questionsData } = useGetMyFrequentQnaSetCategoryQuestions(
    resolvedCategoryId ?? 0,
    {
      page: Math.max(0, page - 1),
      size: pageSize,
    },
    {
      query: {
        enabled: enabled && resolvedCategoryId !== null,
        select: (response) => ({
          questions: (response.result?.content ?? []).map(mapFrequentQuestion),
          totalPages: response.result?.totalPages ?? 1,
        }),
      },
    },
  )

  const totalPages = useMemo(() => questionsData?.totalPages ?? 1, [questionsData?.totalPages])

  const handleCategoryClick = useCallback((categoryId: number) => {
    setSelectedCategoryId(categoryId)
    setPage(1)
  }, [])

  return {
    categories,
    selectedCategoryId: resolvedCategoryId,
    setSelectedCategoryId: handleCategoryClick,
    selectedCategoryQuestions: questionsData?.questions ?? [],
    page,
    setPage,
    totalPages,
  }
}
