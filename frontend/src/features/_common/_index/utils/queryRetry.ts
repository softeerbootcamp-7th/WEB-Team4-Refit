const MAX_API_QUERY_RETRY_COUNT = 2

// 네트워크 오류에 대해서만 재시도하고, 그 외 오류는 재시도하지 않도록 함
export function shouldRetryApiQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_API_QUERY_RETRY_COUNT) return false

  if (isAbortError(error)) return false

  return isNetworkError(error)
}

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return true
  if (error instanceof Error && error.name === 'AbortError') return true
  return false
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true
  if (error instanceof DOMException && error.name === 'NetworkError') return true
  return false
}
