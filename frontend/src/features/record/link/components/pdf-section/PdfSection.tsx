import { useCallback, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import {
  createPdfUploadUrl,
  getCreatePdfDownloadUrlQueryKey,
  useCompleteQnaSetDraft,
  useDeleteInterviewPdf,
} from '@/apis/generated/interview-api/interview-api'
import { useInterviewNavigate } from '@/features/_common/_index/hooks/useInterviewNavigation'
import { useHighlightContext } from '@/features/record/link/contexts'
import { ROUTES } from '@/routes/routes'
import { FilePlusIcon, LoadingSpinner } from '@/ui/assets'
import { Button } from '@/ui/components'
import ConfirmModal from '@/ui/components/modal/ConfirmModal'
import { PdfViewer } from './PdfViewer'
import { clearPdfObjectUrlCache, getPdfObjectUrlKey, usePdfCachedUrl } from './usePdfCachedUrl'

export function PdfSection() {
  const { interviewId: interviewIdParam } = useParams()
  const interviewId = Number(interviewIdParam)
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadAbortRef = useRef<AbortController | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isRetroConfirmOpen, setIsRetroConfirmOpen] = useState(false)
  const { hasPdf, linkingQnaSetId, setHasPdf, clearAllHighlights } = useHighlightContext()
  const { mutate: completeQnaSetDraft, isPending: isCompletingQnaSetDraft } = useCompleteQnaSetDraft()

  const navigateWithId = useInterviewNavigate()
  const goToConfirmPage = () => navigateWithId(ROUTES.RECORD_CONFIRM, { replace: true })
  const goToRetroPage = () => {
    completeQnaSetDraft(
      { interviewId },
      {
        onSuccess: () => {
          navigateWithId(ROUTES.RETRO, { replace: true })
        },
      },
    )
  }

  const handleDownloadSuccess = useCallback(() => {
    setHasPdf(true)
  }, [setHasPdf])

  const handleDownloadError = useCallback(() => {
    setHasPdf(false)
    clearAllHighlights()
  }, [setHasPdf, clearAllHighlights])

  const { resolvedPdfUrl, isDownloadFetching } = usePdfCachedUrl({
    interviewId,
    hasPdf,
    onDownloadSuccess: handleDownloadSuccess,
    onDownloadError: handleDownloadError,
  })

  const {
    mutate: uploadPdf,
    isPending: isUploadPending,
    isError: isUploadError,
    error: uploadError,
  } = useMutation({
    mutationFn: async (file: File) => {
      const abortController = new AbortController()
      uploadAbortRef.current = abortController
      const { signal } = abortController

      // 업로드 시작 시마다 presigned upload URL을 새로 발급받는다.
      const res = await createPdfUploadUrl(interviewId, { signal })
      const uploadUrl = res.result?.presignedUrlDto?.url
      const updatedAt = res.result?.pdfUploadUrlPublishedAt

      if (!uploadUrl || !updatedAt) throw new Error('업로드 URL 또는 updatedAt이 없습니다.')

      // 2. S3 업로드
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/pdf' },
        body: file,
        signal,
      })

      if (!putRes.ok) throw new Error(`S3 upload failed: ${putRes.status}`)

      return { objectUrl: URL.createObjectURL(file), updatedAt }
    },
    onSuccess: ({ objectUrl, updatedAt }) => {
      // 업로드된 파일을 즉시 렌더링할 수 있도록 object URL을 버전 key에 저장한다.
      clearPdfObjectUrlCache(queryClient, interviewId)
      queryClient.setQueryData(getPdfObjectUrlKey(interviewId, updatedAt), objectUrl)
      setHasPdf(true)
      setZoom(1)
      void queryClient.invalidateQueries({ queryKey: getCreatePdfDownloadUrlQueryKey(interviewId) })
    },
    onSettled: () => {
      uploadAbortRef.current = null
    },
  })

  const {
    mutate: deletePdf,
    isPending: isDeletePending,
    isError: isDeleteError,
  } = useDeleteInterviewPdf({
    mutation: {
      onSuccess: () => {
        // 삭제 후엔 PDF 관련 캐시와 하이라이트 상태를 모두 초기화한다.
        clearPdfObjectUrlCache(queryClient, interviewId)
        queryClient.removeQueries({ queryKey: getCreatePdfDownloadUrlQueryKey(interviewId), exact: true })
        setHasPdf(false)
        setZoom(1)
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

  const handleCancelUpload = () => {
    uploadAbortRef.current?.abort()
    uploadAbortRef.current = null
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemovePdf = () => {
    deletePdf({ interviewId })
  }

  const isLinking = linkingQnaSetId !== null
  const isPdfBusy = isUploadPending || isDeletePending || isDownloadFetching
  const isUploadAbortError = uploadError instanceof DOMException && uploadError.name === 'AbortError'
  const pdfError = (() => {
    if (isUploadError && !isUploadAbortError) return 'PDF 업로드에 실패했습니다. 다시 시도해 주세요.'
    if (isDeleteError) return 'PDF 업로드 해제에 실패했습니다.'
    return null
  })()

  return (
    <div className={`relative flex h-full flex-col gap-5 p-6 pr-0 ${isLinking ? 'z-50 bg-gray-100' : ''}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => void handleFileChange(e)}
      />

      {resolvedPdfUrl ? (
        <PdfViewer
          pdfUrl={resolvedPdfUrl}
          onRemovePdf={handleRemovePdf}
          isPdfBusy={isPdfBusy}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      ) : isPdfBusy ? (
        <div className="title-s-bold flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-300">
          <div className="flex flex-col items-center gap-1">
            <LoadingSpinner className="h-10 w-10 animate-spin" />
            <span className="mt-2">PDF 처리 중...</span>
            {isUploadPending && (
              <button
                type="button"
                onClick={handleCancelUpload}
                className="body-s-regular mt-1 cursor-pointer text-gray-400 underline hover:text-gray-500"
              >
                업로드 취소
              </button>
            )}
          </div>
        </div>
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
      {pdfError && <p className="body-s-regular -mt-2 text-red-400">{pdfError}</p>}

      <div className="flex shrink-0 justify-end gap-3">
        <Button variant="outline-gray-white" size="md" onClick={goToConfirmPage}>
          뒤로 가기
        </Button>
        <Button
          variant="fill-orange-500"
          size="md"
          className="w-60"
          onClick={() => setIsRetroConfirmOpen(true)}
          disabled={isCompletingQnaSetDraft || isPdfBusy}
        >
          회고 하러 가기
        </Button>
      </div>
      <ConfirmModal
        open={isRetroConfirmOpen}
        onClose={() => setIsRetroConfirmOpen(false)}
        title="회고 단계로 이동할까요?"
        description={`이동하면 다시 돌아올 수 없어요.\n작성한 내용은 모두 저장돼요.`}
        hasCancelButton={true}
        cancelText="취소"
        okText="이동하기"
        okButtonVariant="fill-gray-800"
        okButtonLoading={isCompletingQnaSetDraft}
        onOk={goToRetroPage}
      />
    </div>
  )
}
