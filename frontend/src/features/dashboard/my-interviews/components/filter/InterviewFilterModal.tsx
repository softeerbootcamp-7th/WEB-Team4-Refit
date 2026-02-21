import { useMemo, useState } from 'react'
import { INTERVIEW_TYPE_OPTIONS } from '@/constants/interviews'
import { Button, Checkbox, Modal } from '@/designs/components'
import { EMPTY_FILTER, RESULT_STATUS_ITEMS } from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewFilter } from '@/types/interview'

type InterviewFilterModalProps = {
  open: boolean
  onClose: () => void
  filter: InterviewFilter
  onApply: (filter: InterviewFilter) => void
}

export default function InterviewFilterModalContent({ open, filter, onApply, onClose }: InterviewFilterModalProps) {
  const [draft, setDraft] = useState<InterviewFilter>(filter)
  const [prevOpen, setPrevOpen] = useState(open)
  const selectedCount = useMemo(
    () => draft.interviewType.length + draft.resultStatus.length + (draft.startDate ? 1 : 0) + (draft.endDate ? 1 : 0),
    [draft],
  )

  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) setDraft(filter)
  }

  const toggleItem = <K extends 'interviewType' | 'resultStatus'>(key: K, value: InterviewFilter[K][number]) => {
    setDraft((prev) => {
      const list = prev[key] as string[]
      const updated = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      return { ...prev, [key]: updated }
    })
  }

  const handleReset = () => setDraft((prev) => ({ ...EMPTY_FILTER, keyword: prev.keyword }))

  const handleApply = () => {
    onApply(draft)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="면접 필터">
      <div className="flex flex-col gap-5">
        <CheckboxGroup
          label="면접 형태"
          items={INTERVIEW_TYPE_OPTIONS}
          columns={3}
          selected={draft.interviewType}
          onToggle={(v) => toggleItem('interviewType', v as InterviewFilter['interviewType'][number])}
        />
        <CheckboxGroup
          label="합불 상태"
          items={RESULT_STATUS_ITEMS}
          columns={3}
          selected={draft.resultStatus}
          onToggle={(v) => toggleItem('resultStatus', v as InterviewFilter['resultStatus'][number])}
        />
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4">
          <div className="flex min-h-6 items-center justify-between">
            <span className="caption-l-medium">기간</span>
            {(draft.startDate || draft.endDate) && (
              <span className="caption-m-semibold rounded-2xl bg-orange-100 px-2 py-0.5 text-orange-500">
                선택됨
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DateSelectInput
              value={draft.startDate}
              onChange={(e) => setDraft((prev) => ({ ...prev, startDate: e.target.value }))}
            />
            <span className="text-gray-400">~</span>
            <DateSelectInput
              value={draft.endDate}
              onChange={(e) => setDraft((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="caption-m-semibold rounded-2xl bg-gray-100 px-2.5 py-1 text-gray-700">
            선택 {selectedCount}개
          </span>
          <div className="flex gap-3">
            <Button variant="outline-gray-100" size="sm" onClick={handleReset}>
              초기화
            </Button>
            <Button variant="fill-orange-500" size="sm" onClick={handleApply}>
              적용
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

type CheckboxGroupProps = {
  label: string
  items: { value: string; label: string }[]
  columns?: number
  selected: string[]
  onToggle: (value: string) => void
}

function CheckboxGroup({ label, items, columns, selected, onToggle }: CheckboxGroupProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns || 1]

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4">
      <div className="flex min-h-6 items-center justify-between">
        <span className="caption-l-medium">{label}</span>
        {selected.length > 0 && (
          <span className="caption-m-semibold rounded-2xl bg-orange-100 px-2 py-0.5 text-orange-500">
            {selected.length}개 선택
          </span>
        )}
      </div>
      <div className={`grid gap-x-6 gap-y-2 ${gridCols}`}>
        {items.map((item) => (
          <Checkbox
            key={item.value}
            checked={selected.includes(item.value)}
            onChange={() => onToggle(item.value)}
            label={item.label}
          />
        ))}
      </div>
    </div>
  )
}

function DateSelectInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input type="date" className="body-m-medium h-8 flex-1 rounded-md border border-gray-300 px-2.5 py-1" {...props} />
  )
}
