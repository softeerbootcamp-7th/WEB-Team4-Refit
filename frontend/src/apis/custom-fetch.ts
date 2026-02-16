import qs from 'qs'
import { markAuthenticated, markUnauthenticated } from '@/routes/middleware/auth-session'

export class HttpError<T = unknown> extends Error {
  status: number
  payload: unknown

  constructor(status: number, payload: T) {
    super(`HTTP Error: ${status}`)
    this.name = 'HttpError'
    this.status = status
    this.payload = payload
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const REISSUE_PATH = '/auth/reissue'
let reissuePromise: Promise<void> | null = null

export const customFetch = async <T>(urlWithoutBase: string, initOptions: RequestInit): Promise<T> => {
  const isReissueRequest = urlWithoutBase.startsWith(REISSUE_PATH)

  try {
    const data = await requestJson<T>(urlWithoutBase, initOptions)
    if (isReissueRequest) {
      const responseCode = data && typeof data === 'object' ? (data as { code?: unknown }).code : undefined
      if (responseCode === 'LOGIN_REQUIRED') {
        markUnauthenticated()
      } else {
        markAuthenticated()
      }
    }
    return data
  } catch (error) {
    const shouldReissue =
      error instanceof HttpError &&
      !!error.payload &&
      typeof error.payload === 'object' &&
      (error.payload as { code?: unknown }).code === 'TOKEN_REISSUE_REQUIRED'

    if (isReissueRequest || !shouldReissue) {
      throw error
    }

    await reissueTokens()
    return requestJson<T>(urlWithoutBase, initOptions)
  }
}
export default customFetch

const withDefaultOptions = (options: RequestInit = {}): RequestInit => {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  return {
    ...options,
    headers,
    credentials: 'include',
  }
}

const requestJson = async <T>(urlWithoutBase: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${BASE_URL}${urlWithoutBase}`, withDefaultOptions(options))
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new HttpError(response.status, data)
  }

  return data as T
}

const reissueTokens = async (): Promise<void> => {
  reissuePromise ??= requestJson(REISSUE_PATH, { method: 'GET' })
    .then((reissueResponse) => {
      const responseCode =
        reissueResponse && typeof reissueResponse === 'object'
          ? (reissueResponse as { code?: unknown }).code
          : undefined

      if (responseCode === 'LOGIN_REQUIRED') {
        markUnauthenticated()
        return
      }

      markAuthenticated()
    })
    .catch((error) => {
      markUnauthenticated()
      throw error
    })
    .finally(() => {
      reissuePromise = null
    })

  return reissuePromise
}
type QuerySerializationOptions = {
  arrayFormat?: 'indices' | 'brackets' | 'repeat' | 'comma'
}

export const customFetchWithSerializedQuery = async <T>(
  path: string,
  query: Record<string, unknown>,
  initOptions: RequestInit,
  options: QuerySerializationOptions = {},
): Promise<T> => {
  const queryString = qs.stringify(query, {
    arrayFormat: options.arrayFormat ?? 'repeat',
    skipNulls: true,
  })
  const urlWithQuery = queryString ? `${path}?${queryString}` : path
  return customFetch<T>(urlWithQuery, initOptions)
}
