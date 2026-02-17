import { useState } from 'react'
import type { IndustryJobFilterState } from '@/features/dashboard/trend-questions/hooks/useIndustryJobFilter'
import FilterCard from './filter-section/FilterCard'

type IndustryJobFilterProps = {
  filter: IndustryJobFilterState
}

export default function IndustryJobFilter({ filter }: IndustryJobFilterProps) {
  const { industryIds, toggleIndustry, jobCategoryIds, toggleJobCategory, industryItems, jobCategoryItems } = filter
  const [industrySearch, setIndustrySearch] = useState('')
  const [jobSearch, setJobSearch] = useState('')

  const filteredIndustries = industryItems.filter((item) =>
    item.label.toLowerCase().includes(industrySearch.toLowerCase()),
  )
  const filteredJobs = jobCategoryItems.filter((item) => item.label.toLowerCase().includes(jobSearch.toLowerCase()))

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-white flex h-full items-end rounded-xl border border-gray-200">
        <div className="basis-1/3">
          <FilterCard
            title="산업군"
            searchValue={industrySearch}
            onSearchChange={setIndustrySearch}
            optionItems={filteredIndustries}
            selectedIds={industryIds}
            onToggle={toggleIndustry}
            colorScheme="orange"
          />
        </div>
        <div className="my-4 flex h-64 w-px rounded-full bg-gray-200" />
        <div className="flex-1">
          <FilterCard
            title="직군"
            searchValue={jobSearch}
            onSearchChange={setJobSearch}
            optionItems={filteredJobs}
            selectedIds={jobCategoryIds}
            onToggle={toggleJobCategory}
            colorScheme="blue"
            columns={3}
          />
        </div>
      </div>
    </div>
  )
}
