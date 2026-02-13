import { useRef, useState } from 'react'
import { PdfNavigation } from './PdfNavigation'
import { PdfPage } from './PdfPage'
import { useContainerSize } from './useContainerSize'
import { usePdfLoader } from './usePdfLoader'

type PdfViewerProps = {
  pdfUrl: string
}

export function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const { pdf, isLoading, error } = usePdfLoader(pdfUrl)
  const [currentPage, setCurrentPage] = useState(1)
  const viewerRef = useRef<HTMLDivElement>(null)
  const containerSize = useContainerSize(viewerRef)

  const totalPages = pdf?.numPages ?? 0
  const isReady = pdf && containerSize.width > 0 && containerSize.height > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {pdf && <PdfNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
      <div ref={viewerRef} className="relative min-h-0 flex-1 overflow-hidden">
        {isLoading && <p className="body-m-regular py-10 text-center text-gray-400">PDF 로딩 중...</p>}
        {error && <p className="body-m-regular py-10 text-center text-red-400">{error}</p>}
        {isReady && <PdfPage pdf={pdf} pageNumber={currentPage} containerSize={containerSize} />}
      </div>
    </div>
  )
}
