import type { Dispatch, SetStateAction } from 'react'
import { Button } from '@/designs/components'
import LiveAudioVisualizer from '@/features/_common/auth/components/LiveAudioVisualizer'
import { useInterviewNavigate } from '@/features/_common/hooks/useInterviewNavigation'
import { RecordConfirmSidebar } from '@/features/record/confirm/components/sidebar/Sidebar'
import { ROUTES } from '@/routes/routes'
import type { InterviewInfoType } from '@/types/interview'

type DesktopRecordPageContentProps = {
  interviewInfo: InterviewInfoType
  qnaList: { qnaSetId: number; questionText: string }[]
  text: string
  onTextChange: Dispatch<SetStateAction<string>>
  onRealtimeTranscript: Dispatch<SetStateAction<string>>
  onRecordComplete: () => void
  onRecordCancel?: () => void
  onSave: () => void
  isSavePending: boolean
  canSave: boolean
}

export function DesktopRecordPageContent({
  interviewInfo,
  text,
  onTextChange,
  onRealtimeTranscript,
  onRecordComplete,
  onRecordCancel,
  onSave,
  isSavePending,
  canSave,
  qnaList,
}: DesktopRecordPageContentProps) {
  const questionItems = qnaList.map(({ qnaSetId, questionText }, index) => ({
    id: qnaSetId,
    label: `${index + 1}. ${questionText}`,
  }))

  const navigateWithId = useInterviewNavigate()
  const goToRetroPage = () => navigateWithId(ROUTES.RETRO_QUESTION)

  return (
    <div className="mx-auto grid h-full w-7xl grid-cols-[320px_1fr]">
      <RecordConfirmSidebar
        infoItems={interviewInfo}
        questionItems={questionItems}
        activeIndex={-1}
        onItemClick={() => {}}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-auto p-6">
        <div className="mb-5">
          <h1 className="title-l-bold">면접 기록하기</h1>
        </div>

        <div className="border-gray-150 flex min-h-0 flex-1 flex-col rounded-xl border bg-white p-6">
          <textarea
            className="body-m-regular flex-1 resize-none overflow-y-auto whitespace-pre-wrap text-gray-800 outline-none"
            placeholder="텍스트 입력 또는 음성 녹음으로 면접을 기록할 수 있어요."
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
          />
          <div className="mt-4 shrink-0">
            <LiveAudioVisualizer
              onComplete={onRecordComplete}
              onRealtimeTranscript={onRealtimeTranscript}
              onCancel={onRecordCancel}
              uiType="desktop"
            />
          </div>
        </div>

        <div className="mt-auto flex shrink-0 justify-end gap-3 pt-4">
          <Button variant="outline-gray-100" size="md" onClick={onSave} disabled={isSavePending || !canSave}>
            임시저장
          </Button>
          <Button variant="fill-orange-500" size="md" className="w-60" onClick={goToRetroPage}>
            작성 완료
          </Button>
        </div>
      </div>
    </div>
  )
}
