import type { ValueOf } from '@/types/utils'

export const DASHBOARD_BANNER_ACTION = {
  OPEN_ADD_SCHEDULE_MODAL: 'open_add_schedule_modal',
  NAVIGATE_TO_TREND_QUESTIONS: 'navigate_to_trend_questions',
  NAVIGATE_TO_MY_INTERVIEWS: 'navigate_to_my_interviews',
  /** 추후 추가: navigate_to_prep, navigate_to_review, navigate_to_history */
} as const

export type DashboardBannerAction = ValueOf<typeof DASHBOARD_BANNER_ACTION>
export type DashboardBannerVariant = 'no_schedule' | 'upcoming' | 'review' | 'no_weekly'

export interface DashboardBannerVariantConfig {
  bg: string
  bubbleHex: string
  diamondColor: string
  textColor: string
  titleText: string
  btnText: string
  action?: DashboardBannerAction
}

export const DASHBOARD_BANNER_VARIANTS: Record<DashboardBannerVariant, DashboardBannerVariantConfig> = {
  no_schedule: {
    bg: 'bg-[#DCF0FF]',
    bubbleHex: '#2D9AFF',
    diamondColor: 'bg-blue-200',
    textColor: 'text-[#1E3D56]',
    titleText: '정윤님, 아직 면접 일정이 없네요!<br/>캘린더에 면접 일정을 등록해보세요.',
    btnText: '면접 일정 등록하기',
    action: DASHBOARD_BANNER_ACTION.OPEN_ADD_SCHEDULE_MODAL,
  },
  upcoming: {
    bg: 'bg-[#FFF1DC]',
    bubbleHex: '#FF8933',
    diamondColor: 'bg-orange-200',
    textColor: 'text-[#361E13]',
    titleText: '정윤님, 3일 후에 예정된 면접이 있어요<br/>기출 질문으로 면접에 대비해 보세요',
    btnText: '면접 대비하기',
    action: DASHBOARD_BANNER_ACTION.NAVIGATE_TO_TREND_QUESTIONS,
  },
  review: {
    bg: 'bg-[#DEF6E1]',
    bubbleHex: '#58CC62',
    diamondColor: 'bg-green-200',
    textColor: 'text-[#102D1D]',
    titleText: '정윤님, 아직 완료되지 않은 작업이 있어요!<br/>다음 면접을 위해 지난 면접을 복기해 보세요',
    btnText: '면접 복기 시작하기',
  },
  no_weekly: {
    bg: 'bg-[#FFEAF7]',
    bubbleHex: '#FF5FAF',
    diamondColor: 'bg-pink-200',
    textColor: 'text-[#39162C]',
    titleText: '정윤님, 이번주에는 예정된 면접이 없어요<br/>면접 히스토리를 미리 확인해 보세요!',
    btnText: '면접 히스토리 확인하기',
    action: DASHBOARD_BANNER_ACTION.NAVIGATE_TO_MY_INTERVIEWS,
  },
}
