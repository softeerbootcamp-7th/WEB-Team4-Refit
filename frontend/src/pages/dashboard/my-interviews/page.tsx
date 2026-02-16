import { useState } from 'react'
import { FileSaveIcon } from '@/designs/assets'
import TabBar from '@/designs/components/tab'
import { FilterSortControls, SearchBar, SearchResultBar } from '@/features/dashboard/my-interviews/components/filter'
import { DraftSection, InterviewListSection } from '@/features/dashboard/my-interviews/components/interviews'
import QuestionsTab from '@/features/dashboard/my-interviews/components/questions/QuestionsTab'
import { TAB_ITEMS, EMPTY_FILTER } from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewFilter } from '@/types/interview'

export default function MyInterviewsPage() {
  const [activeTab, setActiveTab] = useState<'interviews' | 'questions'>('interviews')

  {
    /* TODO: interview 탭 컴포넌트 분리 */
  }
  const [interviewFilter, setInterviewFilter] = useState<InterviewFilter>(EMPTY_FILTER)

  const isInterviewSearching = interviewFilter.keyword.length > 0

  const handleTabChange = (value: string) => {
    if (value !== 'interviews' && value !== 'questions') return
    setActiveTab(value)
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center gap-2.5">
        <FileSaveIcon />
        <h1 className="title-l-bold">나의 면접을 모아볼까요?</h1>
      </div>
      <div className="relative flex flex-col gap-7">
        <div className="flex flex-1">
          <TabBar items={TAB_ITEMS} activeValue={activeTab} onChange={handleTabChange} />
        </div>
        {/* TODO: interview 탭 컴포넌트 분리 */}
        {activeTab === 'interviews' && (
          <>
            <div className="absolute top-0 right-0">
              <SearchBar
                keyword={interviewFilter.keyword}
                onSearch={(keyword: string) => setInterviewFilter((prev) => ({ ...prev, keyword }))}
              />
            </div>
            {!isInterviewSearching && (
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
                {isInterviewSearching ? (
                  <SearchResultBar
                    query={interviewFilter.keyword}
                    onClose={() => setInterviewFilter((prev) => ({ ...prev, keyword: '' }))}
                  />
                ) : (
                  <h2 className="title-s-bold">내가 복기 완료한 면접</h2>
                )}
                <FilterSortControls filter={interviewFilter} onFilterChange={setInterviewFilter} />
              </div>
              <InterviewListSection filter={interviewFilter} />
            </section>
          </>
        )}

        {activeTab === 'questions' && <QuestionsTab />}
      </div>
    </div>
  )
}
