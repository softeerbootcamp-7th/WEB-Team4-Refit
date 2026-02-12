import { setupWorker } from 'msw/browser'
import {
  getGetDashboardCalendarInterviewsMockHandler,
  getGetDashboardHeadlineMockHandler,
  getGetDebriefIncompletedInterviewsMockHandler,
  getGetMyDifficultQnaSetsMockHandler,
  getGetUpcomingInterviewsMockHandler,
} from '@/apis/generated/dashboard-api/dashboard-api.msw'
import { getUpdateRawTextMockHandler } from '@/apis/generated/interview-api/interview-api.msw'
import { debriefIncompletedMock } from '@/mocks/data/debrief-incompleted'
import { updateRawTextMock } from '@/mocks/data/update-raw-text'

export const worker = setupWorker(
  getGetMyDifficultQnaSetsMockHandler(),
  getGetUpcomingInterviewsMockHandler(),
  getGetDebriefIncompletedInterviewsMockHandler(debriefIncompletedMock),
  getGetDashboardHeadlineMockHandler(),
  getGetDashboardCalendarInterviewsMockHandler(),
  getUpdateRawTextMockHandler(updateRawTextMock),
)
