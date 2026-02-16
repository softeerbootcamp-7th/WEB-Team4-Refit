import type {
  ApiResponseListIndustryResponse,
  ApiResponseListJobCategoryResponse,
  ApiResponsePageFrequentQnaSetResponse,
  FrequentQnaSetResponse,
} from '@/apis/generated/refit-api.schemas'

const industries = [
  { industryId: 1, industryName: 'IT/플랫폼' },
  { industryId: 2, industryName: '금융' },
  { industryId: 3, industryName: '이커머스' },
]

const jobCategories = [
  { jobCategoryId: 1, jobCategoryName: '프론트엔드 개발' },
  { jobCategoryId: 2, jobCategoryName: '백엔드 개발' },
  { jobCategoryId: 3, jobCategoryName: '데이터 분석' },
]

const frequentQuestions: Array<
  FrequentQnaSetResponse & {
    industryId: number
    jobCategoryId: number
  }
> = [
  {
    industryId: 1,
    jobCategoryId: 1,
    industryName: 'IT/플랫폼',
    jobCategoryName: '프론트엔드 개발',
    interviewType: 'TECHNICAL',
    interviewStartAt: '2026-02-10T01:00:00Z',
    question: 'React에서 상태 관리 전략을 어떻게 선택하나요?',
  },
  {
    industryId: 1,
    jobCategoryId: 1,
    industryName: 'IT/플랫폼',
    jobCategoryName: '프론트엔드 개발',
    interviewType: 'BEHAVIORAL',
    interviewStartAt: '2026-01-29T01:00:00Z',
    question: '협업 과정에서 코드 리뷰 갈등을 해결한 경험이 있나요?',
  },
  {
    industryId: 1,
    jobCategoryId: 2,
    industryName: 'IT/플랫폼',
    jobCategoryName: '백엔드 개발',
    interviewType: 'TECHNICAL',
    interviewStartAt: '2026-01-11T01:00:00Z',
    question: '트랜잭션 무결성을 보장하기 위해 어떤 설계를 했나요?',
  },
  {
    industryId: 2,
    jobCategoryId: 2,
    industryName: '금융',
    jobCategoryName: '백엔드 개발',
    interviewType: 'TECHNICAL',
    interviewStartAt: '2026-01-11T01:00:00Z',
    question: '트랜잭션 무결성을 보장하기 위해 어떤 설계를 했나요?',
  },
]

export const mockIndustriesResponse: ApiResponseListIndustryResponse = {
  isSuccess: true,
  code: 'SUCCESS',
  message: 'mock industries',
  result: industries,
}

export const mockJobCategoriesResponse: ApiResponseListJobCategoryResponse = {
  isSuccess: true,
  code: 'SUCCESS',
  message: 'mock job categories',
  result: jobCategories,
}

type FrequentQuestionMockOptions = {
  industryIds: number[]
  jobCategoryIds: number[]
  page: number
  size: number
}

export const getMockFrequentQuestions = ({
  industryIds,
  jobCategoryIds,
  page,
  size,
}: FrequentQuestionMockOptions): ApiResponsePageFrequentQnaSetResponse => {
  const filtered = frequentQuestions.filter((item) => {
    if (industryIds.length > 0 && !industryIds.includes(item.industryId)) return false
    if (jobCategoryIds.length > 0 && !jobCategoryIds.includes(item.jobCategoryId)) return false
    return true
  })

  const safeSize = Math.max(1, size)
  const start = page * safeSize
  const end = start + safeSize
  const content = filtered.slice(start, end)

  return {
    isSuccess: true,
    code: 'SUCCESS',
    message: 'mock frequent questions',
    result: {
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / safeSize)),
      size: safeSize,
      content,
      number: page,
      first: page === 0,
      numberOfElements: content.length,
      last: end >= filtered.length,
      empty: content.length === 0,
    },
  }
}
