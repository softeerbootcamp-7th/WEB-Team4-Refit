import { setupWorker } from 'msw/browser'
import {
  getGetDashboardCalendarInterviewsMockHandler,
  getGetDashboardHeadlineMockHandler,
  getGetDebriefIncompletedInterviewsMockHandler,
  getGetMyDifficultQnaSetsMockHandler,
  getGetUpcomingInterviewsMockHandler,
} from '@/apis/generated/dashboard-api/dashboard-api.msw'
import { getGetIndustriesMockHandler } from '@/apis/generated/industry-api/industry-api.msw'
import {
  getGetInterviewFullMockHandler,
  getUpdateKptSelfReviewMockHandler,
  getUpdateRawTextMockHandler,
} from '@/apis/generated/interview-api/interview-api.msw'
import { getGetAllJobCategoriesMockHandler } from '@/apis/generated/job-category-api/job-category-api.msw'
import {
  getCreateStarAnalysisMockHandler,
  getGetFrequentQuestionsMockHandler,
  getGetPdfHighlightingsMockHandler,
  getGetScrapFoldersContainingQnaSetMockHandler,
  getUpdatePdfHighlightingMockHandler,
  getUpdateQnaSetMockHandler,
} from '@/apis/generated/qna-set-api/qna-set-api.msw'
import { getCreateScrapFolderMockHandler } from '@/apis/generated/scrap-folder-api/scrap-folder-api.msw'
import { debriefIncompletedMock } from '@/mocks/data/debrief-incompleted'
import { mockInterviewFull } from '@/mocks/data/interview-full'
import { mockScrapFolders } from '@/mocks/data/scrap-folders'
import { mockStarAnalysis } from '@/mocks/data/star-analysis'
import { getMockFrequentQuestions } from '@/mocks/data/trend-questions'
import { updateRawTextMock } from '@/mocks/data/update-raw-text'

export const worker = setupWorker(
  getGetFrequentQuestionsMockHandler((info) => {
    const url = new URL(info.request.url)
    const parseIds = (key: 'industryIds' | 'jobCategoryIds') => {
      const repeated = url.searchParams.getAll(key)
      const source = repeated.length > 0 ? repeated : (url.searchParams.get(key) ?? '').split(',')
      return source.map((v) => Number(v)).filter((v) => Number.isFinite(v))
    }
    const industryIds = parseIds('industryIds')
    const jobCategoryIds = parseIds('jobCategoryIds')
    const page = Number(url.searchParams.get('page') ?? '0')
    const size = Number(url.searchParams.get('size') ?? '100')

    return getMockFrequentQuestions({ industryIds, jobCategoryIds, page, size })
  }),
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
  getGetPdfHighlightingsMockHandler({
    isSuccess: true,
    code: 'SUCCESS',
    message: 'mock get pdf highlightings',
    result: [],
  }),
  getUpdatePdfHighlightingMockHandler({ isSuccess: true, code: 'SUCCESS', message: 'mock update pdf highlighting' }),
)
