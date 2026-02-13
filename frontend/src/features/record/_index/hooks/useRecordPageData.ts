import { getInterviewFull, useGetInterviewFullSuspense } from '@/apis'
import type { InterviewType } from '@/types/interview'

export function useRecordPageData(interviewId: number) {
  return useGetInterviewFullSuspense(interviewId, {
    query: { select: transformInterviewInfo },
  })
}

function transformInterviewInfo(res: Awaited<ReturnType<typeof getInterviewFull>>) {
  const interviewFull = res.result
  if (!interviewFull) throw new Error('인터뷰 데이터가 존재하지 않습니다.')

  return {
    interviewInfo: {
      company: interviewFull.company ?? '',
      jobRole: interviewFull.jobRole ?? '',
      interviewType: interviewFull.interviewType as InterviewType,
      interviewStartAt: interviewFull.interviewStartAt ?? '',
    },
    qnaList: (interviewFull.qnaSets ?? []).map((qnaSet) => ({
      qnaSetId: qnaSet.qnaSetId!,
      questionText: qnaSet.questionText ?? '',
    })),
  }
}
