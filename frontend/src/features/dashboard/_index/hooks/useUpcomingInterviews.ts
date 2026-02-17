import { useGetUpcomingInterviews } from '@/apis'
import type { DashboardUpcomingInterviewResponse, InterviewDto } from '@/apis'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import type { UpcomingInterviewData } from '../components/upcoming-interview/types'

const DAY_IN_MS = 24 * 60 * 60 * 1000

function isValidDate(date: Date) {
  return !Number.isNaN(date.getTime())
}

function toInterviewTypeLabel(interviewType: InterviewDto['interviewType']): string {
  return INTERVIEW_TYPE_LABEL[interviewType as keyof typeof INTERVIEW_TYPE_LABEL] ?? interviewType
}

function getDdayLabel(interviewStartAt: string): string {
  const interviewDate = new Date(interviewStartAt)
  if (!isValidDate(interviewDate)) return 'D-Day'

  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfInterview = new Date(interviewDate.getFullYear(), interviewDate.getMonth(), interviewDate.getDate())

  const diffDays = Math.round((startOfInterview.getTime() - startOfToday.getTime()) / DAY_IN_MS)

  if (diffDays > 0) return `D-${diffDays}`
  if (diffDays < 0) return `D+${Math.abs(diffDays)}`
  return 'D-Day'
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  if (!isValidDate(date)) return '-'

  const datePart = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const timePart = date.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    hour12: true,
  })

  return `${datePart} ${timePart}`.trim()
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (!isValidDate(date)) return '-'

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function formatUpdatedTime(dateString: string): string {
  const date = new Date(dateString)
  if (!isValidDate(date)) return ''

  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function mapUpcomingInterview(item: DashboardUpcomingInterviewResponse): UpcomingInterviewData {
  const interview = item.upcomingInterview

  return {
    id: interview.interviewId,
    dDay: getDdayLabel(interview.interviewStartAt),
    companyName: interview.companyName,
    position: `${interview.jobCategoryName} ${toInterviewTypeLabel(interview.interviewType)}`,
    datetime: formatDateTime(interview.interviewStartAt),
    lastUpdated: formatUpdatedTime(interview.updatedAt),
    recentQuestions: (item.frequentlyAskedQuestions ?? []).map((question, index) => ({
      id: index + 1,
      text: question,
    })),
    similarInterviews: (item.relatedInterviews ?? []).map((relatedInterview) => ({
      id: relatedInterview.interviewId,
      date: formatDate(relatedInterview.interviewStartAt),
      companyName: relatedInterview.companyName,
      industry: '',
      jobCategory: relatedInterview.jobCategoryName,
      interviewType: toInterviewTypeLabel(relatedInterview.interviewType),
    })),
  }
}

export const useUpcomingInterviews = () => {
  const { data: response } = useGetUpcomingInterviews(
    {
      page: 0,
      size: 10,
      sort: ['interviewStartAt,asc'],
    },
    {
      query: {
        select: (data): { content: DashboardUpcomingInterviewResponse[]; totalElements: number } => ({
          content: data?.result?.content ?? [],
          totalElements: data?.result?.totalElements ?? 0,
        }),
      },
    },
  )

  const data = (response?.content ?? []).map(mapUpcomingInterview)

  return {
    data,
    count: response?.totalElements ?? data.length,
  }
}
