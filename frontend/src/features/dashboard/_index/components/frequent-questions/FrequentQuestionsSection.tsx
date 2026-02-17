import { useGetMyFrequentQnaSetCategories } from '@/apis'
import { NoteIcon } from '@/designs/assets'

interface QuestionCategory {
  label: string
  count: number
  colorClass: string
}

const BAR_COLOR_CLASSES = ['bg-orange-500', 'bg-orange-400', 'bg-orange-300', 'bg-orange-200', 'bg-orange-100'] as const

export default function FrequentQuestionsSection() {
  const { data: categories = [] } = useGetMyFrequentQnaSetCategories(
    {
      page: 0,
      size: 5,
    },
    {
      query: {
        select: (response): QuestionCategory[] =>
          (response.result?.content ?? []).map((item, index) => ({
            label: item.categoryName ?? '',
            count: item.frequentCount ?? 0,
            colorClass: BAR_COLOR_CLASSES[index] ?? BAR_COLOR_CLASSES[BAR_COLOR_CLASSES.length - 1],
          })),
      },
    },
  )

  const maxCount = Math.max(...categories.map((item) => item.count), 0)

  return (
    <section className="flex flex-col rounded-2xl bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <NoteIcon className="h-6 w-6 text-gray-400" />
        <h2 className="body-l-semibold text-gray-900">빈출 카테고리 질문 TOP 5</h2>
      </div>
      {categories.length === 0 ? (
        <div className="body-m-medium text-gray-400">아직 빈출 카테고리 데이터가 없어요.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {categories.map((item, i) => (
            <div key={`${item.label}-${i}`} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="body-s-medium text-gray-700">{item.label}</span>
                <span className="body-s-medium text-gray-900">{item.count}개</span>
              </div>
              <CategoryBar count={item.count} maxCount={maxCount} colorClass={item.colorClass} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function CategoryBar({ count, maxCount, colorClass }: { count: number; maxCount: number; colorClass: string }) {
  const width = maxCount > 0 ? (count / maxCount) * 100 : 0

  return (
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div
        className={`h-2 rounded-full ${colorClass}`}
        style={{
          width: `${width}%`,
        }}
      />
    </div>
  )
}
