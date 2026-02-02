import { useNavigate } from 'react-router'
import { ROUTES } from '@/constants/routes'

const MOCK_INTERVIEWS = [
  {
    id: '1',
    company: '현대자동차',
    title: 'UI Designer 2차 면접',
    dateTime: '2026. 03. 01. 오후 2시 30분',
    timeAgo: '2시간 30분 전',
    logoUrl: 'https://placehold.co/40/002c5f/fff?text=H',
  },
  {
    id: '2',
    company: '카카오',
    title: '프론트엔드 개발자 1차 면접',
    dateTime: '2026. 02. 28. 오전 10시',
    timeAgo: '1일 전',
    logoUrl: 'https://placehold.co/40/000/fff?text=K',
  },
  {
    id: '3',
    company: '네이버',
    title: '백엔드 개발자 최종 면접',
    dateTime: '2026. 03. 05. 오후 3시',
    timeAgo: '3일 전',
    logoUrl: 'https://placehold.co/40/03c75a/fff?text=N',
  },
  {
    id: '4',
    company: '토스',
    title: '프로덕트 디자이너 2차 면접',
    dateTime: '2026. 03. 10. 오전 11시',
    timeAgo: '1주 전',
    logoUrl: 'https://placehold.co/40/3182f6/fff?text=T',
  },
  {
    id: '5',
    company: '당근마켓',
    title: 'iOS 개발자 1차 면접',
    dateTime: '2026. 03. 15. 오후 2시',
    timeAgo: '2주 전',
    logoUrl: 'https://placehold.co/40/ff6f0f/fff?text=D',
  },
  {
    id: '6',
    company: '라인',
    title: '풀스택 개발자 면접',
    dateTime: '2026. 03. 20. 오전 9시 30분',
    timeAgo: '3주 전',
    logoUrl: 'https://placehold.co/40/00b900/fff?text=L',
  },
]

const CARD_CLASS = 'border-gray-150 bg-gray-white flex w-full items-center gap-3 border-b px-5 py-4 text-left'

function InterviewCard({
  company,
  title,
  timeAgo,
  logoUrl,
  onClick,
}: {
  company: string
  title: string
  timeAgo: string
  logoUrl: string
  onClick: () => void
}) {
  return (
    <button type="button" className={`cursor-pointer active:bg-gray-100 ${CARD_CLASS}`} onClick={onClick}>
      <div className="border-gray-150 flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
        <img src={logoUrl} alt={`${company} 로고`} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1">
          <h2 className="body-l-bold w-full truncate text-gray-800">{title}</h2>
          <p className="body-s-regular text-gray-500">
            {company} &middot; {timeAgo}
          </p>
        </div>
      </div>
    </button>
  )
}

export default function MobileUnrecordedPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col pb-8">
      <div className="px-5 pt-[18px]">
        <h1 className="title-l-bold text-gray-800">어떤 면접을 복기할까요?</h1>
      </div>

      <ul className="mt-2 flex flex-col [&_li:last-child_button]:border-b-0">
        {MOCK_INTERVIEWS.map((item) => (
          <li key={item.id}>
            <InterviewCard
              company={item.company}
              title={item.title}
              timeAgo={item.timeAgo}
              logoUrl={item.logoUrl}
              onClick={() => navigate(ROUTES.MOBILE_RECORD.replace(':interviewId', item.id))}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
