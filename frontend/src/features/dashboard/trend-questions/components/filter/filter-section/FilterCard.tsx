import { useRef } from 'react'
import { SearchIcon } from '@/designs/assets'
import type { FilterItem } from '@/features/dashboard/trend-questions/constants/constants'

type ColorScheme = 'orange' | 'blue'
type FilterCardProps = {
  title: string
  searchValue: string
  onSearchChange: (value: string) => void
  optionItems: FilterItem[]
  selectedIds: number[]
  onToggle: (id: number) => void
  colorScheme: ColorScheme
  columns?: 1 | 2 | 3
}

export default function FilterCard({
  title,
  searchValue,
  onSearchChange,
  optionItems,
  selectedIds,
  onToggle,
  colorScheme,
  columns = 1,
}: FilterCardProps) {
  const optionButtonRefs = useRef<Array<HTMLButtonElement | null>>([])

  const isSelected = (id: number) => selectedIds.includes(id)
  const hasNoOptionItems = optionItems.length === 0
  const gridClass = GRID_COLS[hasNoOptionItems ? 1 : columns]
  const styles = COLOR_STYLES[colorScheme]

  const focusOption = (index: number) => {
    optionButtonRefs.current[index]?.focus()
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowDown' || optionItems.length === 0) return
    e.preventDefault()
    focusOption(0)
  }

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (optionItems.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusOption(Math.min(optionItems.length - 1, currentIndex + 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusOption(Math.max(0, currentIndex - 1))
    }
  }

  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <h3 className="title-s-semibold">{title}</h3>
        {selectedIds.length > 0 && <span className={`body-s-medium ${styles.count}`}>{selectedIds.length}개 선택</span>}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
        <SearchIcon className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={`${title} 검색`}
          className="body-m-medium w-full bg-transparent outline-none placeholder:text-gray-300"
        />
      </div>
      <div className={`flex h-48 flex-col items-start gap-1 overflow-y-auto ${gridClass}`}>
        {optionItems.map((option, idx) => (
          <button
            key={option.id}
            type="button"
            ref={(el) => {
              optionButtonRefs.current[idx] = el
            }}
            onClick={() => onToggle(option.id)}
            onKeyDown={(e) => handleOptionKeyDown(e, idx)}
            className={`body-m-medium w-full cursor-pointer rounded-lg px-3 py-2 text-left transition-colors ${
              isSelected(option.id) ? styles.selected : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isSelected(option.id) && <span className="mr-2">✓</span>}
            {option.label}
          </button>
        ))}
        {hasNoOptionItems && <p className="body-m-medium w-full py-3 text-center text-gray-400">검색 결과가 없어요</p>}
      </div>
    </div>
  )
}

const GRID_COLS = {
  1: '',
  2: 'grid grid-cols-2',
  3: 'grid grid-cols-3',
} as const

const COLOR_STYLES = {
  orange: { selected: 'bg-orange-50 text-orange-500', count: 'text-orange-500' },
  blue: { selected: 'bg-blue-50 text-blue-500', count: 'text-blue-500' },
} as const
