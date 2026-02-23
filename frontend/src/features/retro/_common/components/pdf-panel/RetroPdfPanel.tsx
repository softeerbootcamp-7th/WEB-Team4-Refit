import { useCallback, useMemo, useRef, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getGetPdfHighlightingsQueryKey, getPdfHighlightings } from '@/apis/generated/qna-set-api/qna-set-api'
import type { ApiResponseListPdfHighlightingDto } from '@/apis/generated/refit-api.schemas'
import { LoadingSpinner } from '@/designs/assets'
import { PdfNavigation } from '@/features/record/link/components/pdf-section/PdfNavigation'
import { useContainerSize } from '@/features/record/link/components/pdf-section/useContainerSize'
import { usePdfCachedUrl } from '@/features/record/link/components/pdf-section/usePdfCachedUrl'
import { usePdfLoader } from '@/features/record/link/components/pdf-section/usePdfLoader'
import { RetroPdfPage } from './RetroPdfPage'

type RetroPdfPanelProps = {
  interviewId: number
  hasPdf: boolean
  qnaSetIds: number[]
}

export function RetroPdfPanel({ interviewId, hasPdf: initialHasPdf, qnaSetIds }: RetroPdfPanelProps) {
  const [hasPdf, setHasPdf] = useState(initialHasPdf)
  const [selectedPage, setSelectedPage] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)
  const viewerRef = useRef<HTMLDivElement>(null)
  const containerSize = useContainerSize(viewerRef)

  const handleDownloadSuccess = useCallback(() => setHasPdf(true), [])
  const handleDownloadError = useCallback(() => setHasPdf(false), [])

  const { resolvedPdfUrl, isDownloadFetching } = usePdfCachedUrl({
    interviewId,
    hasPdf,
    onDownloadSuccess: handleDownloadSuccess,
    onDownloadError: handleDownloadError,
  })

  const highlightQueries = useQueries({
    queries: (hasPdf ? qnaSetIds : []).map((qnaSetId) => ({
      queryKey: getGetPdfHighlightingsQueryKey(qnaSetId),
      queryFn: async () => {
        try {
          return await getPdfHighlightings(qnaSetId)
        } catch {
          return {
            isSuccess: false,
            code: 'PDF_HIGHLIGHTING_FALLBACK_EMPTY',
            message: '하이라이트 조회 실패',
            result: [],
          } satisfies ApiResponseListPdfHighlightingDto
        }
      },
    })),
  })

  const savedRects = useMemo(() => {
    return qnaSetIds.flatMap((qnaSetId, queryIndex) => {
      const items = highlightQueries[queryIndex]?.data?.result ?? []
      const first = items[0]
      if (!first?.rects?.length) return []
      return first.rects.map((rect, rectIndex) => ({
        x: rect.x ?? 0,
        y: rect.y ?? 0,
        width: rect.width ?? 0,
        height: rect.height ?? 0,
        pageNumber: rect.pageNumber ?? 1,
        qnaSetId,
        rectIndex,
      }))
    })
  }, [qnaSetIds, highlightQueries])

  const { pdf, isLoading: isPdfLoading, error: pdfLoadError } = usePdfLoader(resolvedPdfUrl ?? '')
  const totalPages = pdf?.numPages ?? 0
  const firstHighlightedPage = savedRects.length > 0 ? Math.max(1, savedRects[0].pageNumber) : 1
  const currentPage = selectedPage ?? firstHighlightedPage
  const isReady = !!pdf && containerSize.width > 0 && containerSize.height > 0

  const isLoading = isDownloadFetching || isPdfLoading
  const hasError = !!pdfLoadError

  if (!hasPdf) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 p-6 pr-0">
        <p className="body-s-medium text-gray-500">업로드된 자기소개서 PDF가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-gray-100 p-6 pr-0">
      {pdf && (
        <PdfNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setSelectedPage}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      )}
      <div ref={viewerRef} className="relative min-h-0 flex-1 overflow-hidden">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        )}
        {hasError && <p className="body-m-regular py-10 text-center text-red-400">PDF를 불러오는 데 실패했습니다.</p>}
        {isReady && (
          <RetroPdfPage
            pdf={pdf}
            pageNumber={currentPage}
            containerSize={containerSize}
            savedRects={savedRects}
            zoom={zoom}
          />
        )}
      </div>
    </div>
  )
}
