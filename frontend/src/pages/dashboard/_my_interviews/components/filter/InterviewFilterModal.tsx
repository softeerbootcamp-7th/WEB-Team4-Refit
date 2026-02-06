import { useState } from 'react'
import { EMPTY_FILTER, RESULT_STATUS_ITEMS } from '@/pages/dashboard/_my_interviews/constants/constants'
import { Button, Checkbox, Modal } from '@/shared/components'
import { INTERVIEW_TYPE_OPTIONS } from '@/shared/constants/interviews'
import type { InterviewFilter } from '@/types/interview'

type InterviewFilterModalProps = {
  open: boolean
  onClose: () => void
  filter: InterviewFilter
  onApply: (filter: InterviewFilter) => void
}

export default function InterviewFilterModalContent({ open, filter, onApply, onClose }: InterviewFilterModalProps) {
  const [draft, setDraft] = useState<InterviewFilter>(filter)

  const toggleItem = (key: keyof Pick<InterviewFilter, 'interviewType' | 'resultStatus'>, value: string) => {
    setDraft((prev) => {
      const list = prev[key]
      const updated = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      return { ...prev, [key]: updated }
    })
  }

  const handleReset = () => setDraft(EMPTY_FILTER)

  const handleApply = () => {
    onApply(draft)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="면접 필터">
      <div className="flex flex-col gap-6">
        <CheckboxGroup
          label="면접 형태"
          items={INTERVIEW_TYPE_OPTIONS}
          columns={3}
          selected={draft.interviewType}
          onToggle={(v) => toggleItem('interviewType', v)}
        />
        <CheckboxGroup
          label="합불 상태"
          items={RESULT_STATUS_ITEMS}
          columns={3}
          selected={draft.resultStatus}
          onToggle={(v) => toggleItem('resultStatus', v)}
        />
        <div className="flex flex-col gap-2">
          <span className="caption-l-medium">기간</span>
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
        <div className="flex justify-end gap-3">
          <Button variant="outline-gray-100" size="sm" onClick={handleReset}>
            초기화
          </Button>
          <Button variant="fill-orange-500" size="sm" onClick={handleApply}>
            적용
          </Button>
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
    <div className="flex flex-col gap-2">
      <span className="caption-l-medium">{label}</span>
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
