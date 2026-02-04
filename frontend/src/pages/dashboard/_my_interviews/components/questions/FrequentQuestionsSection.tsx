import { useState, useEffect } from 'react'
import { CaretDownIcon } from '@/shared/assets'
import { Badge, Button } from '@/shared/components'
import { MOCK_QUESTION_PREVIEWS, MOCK_QUESTION_RANKS } from '../../example'
import type { QuestionRankType, QuestionPreviewType } from '../../example'

export default function FrequentQuestionsSection() {
  const [categories] = useState<QuestionRankType[]>(MOCK_QUESTION_RANKS)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    MOCK_QUESTION_RANKS.length > 0 ? MOCK_QUESTION_RANKS[0].categoryId : null,
  )
  const [questions, setQuestions] = useState<QuestionPreviewType[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // TODO: API 연동 시 훅 분리 - 선택된 카테고리의 질문 조회
  // 지금은 mock data 기반으로 작업해둠 (변경 예정)
  useEffect(() => {
    if (selectedCategoryId === null) return
    const fetchQuestions = async () => {
      const selectedCategory = categories.find((c) => c.categoryId === selectedCategoryId)
      if (selectedCategory) {
        setQuestions(MOCK_QUESTION_PREVIEWS[selectedCategory.categoryName] ?? [])
        setTotalPages(20)
      }
    }
    fetchQuestions()
  }, [selectedCategoryId, page, categories])

  return (
    <section className="flex flex-col gap-3">
      <h2 className="title-s-bold">정윤님이 많이 받은 질문들</h2>
      <div className="bg-gray-white flex gap-5 rounded-lg p-5">
        <div className="flex shrink-0 basis-1/4 flex-col gap-2">
          {categories.map(({ categoryId, categoryName, frequentCount }, idx) => (
            <div
              key={categoryId}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-6 py-2 transition-colors hover:bg-gray-100 ${
                selectedCategoryId === categoryId ? 'bg-gray-100' : ''
              }`}
              onClick={() => {
                setSelectedCategoryId(categoryId)
                setPage(1)
              }}
            >
              <div className="body-s-semibold flex items-center gap-5">
                <span className={`${idx < 3 ? 'text-gray-800' : 'text-gray-300'}`}>{idx + 1}</span>
                <span className="text-gray-700">{categoryName}</span>
              </div>
              <span className="body-s-semibold text-gray-700">{frequentCount}회</span>
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="body-l-semibold">
              <span className="text-orange-500">
                &apos;{categories.find((c) => c.categoryId === selectedCategoryId)?.categoryName ?? ''}&apos;
              </span>
              에 관한 질문과 답변들
            </h3>
            <div className="flex items-center gap-2">
              <Button
                size="xs"
                variant="outline-gray-100"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                <CaretDownIcon className="h-3 w-3 rotate-90" />
              </Button>
              <span className="body-s-regular text-gray-400">
                {page}/{totalPages}
              </span>
              <Button
                size="xs"
                variant="outline-gray-100"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
              >
                <CaretDownIcon className="h-3 w-3 -rotate-90" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {questions.length === 0 ? (
              <div className="col-span-3 py-8 text-center text-gray-400">질문이 없습니다</div>
            ) : (
              questions.map((card, i) => <QuestionCard key={i} card={card} />)
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const QuestionCard = ({ card }: { card: QuestionPreviewType }) => {
  return (
    <div className="flex cursor-pointer flex-col gap-2 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-100">
      <div className="flex items-center gap-2">
        <Badge
          content={RESULT_LABEL[card.resultStatus]}
          type="question-label"
          theme={RESULT_THEME[card.resultStatus]}
        />
        <span className="body-xs-regular text-gray-400">{card.date}</span>
      </div>
      <div className="body-s-semibold text-gray-800">{card.company}</div>
      <div className="body-xs-regular text-gray-500">
        {card.jobRole} | {card.interviewType}
      </div>
      <p className="body-xs-regular line-clamp-2 text-gray-600">{card.question}</p>
    </div>
  )
}

const RESULT_THEME = {
  pass: 'green-100',
  wait: 'orange-50',
  fail: 'red-50',
} as const

const RESULT_LABEL = {
  pass: '합격',
  wait: '발표 대기',
  fail: '불합격',
} as const
