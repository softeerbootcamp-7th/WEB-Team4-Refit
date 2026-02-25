import { useEffect, useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCreatePdfDownloadUrl } from '@/apis/generated/interview-api/interview-api'
import { PDF_OBJECT_URL_GC_TIME, PDF_OBJECT_URL_STALE_TIME } from '@/constants/queryCachePolicy'

type DownloadInfo = {
  downloadUrl: string
  updatedAt: string
}
type UsePdfCachedUrlParams = {
  interviewId: number
  hasPdf: boolean
  onDownloadSuccess: () => void
  onDownloadError: () => void
}
type UsePdfCachedUrlReturn = {
  resolvedPdfUrl: string | null
  isDownloadFetching: boolean
}

/**
 * PDF URL 해석 훅
 * - hasPdf=true일 때 presigned URL을 조회한다.
 * - updatedAt 기반 key로 object URL 캐시를 분리한다.
 * - 캐시 MISS면 presigned URL에서 PDF를 받아 object URL로 저장한다.
 */
export function usePdfCachedUrl({
  interviewId,
  hasPdf,
  onDownloadSuccess,
  onDownloadError,
}: UsePdfCachedUrlParams): UsePdfCachedUrlReturn {
  const queryClient = useQueryClient()
  const prevDownloadSuccessRef = useRef(false)
  const prevDownloadErrorRef = useRef(false)
  const attemptedBlobFetchKeyRef = useRef<string | null>(null)

  const {
    data: downloadInfo,
    isFetching: isDownloadFetching,
    isError: isDownloadError,
    isSuccess: isDownloadSuccess,
  } = useCreatePdfDownloadUrl<DownloadInfo>(interviewId, {
    query: {
      // presigned URL은 만료되므로 진입 시마다 최신 값을 조회한다.
      enabled: hasPdf,
      retry: false,
      refetchOnMount: true,
      select: (res) => {
        const presigned = res.result?.presignedUrlDto
        const updatedAt = res.result?.pdfUploadUrlPublishedAt

        if (!presigned?.url || !updatedAt) {
          throw new Error('presignedUrl 또는 pdfUploadUrlPublishedAt이 없습니다.')
        }

        return { downloadUrl: presigned.url, updatedAt }
      },
    },
  })

  // 같은 interviewId라도 updatedAt이 바뀌면 다른 key를 사용해 버전 캐시를 분리한다.
  const pdfObjectUrlQueryKey = useMemo(
    () => (downloadInfo ? getPdfObjectUrlKey(interviewId, downloadInfo.updatedAt) : null),
    [downloadInfo, interviewId],
  )

  const { data: cachedPdfUrl } = useQuery<string | null>({
    queryKey: pdfObjectUrlQueryKey ?? [...getPdfObjectUrlKeyPrefix(interviewId), 'pending'],
    queryFn: () => null,
    enabled: !!pdfObjectUrlQueryKey,
    staleTime: PDF_OBJECT_URL_STALE_TIME,
    gcTime: PDF_OBJECT_URL_GC_TIME,
  })

  const isFetchingPdfBlobRef = useRef(false)

  // 캐시 MISS면 presigned URL로 PDF를 받아 object URL을 만든 뒤 캐시에 저장한다.
  useEffect(() => {
    if (!hasPdf || isDownloadError) return
    if (!downloadInfo || !pdfObjectUrlQueryKey || cachedPdfUrl !== null || isFetchingPdfBlobRef.current) return
    const attemptKey = `${downloadInfo.updatedAt}:${downloadInfo.downloadUrl}`
    if (attemptedBlobFetchKeyRef.current === attemptKey) return

    let cancelled = false
    isFetchingPdfBlobRef.current = true
    attemptedBlobFetchKeyRef.current = attemptKey

    void fetch(downloadInfo.downloadUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`PDF download failed: ${res.status}`)
        return res.blob()
      })
      .then((blob) => {
        if (cancelled) return
        const blobUrl = URL.createObjectURL(blob)
        queryClient.setQueryData(pdfObjectUrlQueryKey, blobUrl)
      })
      .catch(() => {
        if (cancelled) return
        // 같은 presigned URL에 대한 자동 무한 재시도를 막기 위해 캐시만 정리한다.
        clearPdfObjectUrlCache(queryClient, interviewId)
      })
      .finally(() => {
        if (!cancelled) isFetchingPdfBlobRef.current = false
      })

    return () => {
      cancelled = true
      isFetchingPdfBlobRef.current = false
    }
  }, [hasPdf, isDownloadError, downloadInfo, pdfObjectUrlQueryKey, cachedPdfUrl, queryClient, interviewId])

  useEffect(() => {
    if (isDownloadSuccess && !prevDownloadSuccessRef.current) {
      onDownloadSuccess()
    }
    prevDownloadSuccessRef.current = isDownloadSuccess
  }, [isDownloadSuccess, onDownloadSuccess])

  useEffect(() => {
    if (isDownloadError && !prevDownloadErrorRef.current) {
      // 서버 기준 PDF 없음/접근 불가 상태면 캐시를 정리하고 상위 상태를 false로 전환한다.
      clearPdfObjectUrlCache(queryClient, interviewId)
      onDownloadError()
    }
    prevDownloadErrorRef.current = isDownloadError
  }, [isDownloadError, queryClient, interviewId, onDownloadError])

  // 브라우저 메모리 복원 이슈로 object URL이 깨진 경우 캐시를 정리한다.
  useEffect(() => {
    if (!cachedPdfUrl?.startsWith('blob:')) return

    let cancelled = false

    void fetch(cachedPdfUrl)
      .then((res) => {
        if (!res.ok) throw new Error('blob object URL fetch failed')
      })
      .catch(() => {
        if (cancelled) return
        // object URL이 깨졌으면 캐시를 정리하고 다음 진입에서 재시도한다.
        clearPdfObjectUrlCache(queryClient, interviewId)
      })

    return () => {
      cancelled = true
    }
  }, [cachedPdfUrl, queryClient, interviewId])

  const resolvedPdfUrl = hasPdf ? (cachedPdfUrl ?? null) : null

  return { resolvedPdfUrl, isDownloadFetching: isDownloadFetching || (hasPdf && !cachedPdfUrl && !!downloadInfo) }
}

export const getPdfObjectUrlKey = (interviewId: number, updatedAt: string) => [
  'interview',
  interviewId,
  'pdf-object-url',
  updatedAt,
]
export const getPdfObjectUrlKeyPrefix = (interviewId: number) => ['interview', interviewId, 'pdf-object-url'] as const

export function revokeIfBlobUrl(value: unknown) {
  if (typeof value === 'string' && value.startsWith('blob:')) {
    URL.revokeObjectURL(value)
  }
}
export function clearPdfObjectUrlCache(queryClient: ReturnType<typeof useQueryClient>, interviewId: number) {
  const queries = queryClient.getQueryCache().findAll({ queryKey: getPdfObjectUrlKeyPrefix(interviewId) })

  for (const query of queries) {
    revokeIfBlobUrl(query.state.data)
    queryClient.removeQueries({ queryKey: query.queryKey, exact: true })
  }
}
