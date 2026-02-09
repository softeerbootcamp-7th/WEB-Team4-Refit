import { useState, useMemo, useCallback } from 'react'
import type { FilterBadge, FilterType } from '@/features/dashboard/trend-questions/constants/constants'
import { INDUSTRIES, JOB_CATEGORIES } from '@/shared/constants/interviews'

type UseIndustryJobFilterOptions = {
  defaultIndustryIds?: number[]
  defaultJobCategoryIds?: number[]
}

export function useIndustryJobFilter(options: UseIndustryJobFilterOptions = {}) {
  const { defaultIndustryIds = [], defaultJobCategoryIds = [] } = options

  const [industryIds, setIndustryIds] = useState<number[]>(defaultIndustryIds)
  const [jobCategoryIds, setJobCategoryIds] = useState<number[]>(defaultJobCategoryIds)

  const toggleIndustry = useCallback((id: number) => {
    setIndustryIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }, [])

  const toggleJobCategory = useCallback((id: number) => {
    setJobCategoryIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }, [])

  const clearAll = useCallback(() => {
    setIndustryIds([])
    setJobCategoryIds([])
  }, [])

  const badges = useMemo<FilterBadge[]>(() => {
    const industryBadges = industryIds.map((id) => ({
      id,
      type: 'industry' as FilterType,
      label: INDUSTRIES.find((item) => item.id === id)?.label ?? '',
    }))
    const jobBadges = jobCategoryIds.map((id) => ({
      id,
      type: 'job' as FilterType,
      label: JOB_CATEGORIES.find((item) => item.id === id)?.label ?? '',
    }))
    return [...industryBadges, ...jobBadges]
  }, [industryIds, jobCategoryIds])

  const removeBadge = useCallback(
    (type: FilterType, id: number) => {
      if (type === 'industry') toggleIndustry(id)
      else toggleJobCategory(id)
    },
    [toggleIndustry, toggleJobCategory],
  )

  return {
    industryIds,
    jobCategoryIds,
    toggleIndustry,
    toggleJobCategory,
    clearAll,
    badges,
    removeBadge,
  }
}

export type IndustryJobFilterState = ReturnType<typeof useIndustryJobFilter>
