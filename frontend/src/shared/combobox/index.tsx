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
            {required && <span className="text-red-400" aria-hidden> *</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            required={required}
            className={`body-l-medium border-gray-200 focus:border-orange-500 w-full appearance-none rounded-xl border px-4 py-3 outline-none ${
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
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.59 0.590088L6 5.17009L1.41 0.590088L0 2.00009L6 8.00009L12 2.00009L10.59 0.590088Z"
                fill="#D5D5D5"
              />
            </svg>
          </div>
        </div>
        {error && <p className="body-s-medium text-red-500">{error}</p>}
      </div>
    )
  },
)

Combobox.displayName = 'Combobox'

export default Combobox
