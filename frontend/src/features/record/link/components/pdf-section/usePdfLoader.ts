import { useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

type PdfLoadState = {
  pdf: PDFDocumentProxy | null
  isLoading: boolean
  error: string | null
}

export function usePdfLoader(pdfUrl: string): PdfLoadState {
  const [state, setState] = useState<PdfLoadState>(() => ({
    pdf: null,
    isLoading: !!pdfUrl,
    error: null,
  }))

  useEffect(() => {
    if (!pdfUrl) return

    let cancelled = false

    const loadPdf = async () => {
      setState({ pdf: null, isLoading: true, error: null })

      try {
        const doc = await pdfjsLib.getDocument(pdfUrl).promise
        if (!cancelled) {
          setState({ pdf: doc, isLoading: false, error: null })
        }
      } catch (err) {
        if (!cancelled) {
          setState({ pdf: null, isLoading: false, error: 'PDF를 불러오는 데 실패했습니다.' })
          console.error('PDF load error:', err)
        }
      }
    }

    loadPdf()
    return () => {
      cancelled = true // 언마운트되거나 pdfUrl이 바뀌면 이전 로딩 결과 무시
    }
  }, [pdfUrl])

  return state
}
