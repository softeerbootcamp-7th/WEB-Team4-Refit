import { useState } from 'react'
import { SearchBar, SearchResultBar } from '@/features/dashboard/my-interviews/components/filter'
import FrequentQuestionsSection from '@/features/dashboard/my-interviews/components/questions/frequent/FrequentQuestionsSection'
import QuestionFilterControls from '@/features/dashboard/my-interviews/components/questions/list/filter/QuestionFilterControls'
import QuestionListSection from '@/features/dashboard/my-interviews/components/questions/list/QuestionListSection'
import { EMPTY_QUESTION_FILTER } from '@/features/dashboard/my-interviews/constants/constants'
import type { QuestionFilter } from '@/types/interview'

export default function QuestionsTab() {
  const [questionFilter, setQuestionFilter] = useState<QuestionFilter>(EMPTY_QUESTION_FILTER)
  const [searchFilter, setSearchFilter] = useState<QuestionFilter>(EMPTY_QUESTION_FILTER)
  const isSearching = searchFilter.keyword.length > 0

  const handleSearch = (keyword: string) => {
    if (!keyword || !searchFilter.keyword) {
      setQuestionFilter(EMPTY_QUESTION_FILTER)
      setSearchFilter(keyword ? { ...EMPTY_QUESTION_FILTER, keyword } : EMPTY_QUESTION_FILTER)
    } else {
      setSearchFilter((prev) => ({ ...prev, keyword }))
    }
  }

  const activeFilter = isSearching ? searchFilter : questionFilter
  const setActiveFilter = isSearching ? setSearchFilter : setQuestionFilter

  return (
    <>
      <div className="absolute top-0 right-0">
        <SearchBar
          placeholder="키워드로 내가 받은 질문 검색하기"
          keyword={searchFilter.keyword}
          onSearch={handleSearch}
        />
      </div>
      {!isSearching && <FrequentQuestionsSection />}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {isSearching ? (
            <SearchResultBar query={searchFilter.keyword} onClose={() => handleSearch('')} />
          ) : (
            <h2 className="title-s-bold">내가 기록한 질문과 답변</h2>
          )}
          <QuestionFilterControls filter={activeFilter} onChange={setActiveFilter} />
        </div>
        <QuestionListSection filter={activeFilter} />
      </section>
    </>
  )
}
