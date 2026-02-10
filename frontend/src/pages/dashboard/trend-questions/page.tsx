import FilterResultList from '@/features/dashboard/trend-questions/components/FilterResultList'
import IndustryJobFilter from '@/features/dashboard/trend-questions/components/IndustryJobFilter'
import { useIndustryJobFilter } from '@/features/dashboard/trend-questions/hooks/useIndustryJobFilter'
import { SmallLogoIcon } from '@/shared/assets'

export default function TrendQuestionsPage() {
  // TODO: 유저 회원가입 정보에서 기본값 가져오기
  const filter = useIndustryJobFilter({
    defaultIndustryIds: [1],
    defaultJobCategoryIds: [13],
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <SmallLogoIcon className="h-6 w-6" />
          <h1 className="title-l-bold">산업/직군별 질문 모아보기</h1>
        </div>
        <IndustryJobFilter filter={filter} />
      </div>
      <FilterResultList filter={filter} />
    </div>
  )
}
