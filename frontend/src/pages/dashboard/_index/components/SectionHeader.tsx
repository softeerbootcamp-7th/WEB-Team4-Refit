import { CircleLeftIcon, CircleRightIcon } from '@/shared/assets'

interface SectionHeaderProps {
  title: string
  description?: string
  onPrev?: () => void
  onNext?: () => void
  showNavArrows?: boolean
}

export default function SectionHeader({
  title,
  description,
  onPrev,
  onNext,
  showNavArrows = true,
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="title-m-bold text-gray-900">{title}</h2>
        {description && <span className="body-l-medium text-gray-500">{description}</span>}
      </div>
      {showNavArrows && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev}
            className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="이전"
          >
            <CircleLeftIcon />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!onNext}
            className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="다음"
          >
            <CircleRightIcon />
          </button>
        </div>
      )}
    </div>
  )
}
