import { setupWorker } from 'msw/browser'
import {
  getGetDashboardCalendarInterviewsMockHandler,
  getGetDashboardHeadlineMockHandler,
  getGetDebriefIncompletedInterviewsMockHandler,
  getGetMyDifficultQnaSetsMockHandler,
  getGetUpcomingInterviewsMockHandler,
} from '@/apis/generated/dashboard-api/dashboard-api.msw'
import {
  getUpdateRawTextMockHandler,
  getGetInterviewFullMockHandler,
} from '@/apis/generated/interview-api/interview-api.msw'
import { getUpdateQnaSetMockHandler } from '@/apis/generated/qna-set-api/qna-set-api.msw'
import { debriefIncompletedMock } from '@/mocks/data/debrief-incompleted'
import { mockInterviewFull } from '@/mocks/data/interview-full'
import { updateRawTextMock } from '@/mocks/data/update-raw-text'

export const worker = setupWorker(
  getGetMyDifficultQnaSetsMockHandler(),
  getGetUpcomingInterviewsMockHandler(),
  getGetDebriefIncompletedInterviewsMockHandler(debriefIncompletedMock),
  getGetDashboardHeadlineMockHandler(),
  getGetDashboardCalendarInterviewsMockHandler(),
  getUpdateRawTextMockHandler(updateRawTextMock),
  getGetInterviewFullMockHandler(mockInterviewFull),
  getUpdateQnaSetMockHandler({ isSuccess: true, code: 'SUCCESS', message: 'mock update qna set' }),
)
