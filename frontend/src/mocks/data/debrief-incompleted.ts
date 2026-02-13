import type { ApiResponsePageDashboardDebriefIncompletedInterviewResponse } from '@/apis/generated/refit-api.schemas'

export const debriefIncompletedMock: ApiResponsePageDashboardDebriefIncompletedInterviewResponse = {
  isSuccess: true,
  result: {
    content: [
      {
        interview: {
          interviewId: 1,
          companyName: '현대자동차',
          jobCategoryName: '데이터 사이언티스트',
          interviewType: 'CULTURE_FIT',
          interviewStartAt: '2026-03-01T14:30:00Z',
        },
        passedDays: 2,
      },
      {
        interview: {
          interviewId: 2,
          companyName: '현대자동차',
          jobCategoryName: '데이터 사이언티스트',
          interviewType: 'CULTURE_FIT',
          interviewStartAt: '2026-02-28T10:00:00Z',
        },
        passedDays: 3,
      },
      {
        interview: {
          interviewId: 3,
          companyName: '토스',
          jobCategoryName: '프로덕트 디자이너',
          interviewType: 'SECOND',
          interviewStartAt: '2026-03-05T15:00:00Z',
        },
        passedDays: 7,
      },
      {
        interview: {
          interviewId: 4,
          companyName: '카카오',
          jobCategoryName: '프론트엔드 개발자',
          interviewType: 'FIRST',
          interviewStartAt: '2026-03-10T11:00:00Z',
        },
        passedDays: 1,
      },
      {
        interview: {
          interviewId: 5,
          companyName: '당근마켓',
          jobCategoryName: 'iOS 개발자',
          interviewType: 'FIRST',
          interviewStartAt: '2026-03-15T14:00:00Z',
        },
        passedDays: 14,
      },
      {
        interview: {
          interviewId: 6,
          companyName: '라인',
          jobCategoryName: '풀스택 개발자',
          interviewType: 'TECHNICAL',
          interviewStartAt: '2026-03-20T09:30:00Z',
        },
        passedDays: 21,
      },
    ],
    totalElements: 6,
    totalPages: 1,
    size: 20,
    number: 0,
    first: true,
    last: true,
    empty: false,
  },
}
