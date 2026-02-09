import type { InterviewFilter } from '@/types/interview'
import { MOCK_QNA } from '../../example'
import QnaCard from './QnaCard'

type QuestionListSectionProps = {
  filter: InterviewFilter
}

export default function QuestionListSection({ filter }: QuestionListSectionProps) {
  const filteredQuestions = MOCK_QNA.filter((item) => !filter.keyword || item.company.includes(filter.keyword))

  return (
    <section className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">
        {filteredQuestions.map((item, i) => (
          <QnaCard key={i} {...item} />
        ))}
      </div>
    </section>
  )
}
