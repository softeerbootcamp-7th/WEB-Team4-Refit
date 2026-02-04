import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { CaretDownIcon } from '@/shared/assets'

export interface NativeComboboxProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
}

const NativeCombobox = forwardRef<HTMLSelectElement, NativeComboboxProps>(
  (
    { label, options, placeholder = '선택해 주세요', required, className = '', value, disabled, onChange, ...props },
    ref,
  ) => {
    const isPlaceholderSelected = value === '' || value === undefined

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="body-l-semibold flex gap-1 text-gray-600">
            <span>{label}</span>
            {required && (
              <span className="text-red-400" aria-hidden>
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            required={required}
            disabled={disabled}
            onChange={onChange}
            className={`body-l-medium w-full cursor-pointer appearance-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500 ${
              isPlaceholderSelected ? 'text-gray-300' : 'text-gray-900'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <CaretDownIcon className="h-3 w-3 text-gray-300" />
          </div>
        </div>
      </div>
    )
  },
)

NativeCombobox.displayName = 'NativeCombobox'

export default NativeCombobox
