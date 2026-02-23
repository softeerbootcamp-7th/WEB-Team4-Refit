import { useState } from 'react'
import { FilterSortControls, SearchBar, SearchResultBar } from '@/features/dashboard/my-interviews/components/filter'
import DraftSection from '@/features/dashboard/my-interviews/components/interviews/draft/DraftSection'
import InterviewListSection from '@/features/dashboard/my-interviews/components/interviews/list/InterviewListSection'
import { EMPTY_FILTER } from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewFilter } from '@/types/interview'

export default function InterviewsTab() {
  const [debriefCompletedFilter, setDebriefCompletedFilter] = useState<InterviewFilter>(EMPTY_FILTER)
  const [searchFilter, setSearchFilter] = useState<InterviewFilter>(EMPTY_FILTER)
  const isSearching = searchFilter.keyword.length > 0

  const handleSearch = (keyword: string) => {
    if (!keyword || !searchFilter.keyword) {
      setDebriefCompletedFilter(EMPTY_FILTER)
      setSearchFilter(keyword ? { ...EMPTY_FILTER, keyword } : EMPTY_FILTER)
    } else {
      setSearchFilter((prev) => ({ ...prev, keyword }))
    }
  }

  const activeFilter = isSearching ? searchFilter : debriefCompletedFilter
  const setActiveFilter = isSearching ? setSearchFilter : setDebriefCompletedFilter

  return (
    <>
      <div className="absolute top-0 right-0">
        <SearchBar keyword={searchFilter.keyword} onSearch={handleSearch} placeholder="회사명으로 내 면접 검색하기" />
      </div>
      {!isSearching && (
        <section className="flex flex-col gap-3">
          <h2 className="title-s-bold">복기 중인 면접</h2>
          <div className="flex gap-4">
            <DraftSection interviewDraftType="LOGGING" />
            <DraftSection interviewDraftType="REVIEWING" />
          </div>
        </section>
      )}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {isSearching ? (
            <SearchResultBar query={searchFilter.keyword} onClose={() => handleSearch('')} />
          ) : (
            <h2 className="title-s-bold">복기 완료한 면접</h2>
          )}
          <FilterSortControls filter={activeFilter} onFilterChange={setActiveFilter} isSearching={isSearching} />
        </div>
        <InterviewListSection filter={activeFilter} />
      </section>
    </>
  )
}
