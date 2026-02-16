import { useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useStartLogging, useUpdateRawText } from '@/apis'
import ConfirmModal from '@/designs/components/modal/ConfirmModal'
import { RecordPageContent } from '@/features/mobile/record/components'

export default function MobileRecordPage() {
  const { interviewId } = useParams<{ interviewId: string }>()
  const [step, setStep] = useState<'record' | 'edit'>('record')
  const [text, setText] = useState('')
  const [realtimeText, setRealtimeText] = useState('')
  const [showEmptyTranscriptModal, setShowEmptyTranscriptModal] = useState(false)

  const { mutate: updateRawText, isPending } = useUpdateRawText()
  const { mutateAsync: startLogging } = useStartLogging()
  const startedLoggingRef = useRef(false)
  const startLoggingPromiseRef = useRef<Promise<boolean> | null>(null)

  const ensureLoggingStarted = useCallback(async () => {
    if (!interviewId) return false
    if (startedLoggingRef.current) return true

    if (!startLoggingPromiseRef.current) {
      startLoggingPromiseRef.current = startLogging({ interviewId: Number(interviewId) })
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
  }, [interviewId, startLogging])

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
    if (!interviewId) return

    void (async () => {
      const isLoggingStarted = await ensureLoggingStarted()
      if (!isLoggingStarted) return

      updateRawText({
        interviewId: Number(interviewId),
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
        canSave={Boolean(interviewId)}
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
