import { useEffect, useRef } from 'react'
import { TextLayer } from 'pdfjs-dist'
import { useHighlightContext } from '@/pages/record/_link/contexts'
import { HighlightLayer } from './HighlightLayer'
import { useTextSelection } from './useTextSelection'
import type { ContainerSize } from './useContainerSize'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'

type PdfPageProps = {
  pdf: PDFDocumentProxy
  pageNum: number
  containerSize: ContainerSize
}

export function PdfPage({ pdf, pageNum, containerSize }: PdfPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null)
  const pdfContentRef = useRef<HTMLDivElement>(null) // PDF canvas + textLayer를 감싸는 ref

  const { linkingQnaSetId, pendingSelection, setPendingSelection, highlights } = useHighlightContext()

  const isLinkingMode = linkingQnaSetId !== null

  const { handleMouseUp } = useTextSelection({
    containerRef: pdfContentRef,
    pageNum,
    isLinkingMode,
    pendingSelection,
    setPendingSelection,
  })

  useEffect(() => {
    let cancelled = false
    let renderTask: RenderTask | null = null
    let textLayerInstance: TextLayer | null = null

    const renderPage = async () => {
      const page = await pdf.getPage(pageNum)
      if (cancelled || !canvasRef.current || !textLayerRef.current || !containerRef.current) return

      const defaultViewport = page.getViewport({ scale: 1 })
      const scale = Math.min(containerSize.height / defaultViewport.height, containerSize.width / defaultViewport.width)
      const viewport = page.getViewport({ scale })

      canvasRef.current.width = viewport.width
      canvasRef.current.height = viewport.height
      renderTask = page.render({ canvas: canvasRef.current, viewport })
      await renderTask.promise

      if (cancelled) return

      containerRef.current.style.setProperty('--total-scale-factor', String(viewport.scale))
      textLayerRef.current.innerHTML = ''

      const textContent = await page.getTextContent()
      if (cancelled) return

      textLayerInstance = new TextLayer({
        container: textLayerRef.current,
        textContentSource: textContent,
        viewport,
      })
      await textLayerInstance.render()
    }

    renderPage().catch(() => {})
    return () => {
      cancelled = true
      renderTask?.cancel()
      textLayerInstance?.cancel()
    }
  }, [pdf, pageNum, containerSize])

  const savedRects = Array.from(highlights.values()).flatMap((h) => h.rects.filter((r) => r.pageNum === pageNum))
  const pendingRects = pendingSelection?.rects.filter((r) => r.pageNum === pageNum) ?? []

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center" onMouseUp={handleMouseUp}>
      <div ref={pdfContentRef} className="relative">
        <canvas ref={canvasRef} />
        <div ref={textLayerRef} className="textLayer" />
        <HighlightLayer savedRects={savedRects} pendingRects={pendingRects} />
      </div>
    </div>
  )
}
