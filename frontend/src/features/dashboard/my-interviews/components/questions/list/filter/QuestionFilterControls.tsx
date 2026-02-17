import { useMemo, useState } from 'react'
import { CaretDownIcon, FilterIcon } from '@/designs/assets'
import { Button, Checkbox, Modal, PlainCombobox } from '@/designs/components'
import {
  EMPTY_QUESTION_FILTER,
  QUESTION_SORT_OPTIONS,
  STAR_LEVEL_OPTIONS,
} from '@/features/dashboard/my-interviews/constants/constants'
import type { QuestionFilter, StarLevel } from '@/types/interview'

type Props = {
  filter: QuestionFilter
  onChange: (filter: QuestionFilter) => void
}

// TODO: UI 수정
export default function QuestionFilterControls({ filter, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [modalVersion, setModalVersion] = useState(0)

  const selectedCount = useMemo(() => {
    const hasStar = filter.hasStarAnalysis === null ? 0 : 1
    return (
      hasStar +
      filter.sInclusionLevels.length +
      filter.tInclusionLevels.length +
      filter.aInclusionLevels.length +
      filter.rInclusionLevels.length
    )
  }, [filter])

  const hasFilter = selectedCount > 0

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="xs"
          variant={hasFilter ? 'fill-gray-800' : 'fill-gray-150'}
          onClick={() => {
            setModalVersion((prev) => prev + 1)
            setOpen(true)
          }}
        >
          <FilterIcon className="h-4 w-4" />
          {hasFilter ? `필터 ${selectedCount}개 선택됨` : '필터'}
        </Button>
        <PlainCombobox
          title="질문 정렬"
          options={[...QUESTION_SORT_OPTIONS]}
          value={filter.sort}
          onChange={(sort) => onChange({ ...filter, sort })}
          trigger={
            <Button size="xs" variant="fill-gray-150">
              {QUESTION_SORT_OPTIONS.find((option) => option.value === filter.sort)?.label}
              <CaretDownIcon className="h-2 w-2" />
            </Button>
          }
        />
      </div>
      <QuestionFilterModal
        key={modalVersion}
        open={open}
        filter={filter}
        onClose={() => setOpen(false)}
        onApply={(next) => {
          onChange(next)
          setOpen(false)
        }}
      />
    </>
  )
}

type ModalProps = {
  open: boolean
  filter: QuestionFilter
  onClose: () => void
  onApply: (next: QuestionFilter) => void
}

function QuestionFilterModal({ open, filter, onClose, onApply }: ModalProps) {
  const [draft, setDraft] = useState<QuestionFilter>(filter)

  const toggleLevel = (
    key: 'sInclusionLevels' | 'tInclusionLevels' | 'aInclusionLevels' | 'rInclusionLevels',
    value: StarLevel,
  ) => {
    setDraft((prev) => {
      const list = prev[key] as string[]
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
      return { ...prev, [key]: next } as QuestionFilter
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="질문 필터">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="caption-l-medium">STAR 분석 여부</span>
          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant={draft.hasStarAnalysis === null ? 'fill-gray-800' : 'outline-gray-100'}
              onClick={() => setDraft((prev) => ({ ...prev, hasStarAnalysis: null }))}
            >
              전체
            </Button>
            <Button
              size="xs"
              variant={draft.hasStarAnalysis === true ? 'fill-gray-800' : 'outline-gray-100'}
              onClick={() => setDraft((prev) => ({ ...prev, hasStarAnalysis: true }))}
            >
              있음
            </Button>
            <Button
              size="xs"
              variant={draft.hasStarAnalysis === false ? 'fill-gray-800' : 'outline-gray-100'}
              onClick={() => setDraft((prev) => ({ ...prev, hasStarAnalysis: false }))}
            >
              없음
            </Button>
          </div>
        </div>

        <LevelGroup
          label="S: Situation 분석 결과"
          selected={draft.sInclusionLevels}
          onToggle={(value) => toggleLevel('sInclusionLevels', value)}
        />
        <LevelGroup
          label="T: Task 분석 결과"
          selected={draft.tInclusionLevels}
          onToggle={(value) => toggleLevel('tInclusionLevels', value)}
        />
        <LevelGroup
          label="A: Action 분석 결과"
          selected={draft.aInclusionLevels}
          onToggle={(value) => toggleLevel('aInclusionLevels', value)}
        />
        <LevelGroup
          label="R: Result 분석 결과"
          selected={draft.rInclusionLevels}
          onToggle={(value) => toggleLevel('rInclusionLevels', value)}
        />

        <div className="flex justify-end gap-3">
          <Button
            variant="outline-gray-100"
            size="sm"
            onClick={() => setDraft((prev) => ({ ...EMPTY_QUESTION_FILTER, keyword: prev.keyword }))}
          >
            초기화
          </Button>
          <Button variant="fill-orange-500" size="sm" onClick={() => onApply(draft)}>
            적용
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function LevelGroup({
  label,
  selected,
  onToggle,
}: {
  label: string
  selected: string[]
  onToggle: (value: StarLevel) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="caption-l-medium">{label}</span>
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        {STAR_LEVEL_OPTIONS.map((option) => (
          <Checkbox
            key={option.value}
            checked={selected.includes(option.value)}
            onChange={() => onToggle(option.value)}
            label={option.label}
          />
        ))}
      </div>
    </div>
  )
}
