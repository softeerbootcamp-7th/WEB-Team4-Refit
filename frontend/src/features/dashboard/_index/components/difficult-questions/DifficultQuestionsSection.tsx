import { useAutoPagination } from '@/features/_common/_index/hooks/useAutoPagination'
import DifficultQuestionCard from '@/features/dashboard/_index/components/difficult-questions/DifficultQuestionCard'
import { useDifficultQuestions } from '@/features/dashboard/_index/hooks/useDifficultQuestions'
import { CircleLeftIcon, CircleRightIcon, MeltIcon } from '@/ui/assets'

const ITEMS_PER_PAGE = 1
const AUTO_ADVANCE_MS = 3000

export default function DifficultQuestionsSection() {
  const { data } = useDifficultQuestions()

  const { currentItems, currentPage, totalPages, setCurrentPage, goToPrevious, goToNext, bindHover } =
    useAutoPagination({
      data,
      itemsPerPage: ITEMS_PER_PAGE,
      intervalMs: AUTO_ADVANCE_MS,
    })

  if (data.length === 0) {
    return (
      <section className="flex min-h-[232px] flex-col rounded-2xl bg-white p-6">
        <div className="mb-4 flex shrink-0 items-center gap-2">
          <MeltIcon className="h-6 w-6 shrink-0 text-gray-400" />
          <h2 className="body-l-semibold text-gray-900">어렵게 느낀 면접 질문</h2>
        </div>
        <div className="body-m-medium flex flex-1 items-center justify-center text-gray-500">
          아직 어렵게 느낀 질문 데이터가 없어요.
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-0 flex-col rounded-2xl bg-white p-6">
      <div className="mb-4 flex shrink-0 items-center gap-2">
        <MeltIcon className="h-6 w-6 shrink-0 text-gray-400" />
        <h2 className="body-l-semibold text-gray-900">어렵게 느낀 면접 질문</h2>
      </div>
      <div className="flex flex-1 flex-col items-stretch justify-center gap-4" {...bindHover}>
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={totalPages <= 1}
            className="shrink-0 cursor-pointer disabled:opacity-50"
            aria-label="이전 질문"
          >
            <CircleLeftIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
          </button>
          <div className="grid flex-1 grid-cols-1 gap-4">
            {currentItems.map((item) => (
              <DifficultQuestionCard key={item.id} data={item} />
            ))}
          </div>
          <button
            type="button"
            onClick={goToNext}
            disabled={totalPages <= 1}
            className="shrink-0 cursor-pointer disabled:opacity-50"
            aria-label="다음 질문"
          >
            <CircleRightIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
          </button>
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
