import { useMemo } from 'react'
import { useGetMyProfileInfo } from '@/apis'
import { CircleLeftIcon, CircleRightIcon } from '@/designs/assets'
import { Button } from '@/designs/components'
import CategoryList from '@/features/dashboard/my-interviews/components/questions/frequent/category-list/CategoryList'
import QuestionCard from '@/features/dashboard/my-interviews/components/questions/frequent/question-card/QuestionCard'
import { DATA_EMPTY_MESSAGE } from '@/features/dashboard/my-interviews/constants/constants'
import { useFrequentQuestions } from './useFrequentQuestions'

export default function FrequentQuestionsSection() {
  const {
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedCategoryQuestions,
    page,
    setPage,
    totalPages,
  } = useFrequentQuestions()
  const selectedCategoryName = useMemo(
    () => categories.find((category) => category.categoryId === selectedCategoryId)?.categoryName ?? '',
    [categories, selectedCategoryId],
  )

  const { data: nickname = '회원' } = useGetMyProfileInfo({
    query: {
      select: (response) => response.result?.nickname?.trim() || '회원',
    },
  })

  if (categories.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="title-s-bold">{nickname}님이 자주 받은 질문들</h2>
        <div className="bg-gray-white flex gap-5 rounded-lg p-5">{DATA_EMPTY_MESSAGE.questions}</div>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="title-s-bold">{nickname}님이 자주 받은 질문들</h2>
      <div className="bg-gray-white flex gap-5 rounded-lg p-5">
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <FrequentQuestionResultHeader
            selectedCategoryName={selectedCategoryName}
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage(Math.max(1, page - 1))}
            onNext={() => setPage(Math.min(totalPages, page + 1))}
          />
          <div className="grid grid-cols-3 gap-3">
            {selectedCategoryQuestions.length === 0 ? (
              <div className="col-span-3 py-8 text-center text-gray-400">{DATA_EMPTY_MESSAGE.questions}</div>
            ) : (
              selectedCategoryQuestions.map((card, index) => (
                <QuestionCard key={`${card.question}-${index}`} card={card} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

type FrequentQuestionResultHeaderProps = {
  selectedCategoryName: string
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

function FrequentQuestionResultHeader({
  selectedCategoryName,
  page,
  totalPages,
  onPrev,
  onNext,
}: FrequentQuestionResultHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="body-l-semibold">
        <span className="text-orange-500">&apos;{selectedCategoryName}&apos;</span>에 관한 질문과 답변들
      </h3>
      <div className="flex gap-3"></div>
      <div className="flex items-center gap-2">
        <Button size="xs" onClick={onPrev} disabled={page <= 1}>
          <CircleLeftIcon />
        </Button>
        <span className="body-s-regular text-gray-400">
          {page}/{totalPages}
        </span>
        <Button size="xs" onClick={onNext} disabled={page >= totalPages}>
          <CircleRightIcon />
        </Button>
      </div>
    </div>
  )
}
