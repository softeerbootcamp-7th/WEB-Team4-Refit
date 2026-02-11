import { setupWorker } from 'msw/browser'
import { getGetInterviewFullMockHandler } from '@/apis/generated/interview-api/interview-api.msw'
import { mockInterviewFull } from '@/mocks/data/interview-full'

export const worker = setupWorker(getGetInterviewFullMockHandler(mockInterviewFull))
