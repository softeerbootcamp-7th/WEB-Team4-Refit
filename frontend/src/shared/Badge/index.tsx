import type { HTMLAttributes } from 'react'

type BadgeType = keyof typeof TYPE_STYLES
type BadgeTheme = keyof typeof THEME_STYLES

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  type?: BadgeType
  theme?: BadgeTheme
  content: string
}

export default function Badge({
  type = 'hard-label',
  theme = 'gray-100',
  content,
  className = '',
  ...props
}: BadgeProps) {
  const combinedStyles = [
    BASE_STYLES,
    TYPE_STYLES[type],
    THEME_STYLES[theme],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={combinedStyles} {...props}>
      {content}
    </span>
  )
}

const BASE_STYLES =
  'inline-flex align-middle items-center justify-center rounded-lg'

const TYPE_STYLES = {
  'hard-label': 'py-1 px-2 caption-l-medium',
  'question-label': 'py-1.5 px-2.5 caption-l-semibold rounded-md',
  'star-label': 'py-1 px-2.5 body-s-medium',
  'd-day-label': 'py-0.5 px-1.5 body-m-semibold',
} as const

const THEME_STYLES = {
  'gray-100': 'bg-gray-100 text-gray-500',
  'gray-white-outline': 'border border-gray-150 bg-gray-white text-gray-600',
  'orange-50': 'bg-orange-50 text-orange-400',
  'orange-100': 'bg-orange-100 text-orange-500',
  'green-100': 'bg-green-50 text-green-400',
  'red-50': 'bg-red-50 text-red-400',
} as const
