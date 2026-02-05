import { useState } from 'react'
import { FilterSortControls, SearchBar, SearchResultBar } from '@/pages/dashboard/_my_interviews/components/filter'
import { DraftSection, InterviewListSection } from '@/pages/dashboard/_my_interviews/components/interviews'
import { FrequentQuestionsSection, QuestionListSection } from '@/pages/dashboard/_my_interviews/components/questions'
import { FileSaveIcon } from '@/shared/assets'
import TabBar from '@/shared/components/tab'
import type { InterviewFilter } from '@/types/interview'
import { TAB_ITEMS, EMPTY_FILTER } from './constants/constants'

export default function MyInterviewsPage() {
  const [activeTab, setActiveTab] = useState<'interviews' | 'questions'>('interviews')
  const [filter, setFilter] = useState<InterviewFilter>(EMPTY_FILTER)

  const isSearching = filter.keyword.length > 0

  const handleTabChange = (value: string) => {
    if (value !== 'interviews' && value !== 'questions') return
    setActiveTab(value)
    setFilter(EMPTY_FILTER)
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center gap-2.5">
        <FileSaveIcon />
        <h1 className="title-l-bold">나의 면접을 모아볼까요?</h1>
      </div>
      <div className="relative flex flex-1">
        <TabBar items={TAB_ITEMS} activeValue={activeTab} onChange={handleTabChange} />
        <div className="absolute top-0 right-0">
          <SearchBar keyword={filter.keyword} onSearch={(keyword) => setFilter((prev) => ({ ...prev, keyword }))} />
        </div>
      </div>
      {activeTab === 'interviews' && (
        <>
          {!isSearching && (
            <section className="flex flex-col gap-3">
              <h2 className="title-s-bold">임시저장 항목</h2>
              <div className="flex gap-4">
                <DraftSection interviewReviewStatus="log_draft" />
                <DraftSection interviewReviewStatus="self_review_draft" />
              </div>
            </section>
          )}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              {isSearching ? (
                <SearchResultBar
                  query={filter.keyword}
                  onClose={() => setFilter((prev) => ({ ...prev, keyword: '' }))}
                />
              ) : (
                <h2 className="title-s-bold">내가 복기 완료한 면접</h2>
              )}
              <FilterSortControls filter={filter} onFilterChange={setFilter} />
            </div>
            <InterviewListSection filter={filter} />
          </section>
        </>
      )}

      {activeTab === 'questions' && (
        <>
          {!isSearching && <FrequentQuestionsSection />}
          <section className="flex flex-col gap-3">
            <div className="flex items-center">
              {isSearching ? (
                <SearchResultBar
                  query={filter.keyword}
                  onClose={() => setFilter((prev) => ({ ...prev, keyword: '' }))}
                />
              ) : (
                <h2 className="title-s-bold">내가 복기 완료한 질문과 답변</h2>
              )}
              <div className="ml-auto">
                <FilterSortControls filter={filter} onFilterChange={setFilter} />
              </div>
            </div>
            <QuestionListSection filter={filter} />
          </section>
        </>
      )}
    </div>
  )
}
