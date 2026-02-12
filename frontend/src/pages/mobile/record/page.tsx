import { useState } from 'react'
import { useParams } from 'react-router'
import { useUpdateRawText } from '@/apis'
import { RecordPageContent } from '@/features/mobile/record/components'

export default function MobileRecordPage() {
  const { interviewId } = useParams<{ interviewId: string }>()
  const [step, setStep] = useState<'record' | 'edit'>('record')
  const [text, setText] = useState('')
  const [realtimeText, setRealtimeText] = useState('')

  const { mutate: updateRawText, isPending } = useUpdateRawText()

  const handleRecordComplete = () => {
    const trimmed = realtimeText.trim()
    if (!trimmed) {
      alert('음성을 인식하지 못했습니다. 다시 녹음해 주세요.')
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

  const handleSave = () => {
    if (!interviewId) return
    updateRawText({
      interviewId: Number(interviewId),
      data: { rawText: text },
    })
  }

  return (
    <RecordPageContent
      step={step}
      text={text}
      realtimeText={realtimeText}
      onTextChange={setText}
      onRealtimeTranscript={setRealtimeText}
      onRecordComplete={handleRecordComplete}
      onBackToRecord={handleBackToRecord}
      onSave={handleSave}
      isSavePending={isPending}
      canSave={Boolean(interviewId)}
    />
  )
}
