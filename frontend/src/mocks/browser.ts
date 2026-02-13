import { setupWorker } from 'msw/browser'
import {
  getGetDashboardCalendarInterviewsMockHandler,
  getGetDashboardHeadlineMockHandler,
  getGetDebriefIncompletedInterviewsMockHandler,
  getGetMyDifficultQnaSetsMockHandler,
  getGetUpcomingInterviewsMockHandler,
} from '@/apis/generated/dashboard-api/dashboard-api.msw'
import {
  getGetInterviewFullMockHandler,
  getUpdateKptSelfReviewMockHandler,
  getUpdateRawTextMockHandler,
} from '@/apis/generated/interview-api/interview-api.msw'
import {
  getCreateStarAnalysisMockHandler,
  getGetScrapFoldersContainingQnaSetMockHandler,
  getUpdateQnaSetMockHandler,
} from '@/apis/generated/qna-set-api/qna-set-api.msw'
import { getCreateScrapFolderMockHandler } from '@/apis/generated/scrap-folder-api/scrap-folder-api.msw'
import { debriefIncompletedMock } from '@/mocks/data/debrief-incompleted'
import { mockInterviewFull } from '@/mocks/data/interview-full'
import { mockScrapFolders } from '@/mocks/data/scrap-folders'
import { mockStarAnalysis } from '@/mocks/data/star-analysis'
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
  getUpdateKptSelfReviewMockHandler({ isSuccess: true, code: 'SUCCESS', message: 'mock update kpt' }),
  getCreateStarAnalysisMockHandler(mockStarAnalysis),
  getGetScrapFoldersContainingQnaSetMockHandler(mockScrapFolders),
  getCreateScrapFolderMockHandler({ isSuccess: true, code: 'SUCCESS', message: 'mock create scrap folder' }),
)
