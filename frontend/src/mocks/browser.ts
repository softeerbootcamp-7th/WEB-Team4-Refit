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
  getGetPdfHighlightingsMockHandler,
  getGetScrapFoldersContainingQnaSetMockHandler,
  getUpdatePdfHighlightingMockHandler,
  getUpdateQnaSetMockHandler,
} from '@/apis/generated/qna-set-api/qna-set-api.msw'
import {
  getSearchMyQnaSetMockHandler,
  getGetMyFrequentQnaSetCategoriesMockHandler,
  getGetMyFrequentQnaSetCategoryQuestionsMockHandler,
} from '@/apis/generated/qna-set-my-controller/qna-set-my-controller.msw'
import type { QnaSetSearchRequest } from '@/apis/generated/refit-api.schemas'
import { getCreateScrapFolderMockHandler } from '@/apis/generated/scrap-folder-api/scrap-folder-api.msw'
import { debriefIncompletedMock } from '@/mocks/data/debrief-incompleted'
import { mockInterviewFull } from '@/mocks/data/interview-full'
import {
  getMockFrequentCategoryQuestions,
  getMockSearchMyQnaSet,
  mockFrequentQuestionCategories,
} from '@/mocks/data/my-frequent-questions'
import { mockScrapFolders } from '@/mocks/data/scrap-folders'
import { mockStarAnalysis } from '@/mocks/data/star-analysis'
import { updateRawTextMock } from '@/mocks/data/update-raw-text'

export const worker = setupWorker(
  getGetMyFrequentQnaSetCategoriesMockHandler(mockFrequentQuestionCategories),
  getGetMyFrequentQnaSetCategoryQuestionsMockHandler((info) => {
    const categoryId = Number(info.params.categoryId)
    const url = new URL(info.request.url)
    const page = Number(url.searchParams.get('page') ?? '0')
    const size = Number(url.searchParams.get('size') ?? '9')
    return getMockFrequentCategoryQuestions(categoryId, page, size)
  }),
  getSearchMyQnaSetMockHandler(async (info) => {
    const url = new URL(info.request.url)
    const page = Number(url.searchParams.get('page') ?? '0')
    const size = Number(url.searchParams.get('size') ?? '9')
    const request = (await info.request.json().catch(() => ({}))) as QnaSetSearchRequest
    return getMockSearchMyQnaSet({ page, size, request })
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
