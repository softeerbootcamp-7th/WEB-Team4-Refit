import { Suspense } from 'react'
import { useGetIndustriesSuspense } from '@/apis/generated/industry-api/industry-api'
import { useGetAllJobCategoriesSuspense } from '@/apis/generated/job-category-api/job-category-api'
import { useGetMyProfileInfoSuspense } from '@/apis/generated/user-api/user-api'
import IndustryJobFilter from '@/features/dashboard/trend-questions/components/filter/IndustryJobFilter'
import FilterResultList from '@/features/dashboard/trend-questions/components/list/FilterResultList'
import { useIndustryJobFilter } from '@/features/dashboard/trend-questions/hooks/useIndustryJobFilter'
import { SmallLogoIcon } from '@/ui/assets'

export default function TrendQuestionsPage() {
  return (
    <Suspense fallback={<TrendQuestionsPageSkeleton />}>
      <TrendQuestionsPageContent />
    </Suspense>
  )
}

function TrendQuestionsPageContent() {
  const { data: industries = [] } = useGetIndustriesSuspense({
    query: {
      select: (response) => (response.result ?? []).map((item) => ({ id: item.industryId, label: item.industryName })),
    },
  })
  const { data: jobCategories = [] } = useGetAllJobCategoriesSuspense({
    query: {
      select: (response) =>
        (response.result ?? []).map((item) => ({ id: item.jobCategoryId, label: item.jobCategoryName })),
    },
  })
  const {
    data: { defaultIndustryIds, defaultJobCategoryIds, isAgreedToTerms },
  } = useGetMyProfileInfoSuspense({
    query: {
      select: (response) => ({
        defaultIndustryIds: response.result?.industryId ? [response.result.industryId] : [],
        defaultJobCategoryIds: response.result?.jobCategoryId ? [response.result.jobCategoryId] : [],
        isAgreedToTerms: response.result?.isAgreedToTerms ?? false,
      }),
    },
  })

  const filter = useIndustryJobFilter({
    defaultIndustryIds,
    defaultJobCategoryIds,
    industryItems: industries,
    jobCategoryItems: jobCategories,
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <SmallLogoIcon className="h-6 w-6" />
          <h1 className="title-l-bold">산업군&middot;직군별 질문 모아보기</h1>
        </div>
        <IndustryJobFilter filter={filter} />
      </div>
      <FilterResultList filter={filter} isBlurred={!isAgreedToTerms} />
    </div>
  )
}

function TrendQuestionsPageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <SmallLogoIcon className="h-6 w-6" />
          <h1 className="title-l-bold">산업군&middot;직군별 질문 모아보기</h1>
        </div>
        <div className="bg-gray-white flex h-82.5 animate-pulse items-end gap-8 rounded-xl border border-gray-200 p-6">
          <div className="h-full w-1/3 animate-pulse rounded-xl bg-gray-100" />
          <div className="flex h-full flex-1 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="title-s-bold">조건에 맞는 질문</h1>
        <div className="flex h-40 animate-pulse gap-4">
          <div className="bg-gray-150 flex h-full flex-1 animate-pulse rounded-xl" />
          <div className="bg-gray-150 flex h-full flex-1 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  )
}
