import { useState } from 'react'
import { SearchBar, SearchResultBar } from '@/features/dashboard/my-interviews/components/filter'
import FrequentQuestionsSection from '@/features/dashboard/my-interviews/components/questions/frequent/FrequentQuestionsSection'
import QuestionFilterControls from '@/features/dashboard/my-interviews/components/questions/list/filter/QuestionFilterControls'
import QuestionListSection from '@/features/dashboard/my-interviews/components/questions/list/QuestionListSection'
import { EMPTY_QUESTION_FILTER } from '@/features/dashboard/my-interviews/constants/constants'
import type { QuestionFilter } from '@/types/interview'

export default function QuestionsTab() {
  const [filter, setFilter] = useState<QuestionFilter>(EMPTY_QUESTION_FILTER)
  const isSearching = filter.keyword.length > 0

  return (
    <>
      <div className="absolute top-0 right-0">
        <SearchBar
          placeholder="키워드로 내가 받은 질문 검색하기"
          keyword={filter.keyword}
          onSearch={(keyword) => setFilter((prev) => ({ ...prev, keyword }))}
        />
      </div>
      {!isSearching && <FrequentQuestionsSection />}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {isSearching ? (
            <SearchResultBar query={filter.keyword} onClose={() => setFilter((prev) => ({ ...prev, keyword: '' }))} />
          ) : (
            <h2 className="title-s-bold">내가 기록한 질문과 답변</h2>
          )}
          <QuestionFilterControls filter={filter} onChange={setFilter} />
        </div>
        <QuestionListSection filter={filter} />
      </section>
    </>
  )
}
