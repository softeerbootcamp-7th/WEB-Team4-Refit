import { useState } from 'react'
import FilterResultList from '@/pages/dashboard/_trend_questions/components/FilterResultList'
import IndustryJobFilter from '@/pages/dashboard/_trend_questions/components/IndustryJobFilter'
import { SmallLogoIcon } from '@/shared/assets'
import { Border } from '@/shared/components'

export default function TrendQuestionsPage() {
  // TODO: 유저 회원가입 정보에서 기본값 가져오기
  const [selectedIndustryIds, setSelectedIndustryIds] = useState<number[]>([1])
  const [selectedJobCategoryIds, setSelectedJobCategoryIds] = useState<number[]>([13])

  const handleSearch = () => {
    console.log({ industryIds: selectedIndustryIds, jobCategoryIds: selectedJobCategoryIds })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <SmallLogoIcon className="h-6 w-6" />
          <h1 className="title-l-bold">산업/직군별 질문 모아보기</h1>
        </div>
        <IndustryJobFilter
          selectedIndustryIds={selectedIndustryIds}
          onIndustryIdsChange={setSelectedIndustryIds}
          selectedJobCategoryIds={selectedJobCategoryIds}
          onJobCategoryIdsChange={setSelectedJobCategoryIds}
          onSearch={handleSearch}
        />
      </div>
      <FilterResultList />
    </div>
  )
}
