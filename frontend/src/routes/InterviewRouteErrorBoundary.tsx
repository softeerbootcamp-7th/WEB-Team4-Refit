import { isRouteErrorResponse, Navigate, useRouteError } from 'react-router'
import { HttpError } from '@/apis/custom-fetch'
import { getInterviewErrorRoute } from '@/routes/interviewErrorRoute'
import { ROUTES } from '@/routes/routes'

function isForbiddenError(error: unknown): boolean {
  if (isRouteErrorResponse(error)) return error.status === 403
  if (error instanceof HttpError) return error.status === 403
  return false
}

function isInterviewNotFoundError(error: unknown): boolean {
  if (isRouteErrorResponse(error)) return error.status === 404

  return getInterviewErrorRoute(error) === ROUTES.INTERVIEW_NOT_FOUND
}

export default function InterviewRouteErrorBoundary() {
  const error = useRouteError()

  if (isForbiddenError(error)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }

  if (isInterviewNotFoundError(error)) {
    return <Navigate to={ROUTES.INTERVIEW_NOT_FOUND} replace />
  }

  return <Navigate to={ROUTES.DASHBOARD} replace />
}
