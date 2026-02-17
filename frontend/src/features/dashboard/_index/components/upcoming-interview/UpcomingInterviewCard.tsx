import { CalendarStarIcon, NoteIcon, SmallLogoIcon } from '@/designs/assets'
import { Badge } from '@/designs/components'
import Button from '@/designs/components/button'
import type { UpcomingInterviewData } from './types'

interface UpcomingInterviewCardProps {
  data: UpcomingInterviewData
}

const DefaultCompanyLogo = () => <SmallLogoIcon className="h-6 w-6 text-gray-400" />
const DefaultMiniLogo = () => <SmallLogoIcon className="h-4 w-4 text-gray-400" />

export default function UpcomingInterviewCard({ data }: UpcomingInterviewCardProps) {
  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="border-gray-150 flex size-13 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
          {data.companyLogo ?? <DefaultCompanyLogo />}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge content={data.dDay} type="d-day-label" theme="red-50" />
            <h3 className="title-s-bold text-gray-900">
              {data.companyName} {data.position}
            </h3>
          </div>
          <p className="body-s-medium text-gray-500">{data.datetime}</p>
        </div>
      </div>

      <hr className="bg-gray-150 h-px border-0" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CalendarStarIcon className="h-6 w-6 text-gray-400" />
            <span className="body-l-semibold text-gray-800">최근 등록된 관심 산업군 및 직군의 면접질문</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {data.recentQuestions.map((q) => (
            <div key={q.id} className="flex items-start gap-2">
              <span className="body-m-semibold text-gray-300">Q.</span>
              <p className="body-m-medium line-clamp-1 text-gray-900">{q.text}</p>
            </div>
          ))}
        </div>

        <Button variant="outline-gray-white" size="sm" className="w-full">
          비슷한 면접 질문 더 보러가기
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <NoteIcon className="h-6 w-6 text-gray-400" />
          <span className="body-l-semibold text-gray-800">유사한 나의 과거 면접</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {data.similarInterviews.map((interview) => (
            <button
              key={interview.id}
              className="flex cursor-pointer flex-col gap-3 rounded-lg bg-gray-100 p-4"
              onClick={() => {}}
            >
              <span className="body-s-medium w-fit text-gray-300">{interview.date} 응시</span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="border-gray-150 flex h-8.5 w-8.5 items-center justify-center rounded-full border bg-white">
                    {interview.logo ?? <DefaultMiniLogo />}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="title-s-semibold text-gray-900">{interview.companyName}</span>
                    <span className="body-m-medium text-gray-400">{interview.industry}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="body-m-medium text-gray-700">{interview.jobCategory}</span>
                  <span className="h-3 w-px shrink-0 bg-gray-300" aria-hidden />
                  <span className="body-m-medium text-gray-700">{interview.interviewType}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
