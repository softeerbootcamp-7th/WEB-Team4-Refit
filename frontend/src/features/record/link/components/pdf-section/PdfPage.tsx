import { useEffect, useRef, useState } from 'react'
import { TextLayer } from 'pdfjs-dist'
import { useHighlightContext } from '@/features/record/link/contexts'
import { HighlightLayer } from './HighlightLayer'
import { useTextSelection } from './useTextSelection'
import type { ContainerSize } from './useContainerSize'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'

type PdfPageProps = {
  pdf: PDFDocumentProxy
  pageNumber: number
  containerSize: ContainerSize
  zoom: number
}

export function PdfPage({ pdf, pageNumber, containerSize, zoom }: PdfPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null)
  const pdfContentRef = useRef<HTMLDivElement>(null) // PDF canvas + textLayer를 감싸는 ref
  const [hasSelectableText, setHasSelectableText] = useState(true)

  const { linkingQnaSetId, pendingSelection, setPendingSelection, highlights } = useHighlightContext()

  const isLinkingMode = linkingQnaSetId !== null

  const { handleMouseUp } = useTextSelection({
    containerRef: pdfContentRef,
    pageNumber,
    isLinkingMode,
    pendingSelection,
    setPendingSelection,
    highlights,
    linkingQnaSetId,
  })

  useEffect(() => {
    let cancelled = false
    let renderTask: RenderTask | null = null
    let textLayerInstance: TextLayer | null = null

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber)
      if (cancelled || !canvasRef.current || !textLayerRef.current || !containerRef.current) return

      const devicePixelRatio = window.devicePixelRatio || 1
      const defaultViewport = page.getViewport({ scale: 1 })
      const baseScale = Math.min(
        containerSize.height / defaultViewport.height,
        containerSize.width / defaultViewport.width,
      )
      const scale = baseScale * zoom

      const renderViewport = page.getViewport({ scale: scale * devicePixelRatio })
      const displayViewport = page.getViewport({ scale })

      // Drawing Buffer: 실제로 그릴 픽셀 개수
      canvasRef.current.width = renderViewport.width
      canvasRef.current.height = renderViewport.height
      // Display Size: CSS 화면 크기 계산
      canvasRef.current.style.width = `${displayViewport.width}px`
      canvasRef.current.style.height = `${displayViewport.height}px`

      if (pdfContentRef.current) {
        pdfContentRef.current.style.width = `${displayViewport.width}px`
        pdfContentRef.current.style.height = `${displayViewport.height}px`
      }

      renderTask = page.render({ canvas: canvasRef.current, viewport: renderViewport })
      await renderTask.promise

      if (cancelled) return

      containerRef.current.style.setProperty('--total-scale-factor', String(displayViewport.scale))
      textLayerRef.current.innerHTML = ''

      const textContent = await page.getTextContent()
      if (cancelled) return
      const hasText = textContent.items.some((item) => 'str' in item && item.str.trim().length > 0)
      setHasSelectableText(hasText)
      if (!hasText) return

      textLayerInstance = new TextLayer({
        container: textLayerRef.current,
        textContentSource: textContent,
        viewport: displayViewport,
      })
      await textLayerInstance.render()
    }

    renderPage().catch(() => {})
    return () => {
      cancelled = true
      renderTask?.cancel()
      textLayerInstance?.cancel()
    }
  }, [pdf, pageNumber, containerSize, zoom])

  const savedRects = Array.from(highlights.entries()).flatMap(([qnaSetId, h]) =>
    h.rects.filter((r) => r.pageNumber === pageNumber).map((r, i) => ({ ...r, qnaSetId, rectIndex: i })),
  )
  const pendingRects = pendingSelection?.rects.filter((r) => r.pageNumber === pageNumber) ?? []

  return (
    <div ref={containerRef} className="absolute inset-0 flex overflow-auto" onMouseUp={handleMouseUp}>
      <div ref={pdfContentRef} className="relative m-auto shrink-0 overflow-hidden">
        <canvas ref={canvasRef} />
        <div ref={textLayerRef} className="textLayer absolute inset-0" />
        <HighlightLayer savedRects={savedRects} pendingRects={pendingRects} />
        {!hasSelectableText && (
          <p className="body-m-medium pointer-events-none absolute right-4 bottom-4 rounded-lg border border-orange-400 bg-white/85 px-2 py-1 text-gray-600">
            이미지 기반 PDF라 텍스트 선택이 어려울 수 있어요.
          </p>
        )}
      </div>
    </div>
  )
}
