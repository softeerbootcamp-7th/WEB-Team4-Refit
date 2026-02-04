import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { LoadingSpinner } from '@/shared/assets'

type VariantType = keyof typeof VARIANT_STYLES
type SizeType = keyof typeof SIZE_STYLES
type RadiusType = keyof typeof RADIUS_STYLES

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantType
  size?: SizeType
  radius?: RadiusType
  isLoading?: boolean
  children?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'ghost',
      size = 'md',
      radius = 'default',
      children,
      isLoading = false,
      disabled = false,
      className = '',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading

    const getDisabledVariant = (): VariantType => {
      if (variant === 'ghost') return 'ghost'
      return variant.startsWith('outline') ? 'outline-gray-100' : 'fill-gray-150'
    }
    const finalVariant = isDisabled ? getDisabledVariant() : variant

    const combinedStyles = [
      BASE_STYLES,
      VARIANT_STYLES[finalVariant],
      SIZE_STYLES[size],
      RADIUS_STYLES[radius],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        type={type}
        className={combinedStyles}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner className="absolute h-4 w-4 animate-spin" />}
        <span className={`contents ${isLoading ? 'invisible' : ''}`}>{children}</span>
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button

const BASE_STYLES =
  'relative inline-flex align-middle items-center justify-center gap-2 transition-colors outline-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none'

const VARIANT_STYLES = {
  'fill-orange-500':
    'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 focus-visible:ring-2 focus-visible:ring-orange-500',
  'fill-orange-100':
    'bg-orange-100 text-orange-500 hover:bg-orange-200 active:bg-orange-300 focus-visible:ring-2 focus-visible:ring-orange-100',
  'fill-orange-050':
    'bg-orange-050 text-orange-500 hover:bg-orange-100 active:bg-orange-200 focus-visible:ring-2 focus-visible:ring-orange-050',
  'fill-gray-150':
    'bg-gray-150 text-gray-600 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-2 focus-visible:ring-gray-200',
  'fill-gray-800': 'bg-gray-800 text-white hover:bg-gray-900 focus-visible:ring-2 focus-visible:ring-gray-800',
  'outline-orange-100':
    'bg-orange-100 border border-orange-300 text-orange-500 hover:bg-orange-200 active:bg-orange-300 focus-visible:ring-2 focus-visible:ring-orange-300',
  'outline-gray-100':
    'bg-gray-100 border border-gray-200 text-gray-300 hover:bg-gray-150 active:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-200',
  ghost:
    'bg-transparent disabled:bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-200',
} as const

const SIZE_STYLES = {
  xs: 'h-[32.15px] py-1.5 px-2.5 caption-l-semibold gap-0.75',
  sm: 'h-[39.25px] py-2 px-3 body-m-semibold gap-1',
  md: 'h-[51.9px] py-3 px-5 title-s-semibold gap-1.5',
  lg: 'h-[59px] py-3.5 px-6 title-m-bold gap-1.75',
} as const

const RADIUS_STYLES = {
  default: 'rounded-lg',
  full: 'rounded-full',
} as const
