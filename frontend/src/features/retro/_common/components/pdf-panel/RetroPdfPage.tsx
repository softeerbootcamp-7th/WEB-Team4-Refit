import { useEffect, useRef, useState } from 'react'
import { TextLayer } from 'pdfjs-dist'
import { HighlightLayer } from '@/features/record/link/components/pdf-section/HighlightLayer'
import type { ContainerSize } from '@/features/record/link/components/pdf-section/useContainerSize'
import type { HighlightRect } from '@/features/record/link/contexts'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'

type SavedRect = HighlightRect & { qnaSetId: number; rectIndex: number }

type RetroPdfPageProps = {
  pdf: PDFDocumentProxy
  pageNumber: number
  containerSize: ContainerSize
  savedRects: SavedRect[]
  zoom: number
}

export function RetroPdfPage({ pdf, pageNumber, containerSize, savedRects, zoom }: RetroPdfPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null)
  const pdfContentRef = useRef<HTMLDivElement>(null)
  const [hasSelectableText, setHasSelectableText] = useState(true)

  useEffect(() => {
    let cancelled = false
    let renderTask: RenderTask | null = null
    let textLayerInstance: TextLayer | null = null

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber)
      if (cancelled || !canvasRef.current || !textLayerRef.current || !pdfContentRef.current) return

      const devicePixelRatio = window.devicePixelRatio || 1
      const defaultViewport = page.getViewport({ scale: 1 })
      const baseScale = Math.min(containerSize.height / defaultViewport.height, containerSize.width / defaultViewport.width)
      const scale = baseScale * zoom

      const renderViewport = page.getViewport({ scale: scale * devicePixelRatio })
      const displayViewport = page.getViewport({ scale })

      canvasRef.current.width = renderViewport.width
      canvasRef.current.height = renderViewport.height
      canvasRef.current.style.width = `${displayViewport.width}px`
      canvasRef.current.style.height = `${displayViewport.height}px`

      pdfContentRef.current.style.width = `${displayViewport.width}px`
      pdfContentRef.current.style.height = `${displayViewport.height}px`

      renderTask = page.render({ canvas: canvasRef.current, viewport: renderViewport })
      await renderTask.promise
      if (cancelled) return

      containerRef.current?.style.setProperty('--total-scale-factor', String(displayViewport.scale))
      textLayerRef.current.innerHTML = ''

      const textContent = await page.getTextContent()
      if (cancelled) return

      const hasText = textContent.items.some((item) => 'str' in item && item.str.trim().length > 0)
      setHasSelectableText(hasText)

      textLayerInstance = new TextLayer({
        container: textLayerRef.current,
        textContentSource: textContent,
        viewport: displayViewport,
      })
      await textLayerInstance.render()
    }

    void renderPage()
    return () => {
      cancelled = true
      renderTask?.cancel()
      textLayerInstance?.cancel()
    }
  }, [pdf, pageNumber, containerSize, zoom])

  const pageRects = savedRects.filter((rect) => rect.pageNumber === pageNumber)

  return (
    <div ref={containerRef} className="absolute inset-0 flex overflow-auto">
      <div ref={pdfContentRef} className="relative m-auto shrink-0 overflow-hidden bg-white">
        <canvas ref={canvasRef} className="block bg-white" />
        <div ref={textLayerRef} className="textLayer absolute inset-0" />
        <HighlightLayer savedRects={pageRects} pendingRects={[]} />
        {!hasSelectableText && (
          <p className="body-s-medium pointer-events-none absolute right-2 bottom-2 rounded bg-white/90 px-2 py-1 text-gray-500">
            이미지 기반 PDF라 텍스트 선택이 어려울 수 있어요.
          </p>
        )}
      </div>
    </div>
  )
}
