import { HttpError } from '@/apis/custom-fetch'
import { getApiErrorCode } from '@/features/_common/_index/utils/error'
import { ROUTES } from '@/routes/routes'

const INTERVIEW_NOT_FOUND_ERROR_CODE = 'INTERVIEW_NOT_FOUND'

export function getInterviewErrorRoute(error: unknown): string | null {
  if (!(error instanceof HttpError)) return null

  if (error.status === 403) {
    return ROUTES.FORBIDDEN
  }

  if (error.status !== 404) return null

  const errorCode = getApiErrorCode(error)
  if (!errorCode || errorCode === INTERVIEW_NOT_FOUND_ERROR_CODE) {
    return ROUTES.INTERVIEW_NOT_FOUND
  }

  return null
}

export function shouldThrowInterviewRouteError(error: unknown): boolean {
  return getInterviewErrorRoute(error) !== null
}
