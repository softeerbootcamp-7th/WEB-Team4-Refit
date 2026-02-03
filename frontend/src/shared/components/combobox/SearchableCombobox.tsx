import { forwardRef, useRef, useState } from 'react'
import { CaretDownIcon, CheckIcon } from '@/shared/assets'
import { useOnClickOutside } from '@/shared/hooks/useOnClickOutside'

export interface SearchableComboboxProps {
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
  error?: string
  required?: boolean
  searchPlaceholder?: string
  /** 검색 결과 없을 경우 검색어로 커스텀 추가 가능 */
  creatable?: boolean
  value?: string
  onChange?: (e: { target: { value: string } }) => void
  disabled?: boolean
  className?: string
}

const SearchableCombobox = forwardRef<HTMLDivElement, SearchableComboboxProps>(
  (
    {
      label,
      options,
      placeholder = '선택해 주세요',
      error,
      required,
      searchPlaceholder = 'Search',
      creatable = false,
      className = '',
      value,
      onChange,
      disabled,
    },
    _ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useOnClickOutside(containerRef, () => setOpen(false), open)

    const selectedOption = options.find((opt) => opt.value === value)
    const displayLabel =
      selectedOption?.label ?? (value != null && String(value).trim() !== '' ? String(value) : placeholder)
    const isPlaceholderSelected = value === '' || value === undefined

    const filteredOptions =
      searchQuery.trim() === ''
        ? options
        : options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.trim().toLowerCase()))

    const handleSelect = (optionValue: string) => {
      onChange?.({ target: { value: optionValue } })
      setOpen(false)
      setSearchQuery('')
    }

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (!disabled) setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }

    return (
      <div className="flex flex-col gap-2" ref={containerRef}>
        {label && (
          <label className="body-l-semibold text-gray-600">
            {label}
            {required && (
              <span className="text-red-400" aria-hidden>
                {' '}
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setOpen((prev) => !prev)}
            onKeyDown={handleTriggerKeyDown}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={label ? `${label} 선택` : undefined}
            className={`body-l-medium flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 ${
              isPlaceholderSelected ? 'text-gray-300' : 'text-gray-900'
            } ${className}`}
          >
            <span className="truncate">{displayLabel}</span>
            <CaretDownIcon className="h-2.5 w-2.5 shrink-0 text-gray-300" />
          </button>

          {open && (
            <div
              className="bg-gray-white absolute top-full right-0 left-0 z-50 mt-1 max-h-[280px] overflow-hidden rounded-xl border border-gray-200 shadow-lg"
              role="listbox"
            >
              <div className="border-gray-150 border-b p-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="body-l-medium w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 outline-none placeholder:text-gray-400 focus:border-orange-500"
                  autoFocus
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              <ul className="max-h-[220px] overflow-y-auto py-1">
                {filteredOptions.length === 0 ? (
                  creatable && searchQuery.trim() !== '' ? (
                    <li
                      role="option"
                      tabIndex={0}
                      onClick={() => handleSelect(searchQuery.trim())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSelect(searchQuery.trim())
                        }
                      }}
                      className="body-l-medium flex cursor-pointer items-center gap-2 px-4 py-3 text-orange-500 hover:bg-gray-100"
                    >
                      &quot;{searchQuery.trim()}&quot; 추가하기
                    </li>
                  ) : (
                    <li className="body-l-medium px-4 py-3 text-gray-400">
                      {searchQuery.trim() !== '' ? '검색 결과가 없어요' : '목록에서 선택해 주세요'}
                    </li>
                  )
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = option.value === value
                    return (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(option.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelect(option.value)
                          }
                        }}
                        tabIndex={0}
                        className={`body-l-medium flex cursor-pointer items-center justify-between gap-2 px-4 py-3 text-gray-900 hover:bg-gray-100 ${
                          isSelected ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected && (
                          <span className="shrink-0 text-orange-500" aria-hidden>
                            <CheckIcon />
                          </span>
                        )}
                      </li>
                    )
                  })
                )}
              </ul>
            </div>
          )}
        </div>
        {error && <p className="body-s-medium text-red-500">{error}</p>}
      </div>
    )
  },
)

SearchableCombobox.displayName = 'SearchableCombobox'

export default SearchableCombobox
