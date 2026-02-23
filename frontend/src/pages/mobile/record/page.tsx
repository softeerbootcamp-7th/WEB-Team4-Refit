import { useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useGetInterview, useStartLogging, useUpdateRawText } from '@/apis'
import { LoadingSpinner } from '@/designs/assets'
import ConfirmModal from '@/designs/components/modal/ConfirmModal'
import { RecordPageContent } from '@/features/mobile/record/components'
import { shouldThrowInterviewRouteError } from '@/routes/interviewErrorRoute'

export default function MobileRecordPage() {
  const { interviewId } = useParams<{ interviewId: string }>()
  const numericInterviewId = Number(interviewId)
  const isInterviewIdValid = !Number.isNaN(numericInterviewId)

  const { data } = useGetInterview(numericInterviewId, {
    query: {
      enabled: isInterviewIdValid,
      throwOnError: shouldThrowInterviewRouteError,
      select: (response) => {
        const interview = response.result
        if (!interview) throw new Error('인터뷰 데이터가 존재하지 않습니다.')

        return {
          interviewReviewStatus: interview.interviewReviewStatus ?? 'NOT_LOGGED',
          interviewRawText: interview.interviewRawText ?? '',
        }
      },
    },
  })

  if (!isInterviewIdValid) return null

  if (!data) {
    return (
      <div className="bg-gray-white flex min-h-dvh items-center justify-center">
        <LoadingSpinner className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  const hasSavedRawText = data.interviewRawText.trim() !== ''

  return (
    <MobileRecordContentContainer
      key={numericInterviewId}
      interviewId={numericInterviewId}
      initialStep={hasSavedRawText ? 'edit' : 'record'}
      initialText={hasSavedRawText ? data.interviewRawText : ''}
      startLoggingRequired={data.interviewReviewStatus === 'NOT_LOGGED'}
    />
  )
}

type MobileRecordContentContainerProps = {
  interviewId: number
  initialStep: 'record' | 'edit'
  initialText: string
  startLoggingRequired: boolean
}

function MobileRecordContentContainer({
  interviewId,
  initialStep,
  initialText,
  startLoggingRequired,
}: MobileRecordContentContainerProps) {
  const [step, setStep] = useState<'record' | 'edit'>(initialStep)
  const [text, setText] = useState(initialText)
  const [realtimeText, setRealtimeText] = useState('')
  const [showEmptyTranscriptModal, setShowEmptyTranscriptModal] = useState(false)
  const { mutate: updateRawText, isPending } = useUpdateRawText()
  const { mutateAsync: startLogging } = useStartLogging()
  const startedLoggingRef = useRef(!startLoggingRequired)
  const startLoggingPromiseRef = useRef<Promise<boolean> | null>(null)

  const ensureLoggingStarted = useCallback(async () => {
    if (!startLoggingRequired) return true
    if (startedLoggingRef.current) return true

    if (!startLoggingPromiseRef.current) {
      startLoggingPromiseRef.current = startLogging({ interviewId })
        .then(() => {
          startedLoggingRef.current = true
          return true
        })
        .catch(() => false)
        .finally(() => {
          startLoggingPromiseRef.current = null
        })
    }

    return startLoggingPromiseRef.current
  }, [interviewId, startLogging, startLoggingRequired])

  const handleRecordComplete = () => {
    const trimmed = realtimeText.trim()
    if (!trimmed) {
      setShowEmptyTranscriptModal(true)
      return
    }
    setText(realtimeText)
    setStep('edit')
  }

  const handleBackToRecord = () => {
    setStep('record')
    setText('')
    setRealtimeText('')
  }

  const handleRecordCancel = () => {
    setRealtimeText('')
  }

  const handleSave = () => {
    void (async () => {
      const isLoggingStarted = await ensureLoggingStarted()
      if (!isLoggingStarted) return

      updateRawText({
        interviewId,
        data: { rawText: text },
      })
    })()
  }

  return (
    <>
      <RecordPageContent
        step={step}
        text={text}
        realtimeText={realtimeText}
        onTextChange={setText}
        onRealtimeTranscript={setRealtimeText}
        onRecordComplete={handleRecordComplete}
        onRecordCancel={handleRecordCancel}
        onBackToRecord={handleBackToRecord}
        onSave={handleSave}
        isSavePending={isPending}
        canSave={true}
      />
      <ConfirmModal
        open={showEmptyTranscriptModal}
        onClose={() => setShowEmptyTranscriptModal(false)}
        onOk={() => setShowEmptyTranscriptModal(false)}
        title="음성 인식 실패"
        description="음성을 인식하지 못했습니다. 다시 녹음해 주세요."
        okText="확인"
        okButtonVariant="fill-gray-800"
        hasCancelButton={false}
        isOutsideClickClosable={true}
      />
    </>
  )
}
