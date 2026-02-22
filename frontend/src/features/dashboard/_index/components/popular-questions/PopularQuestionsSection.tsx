import { useNavigate } from 'react-router'
import { ArrowRightIcon, NoteIcon } from '@/designs/assets'
import TermsLockedOverlay from '@/features/dashboard/_index/components/terms-lock/TermsLockedOverlay'
import { ROUTES } from '@/routes/routes'
import { usePopularQuestions, type PopularQuestionItem } from '../../hooks/usePopularQuestions'

interface PopularQuestionsSectionProps {
  isTermsLocked: boolean
}

interface PopularQuestionRowItem extends PopularQuestionItem {
  isPlaceholder?: boolean
}

const MAX_POPULAR_ROWS = 10

const DUMMY_POPULAR_QUESTIONS: PopularQuestionRowItem[] = Array.from({ length: MAX_POPULAR_ROWS }, (_, index) => ({
  id: index + 1,
  rank: index + 1,
  category: '약관 동의가 필요합니다.',
  industry: '약관 동의 필요',
  jobCategory: '약관 동의 필요',
}))

export default function PopularQuestionsSection({ isTermsLocked }: PopularQuestionsSectionProps) {
  const { data, nickname } = usePopularQuestions({ isTermsLocked })
  const navigate = useNavigate()
  const rows = isTermsLocked ? DUMMY_POPULAR_QUESTIONS : fillPopularQuestionPlaceholders(data)

  return (
    <section className="flex flex-col rounded-2xl bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NoteIcon className="h-6 w-6 text-gray-400" />
          <h2 className="body-l-semibold text-gray-900">{nickname}님의 관심 산업 및 직군에서 많이 나온 질문 TOP 10</h2>
        </div>
        <button
          type="button"
          className="body-m-medium flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap text-gray-400 hover:text-gray-600"
          onClick={() => navigate(ROUTES.DASHBOARD_TREND_QUESTIONS)}
        >
          비슷한 질문 더 보러가기
          <ArrowRightIcon className="shrink-0" />
        </button>
      </div>
      {!isTermsLocked && data.length === 0 ? (
        <div className="body-m-medium flex min-h-32 items-center justify-center text-center text-gray-400">
          아직 빈출 질문 데이터가 없어요.
        </div>
      ) : (
        <TermsLockedOverlay isLocked={isTermsLocked} overlayClassName="rounded-xl">
          <div className="overflow-hidden rounded-xl">
            {rows.map((item, i) => (
              <PopularQuestionRow key={item.id} item={item} index={i} />
            ))}
          </div>
        </TermsLockedOverlay>
      )}
    </section>
  )
}

function PopularQuestionRow({ item, index }: { item: PopularQuestionRowItem; index: number }) {
  const rankTextClass = item.isPlaceholder ? 'text-gray-400' : 'text-gray-800'
  const categoryTextClass = item.isPlaceholder ? 'text-gray-400' : 'text-gray-900'
  const metaTextClass = item.isPlaceholder ? 'text-gray-300' : 'text-gray-500'

  return (
    <div className={`flex items-center gap-4 rounded-lg px-4 py-3 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
      <span className={`body-s-semibold w-8 shrink-0 ${rankTextClass}`}>{item.rank}</span>
      <span className={`body-s-semibold min-w-0 flex-1 ${categoryTextClass}`}>{item.category}</span>
      <span className={`caption-l-medium shrink-0 ${metaTextClass}`}>{item.industry}</span>
      <span className={`caption-l-medium shrink-0 ${metaTextClass}`}>{item.jobCategory}</span>
    </div>
  )
}

function fillPopularQuestionPlaceholders(items: PopularQuestionItem[]): PopularQuestionRowItem[] {
  if (items.length >= MAX_POPULAR_ROWS) return items.slice(0, MAX_POPULAR_ROWS)
  if (items.length === 0) return items

  const placeholders: PopularQuestionRowItem[] = Array.from({ length: MAX_POPULAR_ROWS - items.length }, (_, index) => {
    const rank = items.length + index + 1

    return {
      id: 1000 + rank,
      rank,
      category: '데이터가 부족합니다.',
      industry: '',
      jobCategory: '',
      isPlaceholder: true,
    }
  })

  return [...items, ...placeholders]
}
