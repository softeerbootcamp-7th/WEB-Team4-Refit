import type {
  ApiResponsePageFrequentQnaSetCategoryQuestionResponse,
  ApiResponsePageFrequentQnaSetCategoryResponse,
  ApiResponsePageQnaSetSearchResponse,
  FrequentQnaSetCategoryQuestionResponse,
  FrequentQnaSetCategoryResponse,
  QnaSetSearchRequest,
  QnaSetSearchResponse,
} from '@/apis/generated/refit-api.schemas'

const categories: FrequentQnaSetCategoryResponse[] = [
  { categoryId: 101, categoryName: '협업', frequentCount: 12, cohesion: 0.92 },
  { categoryId: 102, categoryName: '문제 해결', frequentCount: 9, cohesion: 0.88 },
  { categoryId: 103, categoryName: '리더십', frequentCount: 7, cohesion: 0.8 },
  { categoryId: 104, categoryName: '갈등 해결', frequentCount: 6, cohesion: 0.76 },
]

const questionsByCategoryId: Record<number, FrequentQnaSetCategoryQuestionResponse[]> = {
  101: [
    {
      question:
        '디자이너/개발자와 협업 중 의견이 달랐을 때 어떻게 정리했나요? 어떻게 정리했나요?어떻게 정리했나요?어떻게 정리했나요?',
      interviewInfo: {
        interviewId: 5001,
        interviewType: 'TECHNICAL',
        interviewStartAt: '2026-01-12T01:00:00Z',
        companyInfo: { companyId: 1, companyName: '카카오헬스케어', companyLogoUrl: '' },
        jobCategoryName: '프론트엔드',
        updatedAt: '2026-01-12T03:40:00Z',
      },
    },
    {
      question: '일정이 촉박한 프로젝트에서 팀과 우선순위를 어떻게 맞췄나요?',
      interviewInfo: {
        interviewId: 5002,
        interviewType: 'BEHAVIORAL',
        interviewStartAt: '2025-12-21T01:00:00Z',
        companyInfo: { companyId: 2, companyName: '네이버', companyLogoUrl: '' },
        jobCategoryName: '웹 개발',
        updatedAt: '2025-12-21T05:10:00Z',
      },
    },
    {
      question: '일정이 촉박한 프로젝트에서 팀과 우선순위를 어떻게 맞췄나요?',
      interviewInfo: {
        interviewId: 5003,
        interviewType: 'BEHAVIORAL',
        interviewStartAt: '2025-12-21T01:00:00Z',
        companyInfo: { companyId: 2, companyName: '네이버', companyLogoUrl: '' },
        jobCategoryName: '웹 개발',
        updatedAt: '2025-12-21T05:10:00Z',
      },
    },
    {
      question: '일정이 촉박한 프로젝트에서 팀과 우선순위를 어떻게 맞췄나요?',
      interviewInfo: {
        interviewId: 5004,
        interviewType: 'BEHAVIORAL',
        interviewStartAt: '2025-12-21T01:00:00Z',
        companyInfo: { companyId: 2, companyName: '네이버', companyLogoUrl: '' },
        jobCategoryName: '웹 개발',
        updatedAt: '2025-12-21T05:10:00Z',
      },
    },
  ],
  102: [
    {
      question: '프로덕션 이슈를 발견했을 때 원인 분석부터 복구까지 설명해 주세요.',
      interviewInfo: {
        interviewId: 5101,
        interviewType: 'TECHNICAL',
        interviewStartAt: '2026-01-03T01:00:00Z',
        companyInfo: { companyId: 3, companyName: '토스', companyLogoUrl: '' },
        jobCategoryName: '프론트엔드',
        updatedAt: '2026-01-03T07:20:00Z',
      },
    },
    {
      question: '가장 어려웠던 버그를 해결한 과정을 단계별로 설명해 주세요.',
      interviewInfo: {
        interviewId: 5102,
        interviewType: 'FIRST',
        interviewStartAt: '2025-11-30T01:00:00Z',
        companyInfo: { companyId: 4, companyName: '당근', companyLogoUrl: '' },
        jobCategoryName: '앱 개발',
        updatedAt: '2025-11-30T03:30:00Z',
      },
    },
  ],
  103: [
    {
      question: '팀을 이끌어 목표를 달성했던 경험이 있다면 말씀해 주세요.',
      interviewInfo: {
        interviewId: 5201,
        interviewType: 'CULTURE_FIT',
        interviewStartAt: '2025-12-16T01:00:00Z',
        companyInfo: { companyId: 5, companyName: '라인', companyLogoUrl: '' },
        jobCategoryName: '서비스 개발',
        updatedAt: '2025-12-16T04:12:00Z',
      },
    },
  ],
  104: [
    {
      question: '팀 내부 갈등 상황에서 본인이 취한 행동과 결과를 설명해 주세요.',
      interviewInfo: {
        interviewId: 5301,
        interviewType: 'BEHAVIORAL',
        interviewStartAt: '2025-10-19T01:00:00Z',
        companyInfo: { companyId: 6, companyName: '쿠팡', companyLogoUrl: '' },
        jobCategoryName: '프론트엔드',
        updatedAt: '2025-10-19T08:10:00Z',
      },
    },
  ],
}

export const mockFrequentQuestionCategories: ApiResponsePageFrequentQnaSetCategoryResponse = {
  isSuccess: true,
  code: 'SUCCESS',
  message: 'mock frequent categories',
  result: {
    totalElements: categories.length,
    totalPages: 1,
    size: categories.length,
    content: categories,
    number: 0,
    first: true,
    numberOfElements: categories.length,
    last: true,
    empty: categories.length === 0,
  },
}

export const getMockFrequentCategoryQuestions = (
  categoryId: number,
  page = 0,
  size = 9,
): ApiResponsePageFrequentQnaSetCategoryQuestionResponse => {
  const all = questionsByCategoryId[categoryId] ?? []
  const start = page * size
  const end = start + size
  const paged = all.slice(start, end)

  return {
    isSuccess: true,
    code: 'SUCCESS',
    message: 'mock category questions',
    result: {
      totalElements: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / size)),
      size,
      content: paged,
      number: page,
      first: page === 0,
      numberOfElements: paged.length,
      last: end >= all.length,
      empty: paged.length === 0,
    },
  }
}

const searchableQuestions: QnaSetSearchResponse[] = Object.values(questionsByCategoryId)
  .flat()
  .map((item, index) => ({
    interviewInfo: {
      interviewId: item.interviewInfo?.interviewId ?? index + 1,
      interviewType: item.interviewInfo?.interviewType ?? 'FIRST',
      interviewResultStatus: 'PASS',
      interviewRawText: '',
      companyName: item.interviewInfo?.companyInfo?.companyName ?? '',
      jobCategoryId: 1,
      jobCategoryName: item.interviewInfo?.jobCategoryName ?? '',
      updatedAt: item.interviewInfo?.updatedAt ?? '',
      createdAt: item.interviewInfo?.updatedAt ?? '',
    },
    qnaSetInfo: {
      qnaSetId: index + 1000,
      questionText: item.question ?? '',
      answerText: 'mock answer',
    },
  }))

const starAnalysisByQnaSetId: Record<number, { s: string; t: string; a: string; r: string } | null> = {
  1000: { s: 'PRESENT', t: 'PRESENT', a: 'INSUFFICIENT', r: 'ABSENT' },
  1001: { s: 'INSUFFICIENT', t: 'PRESENT', a: 'PRESENT', r: 'INSUFFICIENT' },
  1002: null,
  1003: { s: 'ABSENT', t: 'INSUFFICIENT', a: 'PRESENT', r: 'PRESENT' },
  1004: { s: 'PRESENT', t: 'PRESENT', a: 'PRESENT', r: 'PRESENT' },
  1005: null,
}

type SearchOptions = {
  page: number
  size: number
  request: QnaSetSearchRequest
}

export const getMockSearchMyQnaSet = ({ page, size, request }: SearchOptions): ApiResponsePageQnaSetSearchResponse => {
  const keyword = request.keyword?.trim().toLowerCase() ?? ''
  const searchFilter = request.searchFilter

  const filteredByStar = searchableQuestions.filter((item) => {
    const qnaSetId = item.qnaSetInfo?.qnaSetId ?? -1
    const star = starAnalysisByQnaSetId[qnaSetId] ?? null

    if (searchFilter?.hasStarAnalysis === true && star === null) return false
    if (searchFilter?.hasStarAnalysis === false && star !== null) return false

    if (searchFilter?.sInclusionLevels?.length && (!star || !searchFilter.sInclusionLevels.includes(star.s as never)))
      return false
    if (searchFilter?.tInclusionLevels?.length && (!star || !searchFilter.tInclusionLevels.includes(star.t as never)))
      return false
    if (searchFilter?.aInclusionLevels?.length && (!star || !searchFilter.aInclusionLevels.includes(star.a as never)))
      return false
    if (searchFilter?.rInclusionLevels?.length && (!star || !searchFilter.rInclusionLevels.includes(star.r as never)))
      return false

    return true
  })

  const filtered = keyword
    ? filteredByStar.filter((item) => (item.qnaSetInfo?.questionText ?? '').toLowerCase().includes(keyword))
    : filteredByStar

  const start = page * size
  const end = start + size
  const content = filtered.slice(start, end)

  return {
    isSuccess: true,
    code: 'SUCCESS',
    message: 'mock search my qna set',
    result: {
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / size)),
      size,
      content,
      number: page,
      first: page === 0,
      numberOfElements: content.length,
      last: end >= filtered.length,
      empty: content.length === 0,
    },
  }
}
