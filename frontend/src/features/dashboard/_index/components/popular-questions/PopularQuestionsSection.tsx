import { ArrowRightIcon, NoteIcon } from '@/designs/assets'
import { usePopularQuestions, type PopularQuestionItem } from '../../hooks/usePopularQuestions'

export default function PopularQuestionsSection() {
  const { data } = usePopularQuestions()

  return (
    <section className="flex flex-col rounded-2xl bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NoteIcon className="h-6 w-6 text-gray-400" />
          <h2 className="body-l-semibold text-gray-900">정윤님의 관심 산업 및 직군에서 많이 나온 질문 TOP 10</h2>
        </div>
        <button
          type="button"
          className="body-m-medium flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap text-gray-400 hover:text-gray-600"
        >
          비슷한 질문 더 보러가기
          <ArrowRightIcon className="shrink-0" />
        </button>
      </div>
      <div className="overflow-hidden rounded-xl">
        {data.map((item, i) => (
          <PopularQuestionRow key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}

function PopularQuestionRow({ item, index }: { item: PopularQuestionItem; index: number }) {
  return (
    <div className={`flex items-center gap-4 rounded-lg px-4 py-3 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
      <span className="body-s-semibold w-8 shrink-0 text-gray-800">{item.rank}</span>
      <span className="body-s-semibold min-w-0 flex-1 text-gray-900">{item.category}</span>
      <span className="caption-l-medium shrink-0 text-gray-500">{item.industry}</span>
      <span className="caption-l-medium shrink-0 text-gray-500">{item.jobCategory}</span>
    </div>
  )
}
