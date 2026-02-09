import type { ReactNode } from 'react'
import { SmallLogoIcon } from '@/shared/assets'

export interface DifficultQuestionCardData {
  id: number
  companyName: string
  companyLogo?: ReactNode
  date: string
  jobCategory: string
  interviewType: string
  questionSnippet: string
}

interface DifficultQuestionCardProps {
  data: DifficultQuestionCardData
}

export default function DifficultQuestionCard({ data }: DifficultQuestionCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0px_2px_16px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="border-gray-150 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white text-gray-400">
            {data.companyLogo ?? <SmallLogoIcon className="h-4 w-4" />}
          </div>
          <span className="title-s-semibold text-gray-900">{data.companyName}</span>
        </div>
        <span className="body-s-medium shrink-0 text-gray-400">{data.date}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="body-m-medium text-gray-700">{data.jobCategory}</span>
        <span className="h-3 w-px shrink-0 bg-gray-300" aria-hidden />
        <span className="body-m-medium text-gray-700">{data.interviewType}</span>
      </div>
      <p className="body-m-medium line-clamp-2 text-gray-800">{data.questionSnippet}</p>
    </div>
  )
}
