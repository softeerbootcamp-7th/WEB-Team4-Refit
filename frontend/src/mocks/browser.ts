import { setupWorker } from 'msw/browser'
import { getGetInterviewFullMockHandler } from '@/apis/generated/interview-api/interview-api.msw'
import { getUpdateQnaSetMockHandler } from '@/apis/generated/qna-set-api/qna-set-api.msw'
import { mockInterviewFull } from '@/mocks/data/interview-full'

export const worker = setupWorker(
  getGetInterviewFullMockHandler(mockInterviewFull),
  getUpdateQnaSetMockHandler({ isSuccess: true, code: 'SUCCESS', message: 'mock update qna set' }),
)
