import { useState } from 'react'
import { FilterSortControls, SearchBar, SearchResultBar } from '@/features/dashboard/my-interviews/components/filter'
import DraftSection from '@/features/dashboard/my-interviews/components/interviews/draft/DraftSection'
import InterviewListSection from '@/features/dashboard/my-interviews/components/interviews/list/InterviewListSection'
import { EMPTY_FILTER } from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewFilter } from '@/types/interview'

export default function InterviewsTab() {
  const [filter, setFilter] = useState<InterviewFilter>(EMPTY_FILTER)
  const isSearching = filter.keyword.length > 0

  return (
    <>
      <div className="absolute top-0 right-0">
        <SearchBar keyword={filter.keyword} onSearch={(keyword) => setFilter((prev) => ({ ...prev, keyword }))} />
      </div>
      {!isSearching && (
        <section className="flex flex-col gap-3">
          <h2 className="title-s-bold">임시저장 항목</h2>
          <div className="flex gap-4">
            <DraftSection interviewDraftType="LOGGING" />
            <DraftSection interviewDraftType="REVIEWING" />
          </div>
        </section>
      )}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {isSearching ? (
            <SearchResultBar query={filter.keyword} onClose={() => setFilter((prev) => ({ ...prev, keyword: '' }))} />
          ) : (
            <h2 className="title-s-bold">내가 복기 완료한 면접</h2>
          )}
          <FilterSortControls filter={filter} onFilterChange={setFilter} />
        </div>
        <InterviewListSection filter={filter} />
      </section>
    </>
  )
}
