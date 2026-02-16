const CARD_CLASS = 'border-gray-150 bg-gray-white flex w-full items-center gap-3 border-b px-5 py-4 text-left'

interface UnrecordedInterviewCardProps {
  company: string
  title: string
  timeAgo: string
  logoUrl: string
  onClick: () => void
}

export default function UnrecordedInterviewCard({
  company,
  title,
  timeAgo,
  logoUrl,
  onClick,
}: UnrecordedInterviewCardProps) {
  return (
    <button type="button" className={`cursor-pointer active:bg-gray-100 ${CARD_CLASS}`} onClick={onClick}>
      <div className="border-gray-150 flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
        <img src={logoUrl} alt={`${company} 로고`} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1">
          <h2 className="body-l-bold w-full truncate text-gray-800">{title}</h2>
          <p className="body-s-regular text-gray-500">
            {company} &middot; {timeAgo || '—'}
          </p>
        </div>
      </div>
    </button>
  )
}
