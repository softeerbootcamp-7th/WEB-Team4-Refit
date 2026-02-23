import { useState, type RefObject } from 'react'
import { useNavigate } from 'react-router'
import RetroDetailModal from '@/features/_common/components/retro-detail-modal/RetroDetailModal'
import QnaCard from '@/features/dashboard/my-interviews/components/questions/list/qna-card/QnaCard'
import type { InterviewResultStatus } from '@/features/dashboard/my-interviews/constants/constants'
import { ROUTES } from '@/routes/routes'
import type { InterviewType } from '@/types/interview'
import { CaretDownIcon } from '@/ui/assets'
import { Button, PlainCombobox } from '@/ui/components'

export type QnaCardListItem = {
  id: number | string
  interviewId: number
  qnaSetId: number
  resultStatus: InterviewResultStatus
  date: string
  companyName: string
  companyLogoUrl?: string
  job: string
  interviewType: InterviewType
  question: string
  answer?: string
  createdAt?: string
}

const SORT_OPTIONS = [
  { label: '면접 일시 최신순', value: 'latest' },
  { label: '면접 일시 오래된순', value: 'oldest' },
] as const
export type CollectionSortOrder = (typeof SORT_OPTIONS)[number]['value']

type QnaCardListSectionProps = {
  title: string
  items: QnaCardListItem[]
  sortOrder: CollectionSortOrder
  onSortChange: (value: CollectionSortOrder) => void
  isLoading?: boolean
  isFetchingNext?: boolean
  hasNextPage?: boolean
  loadMoreRef?: RefObject<HTMLDivElement | null>
  errorMessage?: string
  emptyMessage?: string
}

export default function QnaCardListSection({
  title,
  items,
  sortOrder,
  onSortChange,
  isLoading = false,
  isFetchingNext = false,
  hasNextPage = false,
  loadMoreRef,
  errorMessage,
  emptyMessage = '아직 저장된 질문이 없어요.',
}: QnaCardListSectionProps) {
  const navigate = useNavigate()
  const [selectedCard, setSelectedCard] = useState<QnaCardListItem | null>(null)

  const hasItems = items.length > 0
  const isSortDisabled = isLoading || Boolean(errorMessage) || !hasItems

  const handleCardClick = (item: QnaCardListItem) => {
    if (item.qnaSetId === 0) {
      navigate(ROUTES.RETRO_DETAILS.replace(':interviewId', String(item.interviewId)))
    } else {
      setSelectedCard(item)
    }
  }

  return (
    <div className="mx-auto flex h-full w-full justify-center">
      <div className="flex h-full w-full flex-col">
        <div className="flex shrink-0 items-center justify-between px-10 py-6">
          <h1 className="title-m-bold text-gray-900">{title}</h1>
          <PlainCombobox
            options={[...SORT_OPTIONS]}
            value={sortOrder}
            onChange={(value) => onSortChange(value as CollectionSortOrder)}
            trigger={
              <Button size="xs" variant="fill-gray-150" disabled={isSortDisabled}>
                {SORT_OPTIONS.find((o) => o.value === sortOrder)?.label ?? SORT_OPTIONS[0].label}
                <CaretDownIcon className="h-2 w-2" />
              </Button>
            }
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-10 pb-6">
          <QnaCardListContent
            isLoading={isLoading}
            errorMessage={errorMessage}
            hasItems={hasItems}
            emptyMessage={emptyMessage}
            items={items}
            hasNextPage={hasNextPage}
            isFetchingNext={isFetchingNext}
            loadMoreRef={loadMoreRef}
            onCardClick={handleCardClick}
          />
        </div>
      </div>
      {selectedCard && (
        <RetroDetailModal
          open={true}
          onClose={() => setSelectedCard(null)}
          interviewId={selectedCard.interviewId}
          qnaSetId={selectedCard.qnaSetId}
          onMoveToDetails={() =>
            navigate(ROUTES.RETRO_DETAILS.replace(':interviewId', String(selectedCard.interviewId)))
          }
        />
      )}
    </div>
  )
}

type QnaCardListContentProps = {
  isLoading: boolean
  errorMessage?: string
  hasItems: boolean
  emptyMessage: string
  items: QnaCardListItem[]
  hasNextPage: boolean
  isFetchingNext: boolean
  loadMoreRef?: RefObject<HTMLDivElement | null>
  onCardClick: (item: QnaCardListItem) => void
}

function QnaCardListContent({
  isLoading,
  errorMessage,
  hasItems,
  emptyMessage,
  items,
  hasNextPage,
  isFetchingNext,
  loadMoreRef,
  onCardClick,
}: QnaCardListContentProps) {
  if (isLoading) return <QnaCardListSkeleton />
  if (errorMessage) return <StatusText text={errorMessage} />
  if (!hasItems) return <StatusText text={emptyMessage} />

  return (
    <>
      {items.map((item) => (
        <QnaCard
          key={item.id}
          resultStatus={item.resultStatus}
          date={item.date}
          companyName={item.companyName}
          companyLogoUrl={item.companyLogoUrl}
          jobRole={item.job}
          interviewType={item.interviewType}
          question={item.question}
          answer={item.answer ?? ''}
          onClick={() => onCardClick(item)}
        />
      ))}
      {hasNextPage && <div ref={loadMoreRef} className="h-8 w-full" aria-hidden />}
      {isFetchingNext && <QnaCardFetchMoreSkeleton />}
    </>
  )
}

function StatusText({ text }: { text: string }) {
  return <div className="bg-gray-white body-l-medium rounded-xl px-6 py-12 text-center text-gray-400">{text}</div>
}

function QnaCardListSkeleton() {
  return (
    <>
      <div className="bg-gray-150 h-52 animate-pulse rounded-2xl" />
      <div className="bg-gray-150 h-52 animate-pulse rounded-2xl" />
      <div className="bg-gray-150 h-52 animate-pulse rounded-2xl" />
    </>
  )
}

function QnaCardFetchMoreSkeleton() {
  return (
    <>
      <div className="bg-gray-150 h-52 animate-pulse rounded-2xl" />
      <div className="bg-gray-150 h-52 animate-pulse rounded-2xl" />
    </>
  )
}
