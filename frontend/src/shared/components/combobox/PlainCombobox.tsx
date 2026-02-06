import { useCallback, useRef, useState, type ReactNode } from 'react'
import Border from '@/shared/components/border'
import { useOnClickOutside } from '@/shared/hooks/useOnClickOutside'
import type { LabelValueType } from '@/types/global'

type PlainComboboxProps = {
  title?: string
  options: LabelValueType[]
  value: string
  onChange: (value: string) => void
  trigger: ReactNode
}

export default function PlainCombobox({ title, options, value, onChange, trigger }: PlainComboboxProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(() => setOpen(false), [])
  useOnClickOutside(ref, handleClickOutside, open)

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>
      {open && (
        <div className="bg-gray-white absolute top-full right-0 z-10 mt-2 min-w-56 rounded-2xl py-2 shadow-lg">
          {title && (
            <>
              <div className="title-s-semibold px-5 py-2">{title}</div>
              <Border />
            </>
          )}
          <div className="m-3 flex flex-col gap-1.5">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`body-m-medium w-full cursor-pointer rounded-lg px-3 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100 ${
                  value === option.value ? 'text-orange-500' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
