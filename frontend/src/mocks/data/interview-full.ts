import type { ApiResponseInterviewFullDto } from '@/apis/generated/refit-api.schemas'

export const mockInterviewFull: ApiResponseInterviewFullDto = {
  isSuccess: true,
  code: 'SUCCESS',
  message: 'mock interview full',
  result: {
    interviewId: 1,
    interviewType: 'FIRST',
    interviewStartAt: '2026-02-11T10:00:00Z',
    company: 'Mock Company',
    industryId: 1,
    jobCategoryId: 1,
    jobRole: 'Frontend Developer',
    updatedAt: '2026-02-11T10:00:00Z',
    pdfUrl: '',
    qnaSets: [
      {
        qnaSetId: 1,
        interviewId: 1,
        questionText: 'Mock 질문 1',
        answerText: 'Mock 답변 1',
        isMarkedDifficult: false,
        qnaSetSelfReviewText: '',
      },
      {
        qnaSetId: 2,
        interviewId: 1,
        questionText: 'Mock 질문 2',
        answerText: 'Mock 답변 2',
        isMarkedDifficult: true,
        qnaSetSelfReviewText: '',
      },
    ],
    interviewSelfReview: {
      keepText: '',
      problemText: '',
      tryText: '',
    },
  },
}
