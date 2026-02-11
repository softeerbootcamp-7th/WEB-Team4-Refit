import { setupWorker } from 'msw/browser'
import {
  getGetDashboardCalendarInterviewsMockHandler,
  getGetDashboardHeadlineMockHandler,
  getGetDebriefIncompletedInterviewsMockHandler,
  getGetMyDifficultQnaSetsMockHandler,
  getGetUpcomingInterviewsMockHandler,
} from '@/apis/generated/dashboard-api/dashboard-api.msw'
import { debriefIncompletedMock } from '@/mocks/data/debrief-incompleted'

export const worker = setupWorker(
  getGetMyDifficultQnaSetsMockHandler(),
  getGetUpcomingInterviewsMockHandler(),
  getGetDebriefIncompletedInterviewsMockHandler(debriefIncompletedMock),
  getGetDashboardHeadlineMockHandler(),
  getGetDashboardCalendarInterviewsMockHandler(),
)
