import { useGetMyFrequentQnaSetCategories } from '@/apis'
import { NoteIcon } from '@/designs/assets'
import TermsLockedOverlay from '@/features/dashboard/_index/components/terms-lock/TermsLockedOverlay'

interface QuestionCategory {
  label: string
  count: number
  colorClass: string
  isPlaceholder?: boolean
}

const BAR_COLOR_CLASSES = ['bg-orange-500', 'bg-orange-400', 'bg-orange-300', 'bg-orange-200', 'bg-orange-100'] as const
const MAX_CATEGORY_ROWS = 5

const DUMMY_CATEGORIES: QuestionCategory[] = BAR_COLOR_CLASSES.map((colorClass, index) => ({
  label: '약관 동의가 필요합니다.',
  count: 10 - index,
  colorClass,
}))

interface FrequentQuestionsSectionProps {
  isTermsLocked: boolean
}

export default function FrequentQuestionsSection({ isTermsLocked }: FrequentQuestionsSectionProps) {
  const { data: categories = [] } = useGetMyFrequentQnaSetCategories(
    {
      page: 0,
      size: MAX_CATEGORY_ROWS,
    },
    {
      query: {
        enabled: !isTermsLocked,
        select: (response): QuestionCategory[] =>
          (response.result?.content ?? []).map((item, index) => ({
            label: item.categoryName ?? '',
            count: item.frequentCount ?? 0,
            colorClass: BAR_COLOR_CLASSES[index] ?? BAR_COLOR_CLASSES[BAR_COLOR_CLASSES.length - 1],
          })),
      },
    },
  )

  const categoriesToRender = isTermsLocked ? DUMMY_CATEGORIES : fillCategoryPlaceholders(categories)
  const maxCount = Math.max(
    ...categoriesToRender.filter((item) => !item.isPlaceholder).map((item) => item.count),
    0,
  )

  return (
    <section className="flex flex-col rounded-2xl bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <NoteIcon className="h-6 w-6 text-gray-400" />
        <h2 className="body-l-semibold text-gray-900">빈출 카테고리 질문 TOP 5</h2>
      </div>
      {!isTermsLocked && categories.length === 0 ? (
        <div className="body-m-medium flex min-h-28 items-center justify-center text-center text-gray-400">
          아직 빈출 카테고리 데이터가 없어요.
        </div>
      ) : (
        <TermsLockedOverlay isLocked={isTermsLocked} overlayClassName="rounded-xl">
          <CategoryList categories={categoriesToRender} maxCount={maxCount} />
        </TermsLockedOverlay>
      )}
    </section>
  )
}

function CategoryList({ categories, maxCount }: { categories: QuestionCategory[]; maxCount: number }) {
  return (
    <div className="flex flex-col gap-4">
      {categories.map((item, i) => (
        <div key={`${item.label}-${i}`} className="flex flex-col gap-1.5">
          {item.isPlaceholder ? (
            <div className="flex items-center justify-between" aria-hidden>
              <span className="body-s-medium invisible">placeholder</span>
              <span className="body-s-medium invisible">0개</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="body-s-medium text-gray-700">{item.label}</span>
              <span className="body-s-medium text-gray-900">{item.count}개</span>
            </div>
          )}
          <CategoryBar count={item.count} maxCount={maxCount} colorClass={item.colorClass} isPlaceholder={item.isPlaceholder} />
        </div>
      ))}
    </div>
  )
}

function CategoryBar({
  count,
  maxCount,
  colorClass,
  isPlaceholder = false,
}: {
  count: number
  maxCount: number
  colorClass: string
  isPlaceholder?: boolean
}) {
  const width = maxCount > 0 ? (count / maxCount) * 100 : 0

  return (
    <div className="h-2 w-full rounded-full bg-gray-100">
      {!isPlaceholder && (
        <div
          className={`h-2 rounded-full ${colorClass}`}
          style={{
            width: `${width}%`,
          }}
        />
      )}
    </div>
  )
}

function fillCategoryPlaceholders(categories: QuestionCategory[]): QuestionCategory[] {
  if (categories.length >= MAX_CATEGORY_ROWS) return categories.slice(0, MAX_CATEGORY_ROWS)

  const placeholders: QuestionCategory[] = Array.from({ length: MAX_CATEGORY_ROWS - categories.length }, (_, index) => ({
    label: `placeholder-${index}`,
    count: 0,
    colorClass: '',
    isPlaceholder: true,
  }))

  return [...categories, ...placeholders]
}
