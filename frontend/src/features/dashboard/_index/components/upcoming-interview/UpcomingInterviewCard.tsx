import { useNavigate } from 'react-router'
import { CalendarStarIcon, SmallLogoIcon } from '@/designs/assets'
import { Badge } from '@/designs/components'
import Button from '@/designs/components/button'
import { ROUTES } from '@/routes/routes'
import type { UpcomingInterviewData } from './types'

interface UpcomingInterviewCardProps {
  data: UpcomingInterviewData
}

const DefaultCompanyLogo = () => <SmallLogoIcon className="h-6 w-6 text-gray-400" />

export default function UpcomingInterviewCard({ data }: UpcomingInterviewCardProps) {
  const navigate = useNavigate()

  return (
    <div className="flex h-full w-full flex-col gap-5 rounded-2xl bg-white p-6">
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
            <span className="body-l-semibold text-gray-800">{data.jobCategoryName} 면접 기출 질문</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {data.recentQuestions.length === 0 && (
            <p className="body-m-medium my-9 text-center text-gray-400">아직 기출 질문 데이터가 없어요.</p>
          )}
          {data.recentQuestions.slice(0, 3).map((q) => (
            <div key={q.id} className="flex items-start gap-2">
              <span className="body-m-semibold text-gray-300">Q.</span>
              <p className="body-m-medium line-clamp-1 text-gray-900">{q.text}</p>
            </div>
          ))}
        </div>

        <Button
          variant="outline-gray-white"
          size="sm"
          className="w-full"
          onClick={() => navigate(ROUTES.DASHBOARD_TREND_QUESTIONS)}
        >
          비슷한 면접 질문 더 보러가기
        </Button>
      </div>
    </div>
  )
}
