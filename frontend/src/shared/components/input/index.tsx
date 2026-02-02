import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="body-l-semibold text-gray-600">
            {label}
            {required && <span className="text-red-400" aria-hidden> *</span>}
          </label>
        )}
        <input
          ref={ref}
          required={required}
          className={`body-l-medium placeholder:text-gray-300 text-gray-900 border-gray-200 focus:border-orange-500 w-full rounded-xl border px-4 py-3 outline-none ${className}`}
          {...props}
        />
        {error && <p className="body-s-medium text-red-500">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
