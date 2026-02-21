import { useMemo, useState } from 'react'
import { CaretDownIcon, FilterIcon } from '@/designs/assets'
import { Button, Checkbox, Modal, PlainCombobox } from '@/designs/components'
import {
  EMPTY_STAR_LEVELS,
  EMPTY_QUESTION_FILTER,
  QUESTION_SORT_OPTIONS,
  STAR_LEVEL_OPTIONS,
} from '@/features/dashboard/my-interviews/constants/constants'
import type { QuestionFilter, StarLevel } from '@/types/interview'

type Props = {
  filter: QuestionFilter
  onChange: (filter: QuestionFilter) => void
}

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
  const selectedCountLabel = selectedCount > 9 ? '9+' : String(selectedCount)

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="xs"
          variant={hasFilter ? 'fill-gray-800' : 'fill-gray-150'}
          className="gap-1.5 px-2.5"
          onClick={() => {
            setModalVersion((prev) => prev + 1)
            setOpen(true)
          }}
        >
          <FilterIcon className="h-4 w-4" />
          <span>필터</span>
          {hasFilter && (
            <span className="caption-m-semibold bg-gray-white inline-flex min-w-5 items-center justify-center rounded-2xl px-1.5 py-0.5 text-gray-800">
              {selectedCountLabel}
            </span>
          )}
        </Button>
        <PlainCombobox
          title="질문 정렬"
          options={[...QUESTION_SORT_OPTIONS]}
          value={filter.sort}
          onChange={(sort) => onChange({ ...filter, sort })}
          trigger={
            <Button size="xs" variant="fill-gray-150" className="max-w-34 justify-between gap-2 px-2.5">
              <span className="truncate">
                {QUESTION_SORT_OPTIONS.find((option) => option.value === filter.sort)?.label}
              </span>
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
  const selectedCount = useMemo(() => {
    const hasStar = draft.hasStarAnalysis === null ? 0 : 1
    return (
      hasStar +
      draft.sInclusionLevels.length +
      draft.tInclusionLevels.length +
      draft.aInclusionLevels.length +
      draft.rInclusionLevels.length
    )
  }, [draft])
  const selectedCountLabel = selectedCount > 9 ? '9+' : String(selectedCount)

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
  const isStarLevelDisabled = draft.hasStarAnalysis === false

  const handleStarAnalysisChange = (hasStarAnalysis: boolean | null) => {
    setDraft((prev) =>
      hasStarAnalysis === false
        ? {
            ...prev,
            hasStarAnalysis,
            ...EMPTY_STAR_LEVELS,
          }
        : { ...prev, hasStarAnalysis },
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <span className="inline-flex items-center gap-2">
          <span>질문 필터</span>
          <span className="caption-m-semibold text-gray-white inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-800 px-1.5">
            {selectedCountLabel}
          </span>
        </span>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4">
          <span className="caption-l-medium">STAR 분석 여부</span>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="xs"
              className="justify-center"
              variant={draft.hasStarAnalysis === null ? 'fill-gray-800' : 'outline-gray-100'}
              onClick={() => handleStarAnalysisChange(null)}
            >
              전체
            </Button>
            <Button
              size="xs"
              className="justify-center"
              variant={draft.hasStarAnalysis === true ? 'fill-gray-800' : 'outline-gray-100'}
              onClick={() => handleStarAnalysisChange(true)}
            >
              있음
            </Button>
            <Button
              size="xs"
              className="justify-center"
              variant={draft.hasStarAnalysis === false ? 'fill-gray-800' : 'outline-gray-100'}
              onClick={() => handleStarAnalysisChange(false)}
            >
              없음
            </Button>
          </div>
        </div>

        <LevelGroup
          label="S: Situation 분석 결과"
          selected={draft.sInclusionLevels}
          onToggle={(value) => toggleLevel('sInclusionLevels', value)}
          disabled={isStarLevelDisabled}
        />
        <LevelGroup
          label="T: Task 분석 결과"
          selected={draft.tInclusionLevels}
          onToggle={(value) => toggleLevel('tInclusionLevels', value)}
          disabled={isStarLevelDisabled}
        />
        <LevelGroup
          label="A: Action 분석 결과"
          selected={draft.aInclusionLevels}
          onToggle={(value) => toggleLevel('aInclusionLevels', value)}
          disabled={isStarLevelDisabled}
        />
        <LevelGroup
          label="R: Result 분석 결과"
          selected={draft.rInclusionLevels}
          onToggle={(value) => toggleLevel('rInclusionLevels', value)}
          disabled={isStarLevelDisabled}
        />

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-3">
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
  disabled = false,
}: {
  label: string
  selected: string[]
  onToggle: (value: StarLevel) => void
  disabled?: boolean
}) {
  return (
    <div className={`flex flex-col gap-3 rounded-xl border border-gray-100 p-4 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex min-h-6 items-center justify-between">
        <span className="caption-l-medium">{label}</span>
        {selected.length > 0 && (
          <span className="caption-m-semibold rounded-2xl bg-orange-100 px-2 py-0.5 text-orange-500">
            {selected.length}개 선택
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        {STAR_LEVEL_OPTIONS.map((option) => (
          <Checkbox
            key={option.value}
            checked={selected.includes(option.value)}
            onChange={() => onToggle(option.value)}
            disabled={disabled}
            label={option.label}
          />
        ))}
      </div>
    </div>
  )
}
