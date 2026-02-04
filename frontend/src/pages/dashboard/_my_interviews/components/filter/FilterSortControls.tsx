import { useState } from 'react'
import InterviewFilterModal from '@/pages/dashboard/_my_interviews/components/interviews/InterviewFilterModal'
import { CaretDownIcon, FilterIcon } from '@/shared/assets'
import { Button, Dropdown } from '@/shared/components'
import type { InterviewFilter } from '@/types/interview'

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
      <Dropdown
        title="면접 정렬"
        options={SORT_OPTIONS}
        value={filter.sort}
        onChange={(sort) => onFilterChange({ ...filter, sort })}
        trigger={
          <Button size="xs" variant="fill-gray-150">
            {SORT_OPTIONS.find((o) => o.value === filter.sort)?.label}
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

const SORT_OPTIONS = [
  { label: '면접 일시 최신순', value: 'date-latest' },
  { label: '면접 일시 오래된순', value: 'date-oldest' },
  { label: '최신 업데이트순', value: 'updated' },
  { label: '가나다순', value: 'alphabetical' },
]
