import { useState } from 'react'
import { INTERVIEW_SORT_OPTIONS } from '@/features/dashboard/my-interviews/constants/constants'
import type { InterviewFilter } from '@/types/interview'
import { CaretDownIcon, FilterIcon } from '@/ui/assets'
import { Button, PlainCombobox } from '@/ui/components'
import InterviewFilterModal from './InterviewFilterModal'

type FilterSortControlsProps = {
  filter: InterviewFilter
  onFilterChange: (filter: InterviewFilter) => void
  isSearching?: boolean
}

export default function FilterSortControls({ filter, onFilterChange, isSearching = false }: FilterSortControlsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterCount =
    filter.interviewType.length +
    filter.resultStatus.length +
    (isSearching ? filter.interviewReviewStatus.length : 0) +
    (filter.startDate ? 1 : 0) +
    (filter.endDate ? 1 : 0)
  const hasFilter = filterCount > 0
  const filterCountLabel = filterCount > 9 ? '9+' : String(filterCount)

  return (
    <div className="flex items-center gap-2">
      <Button
        size="xs"
        variant={hasFilter ? 'fill-gray-800' : 'fill-gray-150'}
        className="gap-1.5 px-2.5"
        onClick={() => setIsFilterOpen(true)}
      >
        <FilterIcon className="h-4 w-4" />
        <span>필터</span>
        {hasFilter && (
          <span className="caption-m-semibold inline-flex min-w-5 items-center justify-center rounded-2xl bg-gray-100 px-1.5 py-0.5 text-gray-800">
            {filterCountLabel}
          </span>
        )}
      </Button>
      <PlainCombobox
        title="면접 정렬"
        options={[...INTERVIEW_SORT_OPTIONS]}
        value={filter.sort}
        onChange={(sort) => onFilterChange({ ...filter, sort })}
        trigger={
          <Button size="xs" variant="fill-gray-150" className="max-w-34 justify-between gap-2 px-2.5">
            <span className="truncate">{INTERVIEW_SORT_OPTIONS.find((o) => o.value === filter.sort)?.label}</span>
            <CaretDownIcon className="h-2 w-2" />
          </Button>
        }
      />

      <InterviewFilterModal
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filter={filter}
        onApply={onFilterChange}
        isSearching={isSearching}
      />
    </div>
  )
}
