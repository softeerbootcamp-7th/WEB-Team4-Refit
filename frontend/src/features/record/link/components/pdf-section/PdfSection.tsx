import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router'
import {
  createPdfUploadUrl,
  useCreatePdfDownloadUrl,
  useCompleteQnaSetDraft,
  useDeleteInterviewPdf,
} from '@/apis/generated/interview-api/interview-api'
import { FilePlusIcon } from '@/designs/assets'
import { Button } from '@/designs/components'
import { useInterviewNavigate } from '@/features/_common/hooks/useInterviewNavigation'
import { useHighlightContext } from '@/features/record/link/contexts'
import { ROUTES } from '@/routes/routes'
import { PdfViewer } from './PdfViewer'

export function PdfSection() {
  const { interviewId: interviewIdParam } = useParams()
  const interviewId = Number(interviewIdParam)
  const [pdfObjectUrl, setPdfObjectUrl] = useState<string | null>(null)
  const pdfObjectUrlRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { hasPdf, linkingQnaSetId, setHasPdf, clearAllHighlights } = useHighlightContext()
  const { mutate: completeQnaSetDraft, isPending: isCompletingQnaSetDraft } = useCompleteQnaSetDraft()

  const navigateWithId = useInterviewNavigate()
  const goToConfirmPage = () => navigateWithId(ROUTES.RECORD_CONFIRM)
  const goToRetroPage = () => {
    completeQnaSetDraft(
      { interviewId },
      {
        onSuccess: () => {
          navigateWithId(ROUTES.RETRO)
        },
      },
    )
  }

  const replacePdfObjectUrl = (next: string | null) => {
    const prev = pdfObjectUrlRef.current

    // 메모리 누수 방지
    if (prev) URL.revokeObjectURL(prev)

    pdfObjectUrlRef.current = next
    setPdfObjectUrl(next)
  }

  useEffect(() => {
    return () => {
      if (pdfObjectUrlRef.current) URL.revokeObjectURL(pdfObjectUrlRef.current)
    }
  }, [])

  const {
    data: downloadUrl,
    isFetching: isDownloadFetching,
    isError: isDownloadError,
  } = useCreatePdfDownloadUrl<string>(interviewId, {
    query: {
      enabled: hasPdf && !pdfObjectUrl && Number.isFinite(interviewId) && interviewId > 0,
      select: (res) => {
        const downloadUrl = res.result?.url
        if (!downloadUrl) throw new Error('다운로드 URL이 없습니다.')
        return downloadUrl
      },
    },
  })

  const {
    mutate: uploadPdf,
    isPending: isUploadPending,
    isError: isUploadError,
  } = useMutation({
    mutationFn: async (file: File) => {
      const res = await createPdfUploadUrl(interviewId)
      const uploadUrl = res.result?.url
      if (!uploadUrl) throw new Error('업로드 URL이 없습니다.')

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          // TODO: 'application/pdf' 로 수정
          'Content-Type': 'application',
        },
        body: file,
      })

      if (!putRes.ok) throw new Error(`S3 upload failed: ${putRes.status}`)

      const objectUrl = URL.createObjectURL(file)
      return objectUrl
    },
    onSuccess: (objectUrl) => {
      replacePdfObjectUrl(objectUrl)
      setHasPdf(true)
    },
  })

  const {
    mutate: deletePdf,
    isPending: isDeletePending,
    isError: isDeleteError,
  } = useDeleteInterviewPdf({
    mutation: {
      onSuccess: () => {
        replacePdfObjectUrl(null)
        setHasPdf(false)
        clearAllHighlights()
        if (fileInputRef.current) fileInputRef.current.value = ''
      },
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadPdf(file)
  }

  const handleRemovePdf = () => {
    if (!interviewId) return
    deletePdf({ interviewId })
  }

  const resolvedPdfUrl = pdfObjectUrl ?? downloadUrl ?? null
  const isLinking = linkingQnaSetId !== null
  const isPdfBusy = isUploadPending || isDeletePending || isDownloadFetching
  const pdfError = (() => {
    if (isUploadError) return 'PDF 업로드에 실패했습니다. 다시 시도해 주세요.'
    if (isDeleteError) return 'PDF 업로드 해제에 실패했습니다.'
    if (!resolvedPdfUrl && isDownloadError) return 'PDF를 불러오는 데 실패했습니다.'
    return null
  })()

  return (
    <div className={`relative flex h-full flex-col gap-5 p-6 ${isLinking ? 'z-50 bg-gray-100' : ''}`}>
      <div className="absolute top-10 right-10 flex items-center justify-end">
        {resolvedPdfUrl && (
          <Button variant="outline-gray-100" onClick={handleRemovePdf} size="xs" disabled={isPdfBusy}>
            업로드 취소
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => void handleFileChange(e)}
      />

      {resolvedPdfUrl ? (
        <PdfViewer pdfUrl={resolvedPdfUrl} />
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPdfBusy}
          className="title-s-bold flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-300"
        >
          <div className="flex flex-col items-center gap-1">
            {isPdfBusy ? 'PDF 처리 중...' : '자기소개서 불러오기'}
            <FilePlusIcon className="h-14 w-14" />
          </div>
        </button>
      )}
      {pdfError && <p className="body-s-regular -mt-2 text-red-400">{pdfError}</p>}

      <div className="flex shrink-0 justify-end gap-3">
        <Button variant="outline-gray-white" size="md" onClick={goToConfirmPage}>
          뒤로 가기
        </Button>
        <Button
          variant="fill-orange-500"
          size="md"
          className="w-60"
          onClick={goToRetroPage}
          disabled={isCompletingQnaSetDraft || isPdfBusy}
        >
          회고 하러 가기
        </Button>
      </div>
    </div>
  )
}
