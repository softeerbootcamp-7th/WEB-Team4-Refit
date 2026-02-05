import { useState } from 'react'
import { QnaCard } from '@/pages/dashboard/_my_interviews/components/questions'
import type { InterviewResultStatus } from '@/pages/dashboard/_my_interviews/constants/constants'
import { CaretDownIcon } from '@/shared/assets'
import { Button, PlainCombobox } from '@/shared/components'

export type QnaCardListItem = {
  id: number
  resultStatus: InterviewResultStatus
  date: string
  company: string
  job: string
  interviewType: string
  question: string
  answer?: string
}

const SORT_OPTIONS = [
  { label: '최신 추가순', value: 'latest' },
  { label: '오래된 추가순', value: 'oldest' },
  { label: '이름순', value: 'name' },
] as const

type QnaCardListSectionProps = {
  title: string
  items: QnaCardListItem[]
}

export default function QnaCardListSection({ title, items }: QnaCardListSectionProps) {
  const [sortOrder, setSortOrder] = useState('latest')

  return (
    <div className="mx-auto flex h-full w-full justify-center">
      <div className="flex h-full w-full flex-col">
        <div className="bg-gray-150 flex shrink-0 items-center justify-between px-10 py-6">
          <h1 className="title-m-bold text-gray-900">{title}</h1>
          <PlainCombobox
            title="정렬"
            options={[...SORT_OPTIONS]}
            value={sortOrder}
            onChange={setSortOrder}
            trigger={
              <Button size="xs" variant="fill-gray-150">
                {SORT_OPTIONS.find((o) => o.value === sortOrder)?.label ?? SORT_OPTIONS[0].label}
                <CaretDownIcon className="h-2 w-2" />
              </Button>
            }
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-10 pb-6">
          {items.map((item) => (
            <QnaCard
              key={item.id}
              resultStatus={item.resultStatus}
              date={item.date}
              company={item.company}
              jobRole={item.job}
              interviewType={item.interviewType}
              question={item.question}
              answer={item.answer ?? ''}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
