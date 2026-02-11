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
export default customFetch
