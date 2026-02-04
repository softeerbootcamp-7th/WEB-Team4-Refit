import { useState } from 'react'
import { EMPTY_FILTER } from '@/pages/dashboard/_my_interviews/constants/constants'
import { Button, Checkbox, Modal } from '@/shared/components'
import type { InterviewFilter } from '@/types/interview'

type InterviewFilterModalProps = {
  open: boolean
  onClose: () => void
  filter: InterviewFilter
  onApply: (filter: InterviewFilter) => void
}

export default function InterviewFilterModal({ open, onClose, filter, onApply }: InterviewFilterModalProps) {
  if (!open) return null

  return <InterviewFilterModalContent filter={filter} onApply={onApply} onClose={onClose} />
}

function InterviewFilterModalContent({ filter, onApply, onClose }: Omit<InterviewFilterModalProps, 'open'>) {
  const [draft, setDraft] = useState<InterviewFilter>(filter)

  const toggleItem = (key: keyof Pick<InterviewFilter, 'interviewType' | 'resultStatus'>, value: string) => {
    setDraft((prev) => {
      const list = prev[key]
      const updated = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      return { ...prev, [key]: updated }
    })
  }

  const handleReset = () => setDraft(EMPTY_FILTER)

  const handleClose = () => {
    onApply(draft)
    onClose()
  }

  return (
    <Modal open onClose={handleClose} title="면접 필터" isOutsideClickClosable>
      <div className="flex flex-col gap-6">
        <CheckboxGroup
          label="면접 형태"
          items={INTERVIEW_TYPES}
          columns={3}
          selected={draft.interviewType}
          onToggle={(v) => toggleItem('interviewType', v)}
        />
        <CheckboxGroup
          label="합불 상태"
          items={RESULT_STATUSES}
          columns={3}
          selected={draft.resultStatus}
          onToggle={(v) => toggleItem('resultStatus', v)}
        />

        <div className="flex flex-col gap-2">
          <span className="body-m-semibold">기간</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={draft.startDate}
              onChange={(e) => setDraft((prev) => ({ ...prev, startDate: e.target.value }))}
              className="h-8 flex-1 rounded-md border border-gray-300 px-2.5 py-1"
            />
            <span className="text-gray-400">~</span>
            <input
              type="date"
              value={draft.endDate}
              onChange={(e) => setDraft((prev) => ({ ...prev, endDate: e.target.value }))}
              className="h-8 flex-1 rounded-md border border-gray-300 px-2.5 py-1"
            />
            <Button size="xs" variant="outline-gray-100" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

type CheckboxGroupProps = {
  label: string
  items: string[]
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
      <span className="caption-l-medium text-gray-800">{label}</span>
      <div className={`grid gap-x-6 gap-y-2 ${gridCols}`}>
        {items.map((item) => (
          <Checkbox key={item} checked={selected.includes(item)} onChange={() => onToggle(item)} label={item} />
        ))}
      </div>
    </div>
  )
}

const INTERVIEW_TYPES = [
  '1차 면접',
  '2차 면접',
  '3차 면접',
  '인성 면접',
  '기술 면접',
  '임원 면접',
  '컬쳐핏 면접',
  '커피챗',
  '모의 면접',
]
const RESULT_STATUSES = ['합격', '발표 대기', '불합격']
