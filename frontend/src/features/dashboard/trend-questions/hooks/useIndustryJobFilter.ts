import { useCallback, useMemo, useState } from 'react'
import type { FilterBadge, FilterItem, FilterType } from '@/features/dashboard/trend-questions/constants/constants'

type UseIndustryJobFilterOptions = {
  defaultIndustryIds?: number[]
  defaultJobCategoryIds?: number[]
  industryItems?: FilterItem[]
  jobCategoryItems?: FilterItem[]
}

export function useIndustryJobFilter(options: UseIndustryJobFilterOptions = {}) {
  const { defaultIndustryIds = [], defaultJobCategoryIds = [], industryItems = [], jobCategoryItems = [] } = options

  const [industryIds, setIndustryIds] = useState<number[]>(() => defaultIndustryIds)
  const [jobCategoryIds, setJobCategoryIds] = useState<number[]>(() => defaultJobCategoryIds)

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

  const industryMap = useMemo(() => new Map(industryItems.map((item) => [item.id, item.label])), [industryItems])
  const jobCategoryMap = useMemo(
    () => new Map(jobCategoryItems.map((item) => [item.id, item.label])),
    [jobCategoryItems],
  )
  const industryBadges = industryIds.map(
    (id) =>
      ({
        id,
        type: 'industry',
        label: industryMap.get(id) ?? '',
      }) satisfies FilterBadge,
  )
  const jobBadges = jobCategoryIds.map(
    (id) =>
      ({
        id,
        type: 'job',
        label: jobCategoryMap.get(id) ?? '',
      }) satisfies FilterBadge,
  )
  const badges: FilterBadge[] = [...industryBadges, ...jobBadges]

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
    industryItems,
    jobCategoryItems,
  }
}

export type IndustryJobFilterState = ReturnType<typeof useIndustryJobFilter>
