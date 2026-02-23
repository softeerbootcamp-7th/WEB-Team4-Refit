import { useGetMyDifficultQnaSets } from '@/apis'
import type { InterviewDto, MyDifficultQuestionResponse } from '@/apis'
import { INTERVIEW_TYPE_LABEL } from '@/constants/interviews'
import type { DifficultQuestionCardData } from '@/features/dashboard/_index/components/difficult-questions/DifficultQuestionCard'

function formatAppliedDate(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day} 응시`
}

function toInterviewTypeLabel(interviewType: InterviewDto['interviewType']): string {
  return INTERVIEW_TYPE_LABEL[interviewType as keyof typeof INTERVIEW_TYPE_LABEL] ?? interviewType
}

function mapDifficultQuestion(item: MyDifficultQuestionResponse): DifficultQuestionCardData {
  const interview = item.interview

  return {
    id: interview?.interviewId ?? 0,
    companyName: interview?.companyName ?? '',
    companyLogoUrl: interview?.companyLogoUrl,
    date: formatAppliedDate(interview?.interviewStartAt ?? ''),
    jobCategory: interview?.jobCategoryName ?? '',
    interviewType: toInterviewTypeLabel(interview?.interviewType ?? 'FIRST'),
    questionSnippet: item.question ?? '',
  }
}

export const useDifficultQuestions = () => {
  const { data: response } = useGetMyDifficultQnaSets(
    {
      page: 0,
      size: 10,
      sort: ['interviewStartAt,desc'],
    },
    {
      query: {
        select: (data): { content: MyDifficultQuestionResponse[]; totalElements: number } => ({
          content: data?.result?.content ?? [],
          totalElements: data?.result?.totalElements ?? 0,
        }),
      },
    },
  )

  const data = (response?.content ?? []).map(mapDifficultQuestion)

  return {
    data,
    count: response?.totalElements ?? data.length,
  }
}
