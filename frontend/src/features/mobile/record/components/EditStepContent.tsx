import { Button } from '@/designs/components'

type EditStepContentProps = {
  text: string
  onTextChange: (value: string) => void
  onBackToRecord: () => void
  onSave: () => void
  isSavePending: boolean
  canSave: boolean
}

export default function EditStepContent({
  text,
  onTextChange,
  onBackToRecord,
  onSave,
  isSavePending,
  canSave,
}: EditStepContentProps) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-5 pt-6">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          className="body-m-regular focus:ring-opacity-30 min-h-70 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-800 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          rows={8}
        />
        <button
          type="button"
          onClick={onBackToRecord}
          className="body-m-regular mt-3 cursor-pointer text-gray-500 underline"
        >
          다시 녹음하기
        </button>
      </div>
      <div className="flex shrink-0 flex-col px-5 pt-6">
        <Button
          variant="fill-orange-500"
          size="md"
          className="w-full cursor-pointer"
          onClick={onSave}
          disabled={!canSave || isSavePending}
          isLoading={isSavePending}
        >
          기록 저장하기
        </Button>
      </div>
    </>
  )
}
