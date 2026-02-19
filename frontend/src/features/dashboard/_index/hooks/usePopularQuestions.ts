import { useGetFrequentQuestions, useGetMyProfileInfo } from '@/apis'

export interface PopularQuestionItem {
  id: number
  rank: number
  category: string
  industry: string
  jobCategory: string
}

export const usePopularQuestions = () => {
  const { data: profile, isSuccess: isProfileLoaded } = useGetMyProfileInfo({
    query: {
      select: (response) => ({
        nickname: response.result?.nickname?.trim() || '회원',
        industryId: response.result?.industryId,
        jobCategoryId: response.result?.jobCategoryId,
      }),
    },
  })

  const { data: rows = [] } = useGetFrequentQuestions(
    {
      industryIds: profile?.industryId ? [profile.industryId] : undefined,
      jobCategoryIds: profile?.jobCategoryId ? [profile.jobCategoryId] : undefined,
      page: 0,
      size: 10,
    },
    {
      query: {
        enabled: isProfileLoaded,
        select: (response): PopularQuestionItem[] =>
          (response.result?.content ?? []).map((item, index) => ({
            id: index + 1,
            rank: index + 1,
            category: item.question ?? '',
            industry: item.industryName ?? '',
            jobCategory: item.jobCategoryName ?? '',
          })),
      },
    },
  )

  return {
    data: rows,
    nickname: profile?.nickname ?? '회원',
  }
}
