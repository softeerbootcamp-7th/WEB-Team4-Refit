import { useEffect, useRef, useState } from 'react'
import { FilePlusIcon } from '@/designs/assets'
import { Button } from '@/designs/components'
import { useInterviewNavigate } from '@/features/_common/hooks/useInterviewNavigation'
import { useHighlightContext } from '@/features/record/link/contexts'
import { ROUTES } from '@/routes/routes'
import { PdfViewer } from './PdfViewer'

export function PdfSection() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { linkingQnaSetId, setHasPdf, clearAllHighlights } = useHighlightContext()

  const navigateWithId = useInterviewNavigate()
  const goToConfirmPage = () => navigateWithId(ROUTES.RECORD_CONFIRM)
  const goToRetroPage = () => navigateWithId(ROUTES.RETRO_QUESTION)

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (pdfUrl) URL.revokeObjectURL(pdfUrl)

    const objectUrl = URL.createObjectURL(file)
    setPdfUrl(objectUrl)
    setHasPdf(true)
  }

  const handleRemovePdf = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    setPdfUrl(null)
    setHasPdf(false)
    clearAllHighlights()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const isLinking = linkingQnaSetId !== null

  return (
    <div className={`relative flex h-full flex-col gap-5 p-6 ${isLinking ? 'z-50 bg-gray-100' : ''}`}>
      <div className="absolute top-10 right-10 flex items-center justify-end">
        {pdfUrl && (
          <Button variant="outline-gray-100" onClick={handleRemovePdf} size="xs">
            업로드 취소
          </Button>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />

      {pdfUrl ? (
        <PdfViewer pdfUrl={pdfUrl} />
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="title-s-bold flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-300"
        >
          <div className="flex flex-col items-center gap-1">
            자기소개서 불러오기
            <FilePlusIcon className="h-14 w-14" />
          </div>
        </button>
      )}

      <div className="flex shrink-0 justify-end gap-3">
        <Button variant="outline-gray-white" size="md" onClick={goToConfirmPage}>
          뒤로 가기
        </Button>
        <Button variant="fill-orange-500" size="md" className="w-60" onClick={goToRetroPage}>
          회고 하러 가기
        </Button>
      </div>
    </div>
  )
}
