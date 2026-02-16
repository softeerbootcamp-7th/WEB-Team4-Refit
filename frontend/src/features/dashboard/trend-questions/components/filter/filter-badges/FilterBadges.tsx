import { CloseIcon } from '@/designs/assets'
import { type FilterBadge, type FilterType } from '@/features/dashboard/trend-questions/constants/constants'

const MAX_VISIBLE_BADGES = 7

type ColorSet = { bg: string; text: string; hover: string }
const FILTER_COLORS = {
  industry: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-200' },
  job: { bg: 'bg-blue-050', text: 'text-blue-600', hover: 'hover:bg-blue-200' },
} as const satisfies Record<FilterType, ColorSet>

type FilterBadgesProps = {
  badges: FilterBadge[]
  onRemove: (type: FilterType, id: number) => void
  onClearAll: () => void
}

export default function FilterBadges({ badges, onRemove, onClearAll }: FilterBadgesProps) {
  const hasFilter = badges.length > 0
  const visibleBadges = badges.slice(0, MAX_VISIBLE_BADGES)
  const hiddenCount = badges.length - MAX_VISIBLE_BADGES

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-2">
        {hasFilter ? (
          <>
            {visibleBadges.map((badge) => {
              const color = FILTER_COLORS[badge.type]
              return (
                <button
                  key={`${badge.type}-${badge.id}`}
                  onClick={() => onRemove(badge.type, badge.id)}
                  className={`body-s-medium flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 pl-3 ${color.bg} ${color.text} ${color.hover}`}
                >
                  {badge.label}
                  <CloseIcon className="h-2.5 w-2.5" />
                </button>
              )
            })}
            {hiddenCount > 0 && <span className="body-s-medium shrink-0 text-gray-500">+{hiddenCount}</span>}
            <button
              type="button"
              onClick={onClearAll}
              className="body-s-medium shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            >
              전체 해제
            </button>
          </>
        ) : (
          <span className="body-m-medium text-gray-400">필터를 선택하세요</span>
        )}
      </div>
    </div>
  )
}
