import { Suspense, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useConvertRawTextToQnaSet, useUpdateRawText } from '@/apis'
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
  const { data } = useRecordPageData(Number(interviewId))
  const { text, onTextChange, appendText, autoSaveStatus, ensureLoggingStarted } = useRecordAutoSave({
    interviewId,
    startLoggingRequired: data.interviewReviewStatus === 'NOT_LOGGED',
  })
  const { mutateAsync: completeRawText } = useUpdateRawText()
  const { mutateAsync: convertRawTextToQnaSet } = useConvertRawTextToQnaSet()

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

    const mergedText = `${text}${realtimeText ? `${text ? ' ' : ''}${realtimeText}` : ''}`.trim()
    if (!mergedText) return
    setIsCompleting(true)
    void (async () => {
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
        navigate(ROUTES.RECORD_CONFIRM.replace(':interviewId', interviewId))
      } catch {
        setIsCompleting(false)
      }
    })()
  }

  return (
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
    />
  )
}
