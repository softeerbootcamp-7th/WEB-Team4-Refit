import { CheckIcon } from '@/ui/assets'

type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
  disabled?: boolean
}

export default function Checkbox({ checked, onChange, label, className, disabled = false }: CheckboxProps) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (disabled) return
        onChange(!checked)
      }}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onChange(!checked)
        }
      }}
      className={`flex items-center gap-1.5 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
    >
      <div
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? 'border-orange-500 bg-orange-500'
            : disabled
              ? 'border-gray-300 bg-gray-100'
              : 'bg-gray-white border-gray-300 hover:border-orange-400 hover:bg-orange-100'
        }`}
      >
        {checked && <CheckIcon className="h-3 w-3 text-white" />}
      </div>
      <span className="body-m-medium">{label}</span>
    </div>
  )
}
