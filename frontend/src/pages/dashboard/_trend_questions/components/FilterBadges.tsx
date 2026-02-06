import {
  FILTER_COLORS,
  MAX_VISIBLE_BADGES,
  type FilterBadge,
  type FilterType,
} from '@/pages/dashboard/_trend_questions/constants/constants'
import { CloseIcon } from '@/shared/assets'
import { Button } from '@/shared/components'

type FilterBadgesProps = {
  badges: FilterBadge[]
  onRemove: (type: FilterType, id: number) => void
  onClearAll: () => void
  onSearch: () => void
}

export default function FilterBadges({ badges, onRemove, onClearAll, onSearch }: FilterBadgesProps) {
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
      <Button size="sm" variant="fill-orange-500" onClick={onSearch}>
        선택한 조건으로 모아보기
      </Button>
    </div>
  )
}
