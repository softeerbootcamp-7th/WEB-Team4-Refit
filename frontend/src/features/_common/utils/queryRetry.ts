import { HttpError } from '@/apis/custom-fetch'
import { getApiErrorCode } from '@/features/_common/utils/error'

const MAX_API_QUERY_RETRY_COUNT = 2
const INTERVIEW_NOT_ACCESSIBLE_ERROR_CODE = 'INTERVIEW_NOT_ACCESSIBLE'
const INTERVIEW_NOT_FOUND_ERROR_CODE = 'INTERVIEW_NOT_FOUND'

// 면접이 존재하지 않거나 접근 권한이 없는 경우에는 재시도하지 않도록 함
export function shouldRetryApiQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_API_QUERY_RETRY_COUNT) return false

  if (!(error instanceof HttpError)) return true

  const errorCode = getApiErrorCode(error)
  const isInterviewNotAccessibleError = error.status === 403 && errorCode === INTERVIEW_NOT_ACCESSIBLE_ERROR_CODE
  const isInterviewNotFoundError = error.status === 404 && errorCode === INTERVIEW_NOT_FOUND_ERROR_CODE

  if (isInterviewNotAccessibleError || isInterviewNotFoundError) return false

  if (error.status === 404) return true

  if (error.status >= 500 || error.status === 429 || error.status === 408) return true

  return false
}
