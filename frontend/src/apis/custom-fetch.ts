import qs from 'qs'

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

const getUrl = (urlWithoutBase: string): string => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
  return `${BASE_URL}${urlWithoutBase}`
}

const getOptions = (options: RequestInit = {}): RequestInit => {
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

export const customFetch = async <T>(urlWithoutBase: string, initOptions: RequestInit): Promise<T> => {
  const targetUrl = getUrl(urlWithoutBase)
  const options = getOptions(initOptions)
  const response = await fetch(targetUrl, options)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new HttpError<Error>(response.status, data)
  }

  return data as T
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

export default customFetch
