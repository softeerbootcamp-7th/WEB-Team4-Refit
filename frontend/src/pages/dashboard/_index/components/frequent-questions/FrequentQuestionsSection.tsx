import { NoteIcon } from '@/shared/assets'

interface QuestionCategory {
  label: string
  count: number
  color: string
}

const FREQUENT_QUESTION_CATEGORIES: QuestionCategory[] = [
  { label: '리더십', count: 12, color: '#fe6f0f' },
  { label: '자기소개', count: 9, color: '#ff8d4d' },
  { label: '마지막으로 하고싶은 말', count: 7, color: '#ffab7d' },
  { label: '프리랜서 경험 설명', count: 3, color: '#ffc9ab' },
  { label: '어쩌고저쩌고', count: 2, color: '#ffe0d2' },
]

export default function FrequentQuestionsSection() {
  const maxCount = Math.max(...FREQUENT_QUESTION_CATEGORIES.map((item) => item.count))

  return (
    <section className="flex flex-col rounded-2xl bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <NoteIcon className="h-6 w-6 text-gray-400" />
        <h2 className="body-l-semibold text-gray-900">빈출 카테고리 질문 TOP 5</h2>
      </div>
      <div className="flex flex-col gap-4">
        {FREQUENT_QUESTION_CATEGORIES.map((item, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="body-s-medium text-gray-700">{item.label}</span>
              <span className="body-s-medium text-gray-900">{item.count}개</span>
            </div>
            <CategoryBar count={item.count} maxCount={maxCount} color={item.color} />
          </div>
        ))}
      </div>
    </section>
  )
}

function CategoryBar({ count, maxCount, color }: { count: number; maxCount: number; color: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div
        className="h-2 rounded-full"
        style={{
          width: `${(count / maxCount) * 100}%`,
          backgroundColor: color,
        }}
      />
    </div>
  )
}
