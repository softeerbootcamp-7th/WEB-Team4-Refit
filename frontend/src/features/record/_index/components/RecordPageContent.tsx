import { useState, type Dispatch, type SetStateAction } from 'react'
import { Button } from '@/designs/components'
import LiveAudioVisualizer from '@/features/_common/auth/components/LiveAudioVisualizer'
import { useInterviewNavigate } from '@/features/_common/hooks/useInterviewNavigation'
import { RecordSidebar } from '@/features/record/_index/components/RecordSidebar'
import { ROUTES } from '@/routes/routes'
import type { InterviewInfoType } from '@/types/interview'

type RecordPageContentProps = {
  interviewInfo: InterviewInfoType
  text: string
  realtimeText: string
  onTextChange: Dispatch<SetStateAction<string>>
  onRealtimeTranscript: Dispatch<SetStateAction<string>>
  onRecordComplete: () => void
  onRecordCancel?: () => void
  onSave: () => void
  isSavePending: boolean
  canSave: boolean
}

export function RecordPageContent({
  interviewInfo,
  text,
  realtimeText,
  onTextChange,
  onRealtimeTranscript,
  onRecordComplete,
  onRecordCancel,
  onSave,
  isSavePending,
  canSave,
}: RecordPageContentProps) {
  const [isRecording, setIsRecording] = useState(false)

  const navigateWithId = useInterviewNavigate()
  const goToConfirmPage = () => navigateWithId(ROUTES.RECORD_CONFIRM)

  return (
    <div className="mx-auto grid h-full w-7xl grid-cols-[320px_1fr]">
      <RecordSidebar infoItems={interviewInfo} />
      <div className="flex min-h-0 flex-1 flex-col overflow-auto p-6">
        <div className="mb-5">
          <h1 className="title-l-bold">면접 기록하기</h1>
        </div>

        <div className="border-gray-150 flex min-h-0 flex-1 flex-col rounded-xl border bg-white p-6">
          <textarea
            className="body-m-regular flex-1 resize-none overflow-y-auto whitespace-pre-wrap text-gray-800 outline-none"
            placeholder="텍스트 입력 또는 음성 녹음으로 면접을 기록할 수 있어요."
            value={text + (realtimeText ? (text ? ' ' : '') + realtimeText : '')}
            onChange={(e) => onTextChange(e.target.value)}
            readOnly={!!realtimeText || isRecording}
          />
          <div className="mt-4 shrink-0">
            <LiveAudioVisualizer
              onComplete={onRecordComplete}
              onRealtimeTranscript={onRealtimeTranscript}
              onCancel={onRecordCancel}
              uiType="desktop"
              onRecordingChange={setIsRecording}
            />
          </div>
        </div>

        <div className="mt-auto flex shrink-0 justify-end gap-3 pt-4">
          <Button variant="outline-gray-100" size="md" onClick={onSave} disabled={isSavePending || !canSave}>
            임시저장
          </Button>
          <Button variant="fill-orange-500" size="md" className="w-60" onClick={goToConfirmPage}>
            작성 완료
          </Button>
        </div>
      </div>
    </div>
  )
}
