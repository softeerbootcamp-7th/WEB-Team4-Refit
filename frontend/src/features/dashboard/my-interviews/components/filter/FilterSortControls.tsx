import { useState } from 'react'
import { CaretDownIcon, FilterIcon } from '@/designs/assets'
import { Button, PlainCombobox } from '@/designs/components'
import { INTERVIEW_SORT_OPTIONS } from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewFilter } from '@/types/interview'
import InterviewFilterModal from './InterviewFilterModal'

type FilterSortControlsProps = {
  filter: InterviewFilter
  onFilterChange: (filter: InterviewFilter) => void
}

export default function FilterSortControls({ filter, onFilterChange }: FilterSortControlsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterCount =
    filter.interviewType.length + filter.resultStatus.length + (filter.startDate ? 1 : 0) + (filter.endDate ? 1 : 0)
  const hasFilter = filterCount > 0

  return (
    <div className="flex items-center gap-2">
      <Button size="xs" variant={hasFilter ? 'fill-gray-800' : 'fill-gray-150'} onClick={() => setIsFilterOpen(true)}>
        <FilterIcon className="h-4 w-4" />
        {hasFilter ? `필터 ${filterCount}개 선택됨` : '필터'}
      </Button>
      <PlainCombobox
        title="면접 정렬"
        options={[...INTERVIEW_SORT_OPTIONS]}
        value={filter.sort}
        onChange={(sort) => onFilterChange({ ...filter, sort })}
        trigger={
          <Button size="xs" variant="fill-gray-150">
            {INTERVIEW_SORT_OPTIONS.find((o) => o.value === filter.sort)?.label}
            <CaretDownIcon className="h-2 w-2" />
          </Button>
        }
      />

      <InterviewFilterModal
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filter={filter}
        onApply={onFilterChange}
      />
    </div>
  )
}
