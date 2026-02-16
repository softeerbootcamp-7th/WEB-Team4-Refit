import { useMemo } from 'react'
import { useGetDebriefIncompletedInterviews } from '@/apis'
import type { DashboardDebriefIncompletedInterviewResponse } from '@/apis'

const PAGEABLE = { page: 0, size: 20 }

function formatTimeAgo(passedDays?: number): string {
  if (passedDays == null || passedDays < 0) return ''
  if (passedDays === 0) return '오늘'
  if (passedDays === 1) return '1일 전'
  if (passedDays < 7) return `${passedDays}일 전`
  if (passedDays < 14) return '1주 전'
  if (passedDays < 21) return '2주 전'
  if (passedDays < 28) return '3주 전'
  return `${Math.floor(passedDays / 7)}주 전`
}

function getLogoPlaceholderUrl(companyName?: string): string {
  const initial = companyName?.charAt(0)?.toUpperCase() || '?'
  return `https://placehold.co/40/6b7280/fff?text=${encodeURIComponent(initial)}`
}

function mapToCardItem(item: DashboardDebriefIncompletedInterviewResponse) {
  const interview = item.interview
  const companyName = interview?.companyName ?? '알 수 없음'
  const jobCategoryName = interview?.jobCategoryName ?? ''
  const interviewType = interview?.interviewType ?? ''
  const title = [jobCategoryName, interviewType].filter(Boolean).join(' ') || '면접'
  return {
    id: String(interview?.interviewId ?? ''),
    company: companyName,
    title: title.trim() || '면접',
    timeAgo: formatTimeAgo(item.passedDays),
    logoUrl: getLogoPlaceholderUrl(companyName),
  }
}

export type DebriefIncompletedCardItem = ReturnType<typeof mapToCardItem>

export function useUnrecordedInterviews() {
  const { data, isLoading, isError } = useGetDebriefIncompletedInterviews(PAGEABLE)

  const items = useMemo(() => {
    const content = data?.result?.content ?? []
    return content.map(mapToCardItem).filter((item) => item.id)
  }, [data])

  return { items, isLoading, isError }
}
