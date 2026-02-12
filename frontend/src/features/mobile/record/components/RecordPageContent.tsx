import RecordStepContent from '@/features/mobile/record/components/RecordStepContent'
import EditStepContent from './EditStepContent'

type RecordPageContentProps = {
  step: 'record' | 'edit'
  text: string
  realtimeText: string
  onTextChange: (value: string) => void
  onRealtimeTranscript: (value: string) => void
  onRecordComplete: () => void
  onBackToRecord: () => void
  onSave: () => void
  isSavePending: boolean
  canSave: boolean
}

export default function RecordPageContent({
  step,
  text,
  realtimeText,
  onTextChange,
  onRealtimeTranscript,
  onRecordComplete,
  onBackToRecord,
  onSave,
  isSavePending,
  canSave,
}: RecordPageContentProps) {
  return (
    <div className="bg-gray-white flex min-h-0 flex-1 flex-col overflow-auto pb-8">
      <header className="bg-gray-white flex shrink-0 flex-col gap-1 px-5 pt-4.5 pb-4">
        <h1 className="title-l-bold text-gray-800">{step === 'record' ? '면접 기록하기' : '음성 기록 편집'}</h1>
        {step === 'edit' && (
          <p className="body-s-regular text-gray-500">인식 결과가 정확하지 않다면 내용을 수정해 주세요.</p>
        )}
      </header>

      {step === 'record' ? (
        <RecordStepContent
          realtimeText={realtimeText}
          onRealtimeTranscript={onRealtimeTranscript}
          onRecordComplete={onRecordComplete}
        />
      ) : (
        <EditStepContent
          text={text}
          onTextChange={onTextChange}
          onBackToRecord={onBackToRecord}
          onSave={onSave}
          isSavePending={isSavePending}
          canSave={canSave}
        />
      )}
    </div>
  )
}
