import { CheckIcon } from '@/shared/assets'

type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
}

export default function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onChange(!checked)
        }
      }}
      className={`flex cursor-pointer items-center gap-1.5 ${className}`}
    >
      <div
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? 'border-orange-500 bg-orange-500'
            : 'bg-gray-white border-gray-300 hover:border-orange-400 hover:bg-orange-100'
        }`}
      >
        {checked && <CheckIcon className="h-3 w-3 text-white" />}
      </div>
      <span className="body-m-medium">{label}</span>
    </div>
  )
}
