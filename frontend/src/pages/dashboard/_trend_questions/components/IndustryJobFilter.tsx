import { useState } from 'react'
import type { FilterBadge, FilterType } from '@/pages/dashboard/_trend_questions/constants/constants'
import { INDUSTRIES, JOB_CATEGORIES } from '@/shared/constants/interviews'
import FilterBadges from './FilterBadges'
import FilterCard from './FilterCard'

type IndustryJobFilterProps = {
  selectedIndustryIds: number[]
  onIndustryIdsChange: (ids: number[]) => void
  selectedJobCategoryIds: number[]
  onJobCategoryIdsChange: (ids: number[]) => void
  onSearch: () => void
}

export default function IndustryJobFilter({
  selectedIndustryIds,
  onIndustryIdsChange,
  selectedJobCategoryIds,
  onJobCategoryIdsChange,
  onSearch,
}: IndustryJobFilterProps) {
  const [industrySearch, setIndustrySearch] = useState('')
  const [jobSearch, setJobSearch] = useState('')

  const filteredIndustries = INDUSTRIES.filter((item) =>
    item.label.toLowerCase().includes(industrySearch.toLowerCase()),
  )
  const filteredJobs = JOB_CATEGORIES.filter((item) => item.label.toLowerCase().includes(jobSearch.toLowerCase()))

  // TODO: 훅 분리
  const toggleIndustry = (id: number) => onIndustryIdsChange(toggleId(selectedIndustryIds, id))
  const toggleJobCategory = (id: number) => onJobCategoryIdsChange(toggleId(selectedJobCategoryIds, id))
  const clearAll = () => {
    onIndustryIdsChange([])
    onJobCategoryIdsChange([])
  }

  const allBadges: FilterBadge[] = [
    ...createBadges(selectedIndustryIds, 'industry', INDUSTRIES),
    ...createBadges(selectedJobCategoryIds, 'job', JOB_CATEGORIES),
  ]

  const handleRemoveBadge = (type: FilterType, id: number) => {
    if (type === 'industry') toggleIndustry(id)
    else toggleJobCategory(id)
  }

  return (
    <div className="flex flex-col gap-4">
      <FilterBadges badges={allBadges} onRemove={handleRemoveBadge} onClearAll={clearAll} onSearch={onSearch} />
      <div className="flex gap-4">
        <div className="basis-1/3">
          <FilterCard
            title="산업군"
            searchValue={industrySearch}
            onSearchChange={setIndustrySearch}
            optionItems={filteredIndustries}
            selectedIds={selectedIndustryIds}
            onToggle={toggleIndustry}
            colorScheme="orange"
          />
        </div>
        <div className="flex-1">
          <FilterCard
            title="직군"
            searchValue={jobSearch}
            onSearchChange={setJobSearch}
            optionItems={filteredJobs}
            selectedIds={selectedJobCategoryIds}
            onToggle={toggleJobCategory}
            colorScheme="blue"
            columns={3}
          />
        </div>
      </div>
    </div>
  )
}

const toggleId = (ids: number[], id: number) => (ids.includes(id) ? ids.filter((v) => v !== id) : [...ids, id])

const findLabel = (list: { id: number; label: string }[], id: number) =>
  list.find((item) => item.id === id)?.label ?? ''

const createBadges = (ids: number[], type: FilterType, list: { id: number; label: string }[]): FilterBadge[] =>
  ids.map((id) => ({ id, type, label: findLabel(list, id) }))
