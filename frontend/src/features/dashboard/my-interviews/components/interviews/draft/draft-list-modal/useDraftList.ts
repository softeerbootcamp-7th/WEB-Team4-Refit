import { useMemo, useState } from 'react'
import { useGetMyInterviewDrafts } from '@/apis/generated/interview-my-api/interview-my-api'
import type { GetMyInterviewDraftsInterviewDraftType } from '@/apis/generated/refit-api.schemas'
import { mapDraftInterviewRow } from '@/features/dashboard/my-interviews/components/interviews/mappers'

const PAGE_SIZE = 10

export function useDraftList(open: boolean, interviewDraftType: GetMyInterviewDraftsInterviewDraftType) {
  const [page, setPage] = useState(0)
  const [removedIds, setRemovedIds] = useState<number[]>([])

  const { data, isPending } = useGetMyInterviewDrafts(
    { interviewDraftType, page, size: PAGE_SIZE },
    { query: { enabled: open } },
  )

  const rows = useMemo(() => (data?.result?.content ?? []).map(mapDraftInterviewRow), [data?.result?.content])
  const visibleRows = useMemo(() => rows.filter((row) => !removedIds.includes(row.interviewId)), [removedIds, rows])
  const totalCount = data?.result?.totalElements ?? 0
  const totalPages = data?.result?.totalPages ?? 1
  const draftType = interviewDraftType === 'LOGGING' ? '기록' : '회고'

  const markAsRemoved = (id: number) => setRemovedIds((prev) => [...prev, id])

  const resetList = () => {
    setPage(0)
    setRemovedIds([])
  }

  return {
    page,
    setPage,
    visibleRows,
    totalCount,
    totalPages,
    draftType,
    isPending,
    markAsRemoved,
    resetList,
  }
}
