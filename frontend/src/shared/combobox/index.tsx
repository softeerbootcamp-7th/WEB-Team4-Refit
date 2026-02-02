import { CaretDownIcon } from '@/assets'
import { forwardRef, type SelectHTMLAttributes } from 'react'

export interface ComboboxAccessoryProps {
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
  error?: string
  required?: boolean
}

export interface ComboboxProps extends SelectHTMLAttributes<HTMLSelectElement>, ComboboxAccessoryProps {}

const Combobox = forwardRef<HTMLSelectElement, ComboboxProps>(
  ({ label, options, placeholder, error, required, className = '', value, ...props }, ref) => {
    const isPlaceholderSelected = value === ''

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="body-l-semibold text-gray-600">
            {label}
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
            className={`body-l-medium w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500 ${
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
            <CaretDownIcon className="w-3 text-gray-300" />
          </div>
        </div>
        {error && <p className="body-s-medium text-red-500">{error}</p>}
      </div>
    )
  },
)

Combobox.displayName = 'Combobox'

export default Combobox
