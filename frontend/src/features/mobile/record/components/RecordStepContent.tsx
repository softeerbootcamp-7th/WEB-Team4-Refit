import type { Dispatch, SetStateAction } from 'react'
import LiveAudioVisualizer from '@/features/_common/auth/components/LiveAudioVisualizer'

type RecordStepContentProps = {
  realtimeText: string
  onRealtimeTranscript: Dispatch<SetStateAction<string>>
  onRecordComplete: () => void
  onRecordCancel?: () => void
}

export default function RecordStepContent({
  realtimeText,
  onRealtimeTranscript,
  onRecordComplete,
  onRecordCancel,
}: RecordStepContentProps) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-5 pt-6">
        <div
          className="body-m-regular border-gray-150 min-h-70 w-full overflow-y-scroll rounded-xl border bg-gray-100 px-4 py-4 whitespace-pre-wrap text-gray-800"
          aria-live="polite"
          aria-label="실시간 인식 결과"
        >
          {realtimeText ? realtimeText : <p className="text-gray-400">음성 기록이 이곳에 실시간으로 표시됩니다.</p>}
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-3 px-5 pt-6">
        <LiveAudioVisualizer
          onComplete={onRecordComplete}
          onRealtimeTranscript={onRealtimeTranscript}
          onCancel={onRecordCancel}
        />
      </div>
    </>
  )
}
