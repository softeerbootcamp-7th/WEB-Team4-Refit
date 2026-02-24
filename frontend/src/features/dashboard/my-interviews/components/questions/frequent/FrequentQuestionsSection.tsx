import { useMemo } from 'react'
import { useGetMyProfileInfo } from '@/apis'
import TermsLockedOverlay from '@/features/dashboard/_index/components/terms-lock/TermsLockedOverlay'
import CategoryList from '@/features/dashboard/my-interviews/components/questions/frequent/category-list/CategoryList'
import QuestionCard from '@/features/dashboard/my-interviews/components/questions/frequent/question-card/QuestionCard'
import { DATA_EMPTY_MESSAGE } from '@/features/dashboard/my-interviews/constants/constants'
import { CircleLeftIcon, CircleRightIcon } from '@/ui/assets'
import { Button } from '@/ui/components'
import { useFrequentQuestions } from './useFrequentQuestions'
import type { FrequentQuestionCategory, QuestionCardModel } from '../mappers'

export default function FrequentQuestionsSection() {
  const { data: profile } = useGetMyProfileInfo({
    query: {
      select: (response) => ({
        nickname: response.result?.nickname?.trim() || '회원',
        isAgreedToTerms: response.result?.isAgreedToTerms ?? false,
      }),
    },
  })
  const nickname = profile?.nickname ?? '회원'
  const isTermsLocked = !(profile?.isAgreedToTerms ?? false)

  const {
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedCategoryQuestions,
    page,
    setPage,
    totalPages,
  } = useFrequentQuestions({ enabled: !isTermsLocked })
  const selectedCategoryName = useMemo(
    () => categories.find((category) => category.categoryId === selectedCategoryId)?.categoryName ?? '',
    [categories, selectedCategoryId],
  )

  const categoriesToRender = isTermsLocked ? DUMMY_CATEGORIES : categories
  const selectedCategoryNameToRender = isTermsLocked ? DUMMY_SELECTED_CATEGORY_NAME : selectedCategoryName
  const questionsToRender = isTermsLocked ? DUMMY_QUESTIONS : selectedCategoryQuestions
  const pageToRender = isTermsLocked ? 1 : page
  const totalPagesToRender = isTermsLocked ? 1 : totalPages
  const selectedCategoryIdToRender = isTermsLocked ? DUMMY_SELECTED_CATEGORY_ID : selectedCategoryId

  if (!isTermsLocked && categories.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="title-s-bold">{nickname}님이 자주 받은 질문들</h2>
        <div className="bg-gray-white body-m-medium flex justify-center gap-5 rounded-lg p-5 py-10 text-gray-500">
          {DATA_EMPTY_MESSAGE.questions}
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="title-s-bold">{nickname}님이 자주 받은 질문들</h2>
      <TermsLockedOverlay isLocked={isTermsLocked} overlayClassName="rounded-lg">
        <div className="bg-gray-white flex gap-5 rounded-lg p-5">
          <CategoryList
            categories={categoriesToRender}
            selectedCategoryId={selectedCategoryIdToRender}
            onSelect={setSelectedCategoryId}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <FrequentQuestionResultHeader
              selectedCategoryName={selectedCategoryNameToRender}
              page={pageToRender}
              totalPages={totalPagesToRender}
              onPrev={() => setPage(Math.max(1, page - 1))}
              onNext={() => setPage(Math.min(totalPages, page + 1))}
            />
            <div className="grid grid-cols-3 gap-3">
              {questionsToRender.length === 0 ? (
                <div className="col-span-3 py-8 text-center text-gray-500">{DATA_EMPTY_MESSAGE.questions}</div>
              ) : (
                questionsToRender.map((card, index) => <QuestionCard key={`${card.question}-${index}`} card={card} />)
              )}
            </div>
          </div>
        </div>
      </TermsLockedOverlay>
    </section>
  )
}

const DUMMY_SELECTED_CATEGORY_ID = 1
const DUMMY_SELECTED_CATEGORY_NAME = '약관 동의'

const DUMMY_CATEGORIES: FrequentQuestionCategory[] = Array.from({ length: 5 }, (_, index) => ({
  categoryId: index + 1,
  categoryName: '약관 동의가 필요합니다.',
  frequentCount: 10 - index,
}))

const DUMMY_QUESTIONS: QuestionCardModel[] = Array.from({ length: 3 }, () => ({
  question: '약관 동의가 필요합니다.',
  companyName: '약관 동의 필요',
  companyLogoUrl: '',
  date: '',
  jobRole: '약관 동의 필요',
  interviewType: 'FIRST',
}))

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
        <span className="body-s-regular text-gray-500">
          {page}/{totalPages}
        </span>
        <Button size="xs" onClick={onNext} disabled={page >= totalPages}>
          <CircleRightIcon />
        </Button>
      </div>
    </div>
  )
}
