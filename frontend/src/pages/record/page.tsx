import { Suspense, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { useConvertRawTextToQnaSet, useUpdateRawText, type InterviewDtoInterviewReviewStatus } from '@/apis'
import { getInterviewNavigationPath } from '@/constants/interviewReviewStatusRoutes'
import ConfirmModal from '@/designs/components/modal/ConfirmModal'
import SidebarLayoutSkeleton from '@/features/_common/components/sidebar/SidebarLayoutSkeleton'
import { RecordPageContent } from '@/features/record/_index'
import { useRecordAutoSave } from '@/features/record/_index/hooks/useRecordAutoSave'
import { useRecordPageData } from '@/features/record/_index/hooks/useRecordPageData'
import { ROUTES } from '@/routes/routes'

export default function RecordPage() {
  const { interviewId } = useParams<{ interviewId: string }>()

  return (
    <Suspense fallback={<SidebarLayoutSkeleton />}>
      <RecordPageContentContainer key={interviewId ?? 'unknown'} interviewId={interviewId} />
    </Suspense>
  )
}

type RecordPageContentContainerProps = {
  interviewId?: string
}

function RecordPageContentContainer({ interviewId }: RecordPageContentContainerProps) {
  const navigate = useNavigate()
  const [realtimeText, setRealtimeText] = useState('')
  const [isCompleting, setIsCompleting] = useState(false)
  const [isNextStepConfirmOpen, setIsNextStepConfirmOpen] = useState(false)
  const { data } = useRecordPageData(Number(interviewId))
  const isLoggingDraft = data.interviewReviewStatus === 'LOG_DRAFT'
  const { text, onTextChange, appendText, autoSaveStatus, autoSaveErrorMessage, ensureLoggingStarted, flushAutoSave } =
    useRecordAutoSave({
      interviewId,
      startLoggingRequired: data.interviewReviewStatus === 'NOT_LOGGED',
      initialText: isLoggingDraft ? data.interviewRawText : '',
    })
  const { mutateAsync: completeRawText } = useUpdateRawText()
  const { mutateAsync: convertRawTextToQnaSet } = useConvertRawTextToQnaSet()
  const blockedRecordPath = getBlockedRecordPath(interviewId, data.interviewReviewStatus)

  const getMergedText = () => `${text}${realtimeText ? `${text ? ' ' : ''}${realtimeText}` : ''}`.trim()

  const handleRecordComplete = () => {
    if (realtimeText) {
      appendText(realtimeText)
      setRealtimeText('')
    }
  }

  const handleRecordCancel = () => {
    setRealtimeText('')
  }

  const handleComplete = () => {
    if (!interviewId) return

    if (!getMergedText()) return
    setIsNextStepConfirmOpen(true)
  }

  const handleConfirmComplete = () => {
    if (!interviewId) return

    const mergedText = getMergedText()
    if (!mergedText) return

    setIsCompleting(true)
    void (async () => {
      await flushAutoSave(mergedText)

      const isLoggingStarted = await ensureLoggingStarted()
      if (!isLoggingStarted) {
        setIsCompleting(false)
        return
      }

      try {
        await completeRawText({
          interviewId: Number(interviewId),
          data: { rawText: mergedText },
        })
        await convertRawTextToQnaSet({ interviewId: Number(interviewId) })
        navigate(ROUTES.RECORD_CONFIRM.replace(':interviewId', interviewId), { replace: true })
      } catch {
        setIsCompleting(false)
      }
    })()
  }

  if (blockedRecordPath) {
    return <Navigate to={blockedRecordPath} replace />
  }

  return (
    <>
      <RecordPageContent
        interviewInfo={data.interviewInfo}
        text={text}
        realtimeText={realtimeText}
        onTextChange={onTextChange}
        onRealtimeTranscript={setRealtimeText}
        onRecordComplete={handleRecordComplete}
        onRecordCancel={handleRecordCancel}
        onComplete={handleComplete}
        isCompletePending={isCompleting}
        canSave={Boolean(interviewId)}
        autoSaveStatus={autoSaveStatus}
        autoSaveErrorMessage={autoSaveErrorMessage}
      />
      <ConfirmModal
        open={isNextStepConfirmOpen}
        onClose={() => setIsNextStepConfirmOpen(false)}
        onOk={() => {
          setIsNextStepConfirmOpen(false)
          handleConfirmComplete()
        }}
        title="다음 단계로 이동할까요?"
        description="확인을 누르면 면접 기록이
        질문/답변으로 자동 분류됩니다."
        okText="확인"
        okButtonVariant="fill-orange-500"
        hasCancelButton={true}
        cancelText="취소"
      />
    </>
  )
}

function getBlockedRecordPath(
  interviewId: string | undefined,
  interviewReviewStatus: InterviewDtoInterviewReviewStatus,
): string | null {
  if (!interviewId) return null
  if (interviewReviewStatus === 'NOT_LOGGED' || interviewReviewStatus === 'LOG_DRAFT') return null
  return getInterviewNavigationPath(interviewId, interviewReviewStatus)
}
