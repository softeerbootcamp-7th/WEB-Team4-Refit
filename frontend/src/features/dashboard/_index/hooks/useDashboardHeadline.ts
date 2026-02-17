import { useGetDashboardHeadline } from '@/apis'
import type { DashboardHeadlineResponse } from '@/apis'
import type { DashboardBannerVariant } from '@/features/dashboard/_index/constants/dashboardBanner'

const DEFAULT_NICKNAME = '정윤'

const HEADLINE_VARIANT_MAP: Record<DashboardHeadlineResponse['headlineType'], DashboardBannerVariant> = {
  REGISTER_INTERVIEW: 'no_schedule',
  PREPARE_INTERVIEW: 'upcoming',
  REVIEW_INTERVIEW: 'review',
  CHECK_INTERVIEW_HISTORY: 'no_weekly',
}

function buildBannerTitleText(headline?: DashboardHeadlineResponse): string {
  const nickname = headline?.nickname?.trim() || DEFAULT_NICKNAME

  switch (headline?.headlineType) {
    case 'PREPARE_INTERVIEW': {
      if (headline.upcomingInterviewDday === 0) {
        return `${nickname}님, 오늘 예정된 면접이 있어요<br/>기출 질문으로 면접에 대비해 보세요`
      }

      if (typeof headline.upcomingInterviewDday === 'number' && headline.upcomingInterviewDday > 0) {
        return `${nickname}님, ${headline.upcomingInterviewDday}일 후에 예정된 면접이 있어요<br/>기출 질문으로 면접에 대비해 보세요`
      }

      return `${nickname}님, 예정된 면접이 있어요<br/>기출 질문으로 면접에 대비해 보세요`
    }

    case 'REVIEW_INTERVIEW':
      return `${nickname}님, 아직 완료되지 않은 작업이 있어요!<br/>다음 면접을 위해 지난 면접을 복기해 보세요`

    case 'CHECK_INTERVIEW_HISTORY':
      return `${nickname}님, 이번주에는 예정된 면접이 없어요<br/>면접 히스토리를 미리 확인해 보세요!`

    case 'REGISTER_INTERVIEW':
    default:
      return `${nickname}님, 아직 면접 일정이 없네요!<br/>캘린더에 면접 일정을 등록해보세요.`
  }
}

export function useDashboardHeadline() {
  const { data: response, isLoading } = useGetDashboardHeadline()
  const headline = response?.result

  return {
    variant: headline ? HEADLINE_VARIANT_MAP[headline.headlineType] : ('no_schedule' as const),
    titleText: buildBannerTitleText(headline),
    isLoading,
  }
}
