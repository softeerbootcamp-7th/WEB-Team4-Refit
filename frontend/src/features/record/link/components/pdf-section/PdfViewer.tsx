import { useMemo, useRef, useState } from 'react'
import { useHighlightContext } from '@/features/record/link/contexts'
import { PdfNavigation } from './PdfNavigation'
import { PdfPage } from './PdfPage'
import { useContainerSize } from './useContainerSize'
import { usePdfLoader } from './usePdfLoader'

type PdfViewerProps = {
  pdfUrl: string
}

export function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const { pdf, isLoading, error } = usePdfLoader(pdfUrl)
  const [selectedPage, setSelectedPage] = useState<number | null>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const containerSize = useContainerSize(viewerRef)
  const { highlights } = useHighlightContext()

  const firstHighlightedPage = useMemo(() => {
    let minPage = Number.POSITIVE_INFINITY

    for (const highlight of highlights.values()) {
      for (const rect of highlight.rects) {
        if (rect.pageNumber > 0 && rect.pageNumber < minPage) {
          minPage = rect.pageNumber
        }
      }
    }

    return Number.isFinite(minPage) ? minPage : null
  }, [highlights])

  const totalPages = pdf?.numPages ?? 0
  const defaultPage = firstHighlightedPage ?? 1
  const resolvedPage = selectedPage ?? defaultPage
  const currentPage = totalPages > 0 ? Math.min(Math.max(resolvedPage, 1), totalPages) : 1
  const isReady = pdf && containerSize.width > 0 && containerSize.height > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {pdf && <PdfNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={setSelectedPage} />}
      <div ref={viewerRef} className="relative min-h-0 flex-1 overflow-hidden">
        {isLoading && <p className="body-m-regular py-10 text-center text-gray-400">PDF 로딩 중...</p>}
        {error && <p className="body-m-regular py-10 text-center text-red-400">{error}</p>}
        {isReady && <PdfPage pdf={pdf} pageNumber={currentPage} containerSize={containerSize} />}
      </div>
    </div>
  )
}
