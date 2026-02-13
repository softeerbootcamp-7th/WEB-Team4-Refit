import type { ApiResponsePageQnaSetScrapFolderResponse } from '@/apis/generated/refit-api.schemas'

export const mockScrapFolders: ApiResponsePageQnaSetScrapFolderResponse = {
  isSuccess: true,
  code: 'SUCCESS',
  message: 'mock scrap folders',
  result: {
    content: [
      { scrapFolderId: 1, scrapFolderName: '기술 면접 모음', contains: true },
      { scrapFolderId: 2, scrapFolderName: '인성 면접 모음', contains: false },
      { scrapFolderId: 3, scrapFolderName: '자주 나오는 질문', contains: false },
    ],
    totalElements: 3,
    totalPages: 1,
    size: 100,
    number: 0,
    first: true,
    last: true,
    empty: false,
  },
}
