import DifficultQuestionCard from '@/pages/dashboard/_index/components/difficult-questions/DifficultQuestionCard'
import { useDifficultQuestions } from '@/pages/dashboard/_index/hooks/useDifficultQuestions'
import { MeltIcon } from '@/shared/assets'
import { useAutoPagination } from '@/shared/hooks/useAutoPagination'

const ITEMS_PER_PAGE = 1
const AUTO_ADVANCE_MS = 3000

export default function DifficultQuestionsSection() {
  const { data } = useDifficultQuestions()

  const { currentItems, currentPage, totalPages, setCurrentPage, bindHover } = useAutoPagination({
    data,
    itemsPerPage: ITEMS_PER_PAGE,
    intervalMs: AUTO_ADVANCE_MS,
  })

  return (
    <section className="flex min-h-0 flex-col rounded-2xl bg-white p-6">
      <div className="mb-4 flex shrink-0 items-center gap-2">
        <MeltIcon className="h-6 w-6 shrink-0 text-gray-400" />
        <h2 className="body-l-semibold text-gray-900">어렵게 느꼈던 면접 질문</h2>
      </div>
      <div className="flex flex-1 flex-col items-stretch justify-center gap-4" {...bindHover}>
        <div className="grid grid-cols-1 gap-4">
          {currentItems.map((item) => (
            <DifficultQuestionCard key={item.id} data={item} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentPage(i)}
                className={`h-2 w-2 rounded-full transition-colors ${i === currentPage ? 'bg-gray-600' : 'bg-gray-200'}`}
                aria-label={`${i + 1}페이지`}
                aria-current={i === currentPage ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
