import { HttpError } from '@/apis/custom-fetch'

export const getApiErrorCode = (error: unknown): string | undefined => {
  if (!(error instanceof HttpError)) return undefined
  if (!error.payload || typeof error.payload !== 'object') return undefined
  const code = (error.payload as { code?: unknown }).code
  return typeof code === 'string' ? code : undefined
}
