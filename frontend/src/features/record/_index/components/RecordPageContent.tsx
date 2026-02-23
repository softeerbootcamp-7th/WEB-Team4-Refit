import { useState, type Dispatch, type SetStateAction } from 'react'
import { CloudSaveIcon, LoadingSpinner } from '@/designs/assets'
import { Button } from '@/designs/components'
import LoadingOverlay from '@/features/_common/loading/LoadingOverlay'
import { LiveAudioVisualizer } from '@/features/_common/record/components'
import { RecordSidebar } from '@/features/record/_index/components/RecordSidebar'
import type { InterviewInfoType } from '@/types/interview'

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'
const MAX_RECORD_TEXT_LENGTH = 10_000

type RecordPageContentProps = {
  interviewInfo: InterviewInfoType
  text: string
  realtimeText: string
  onTextChange: (text: string) => void
  onRealtimeTranscript: Dispatch<SetStateAction<string>>
  onRecordComplete: () => void
  onRecordCancel?: () => void
  onComplete: () => void
  isCompletePending: boolean
  canSave: boolean
  autoSaveStatus: AutoSaveStatus
  autoSaveErrorMessage: string | null
}

export function RecordPageContent({
  interviewInfo,
  text,
  realtimeText,
  onTextChange,
  onRealtimeTranscript,
  onRecordComplete,
  onRecordCancel,
  onComplete,
  isCompletePending,
  canSave,
  autoSaveStatus,
  autoSaveErrorMessage,
}: RecordPageContentProps) {
  const [isRecording, setIsRecording] = useState(false)
  const mergedText = `${text}${realtimeText ? `${text ? ' ' : ''}${realtimeText}` : ''}`
  const canComplete = mergedText.trim().length > 0

  return (
    <>
      <div className="mx-auto grid h-full w-7xl grid-cols-[320px_1fr]">
        <RecordSidebar infoItems={interviewInfo} />
        <div className="flex min-h-0 flex-1 flex-col overflow-auto p-6">
          <div className="mb-5 flex items-center gap-4">
            <h1 className="title-l-bold">면접 기록하기</h1>
            <AutoSaveStatusBadge status={autoSaveStatus} errorMessage={autoSaveErrorMessage} />
          </div>

          <div className="border-gray-150 flex min-h-0 flex-1 flex-col rounded-xl border bg-white p-6">
            <textarea
              className="body-m-regular flex-1 resize-none overflow-y-auto whitespace-pre-wrap text-gray-800 outline-none"
              placeholder="텍스트 입력 또는 음성 녹음으로 면접을 기록할 수 있어요."
              value={text + (realtimeText ? (text ? ' ' : '') + realtimeText : '')}
              onChange={(e) => onTextChange(e.target.value)}
              readOnly={!!realtimeText || isRecording}
              maxLength={MAX_RECORD_TEXT_LENGTH}
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

          <div className="mt-auto flex shrink-0 justify-end pt-4">
            <Button
              variant="fill-orange-500"
              size="md"
              className="w-60"
              onClick={onComplete}
              disabled={!canSave || isRecording || !canComplete}
              isLoading={isCompletePending}
            >
              다음 단계
            </Button>
          </div>
        </div>
      </div>
      {isCompletePending && (
        <LoadingOverlay
          text={
            <>
              작성해주신 내용을 질문과 답변으로
              <br />
              정리하고 있어요!
            </>
          }
        />
      )}
    </>
  )
}

function AutoSaveStatusBadge({ status, errorMessage }: { status: AutoSaveStatus; errorMessage: string | null }) {
  const label =
    status === 'saving'
      ? '저장 중...'
      : status === 'saved'
        ? '저장됨'
        : status === 'error'
          ? (errorMessage ?? '저장 실패')
          : '자동 저장'

  const textColor = status === 'error' ? 'text-red-500' : 'text-gray-500'

  return (
    <div className={`caption-l-semibold inline-flex items-center gap-1.5 ${textColor}`}>
      <CloudSaveIcon className="h-5 w-5" />
      <span>{label}</span>
      {status === 'saving' && <LoadingSpinner className="h-4 w-4 animate-spin" />}
    </div>
  )
}
