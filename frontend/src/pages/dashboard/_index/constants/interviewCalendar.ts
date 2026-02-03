export const WEEKDAYS = [
  { label: '일' },
  { label: '월' },
  { label: '화' },
  { label: '수' },
  { label: '목' },
  { label: '금' },
  { label: '토' },
] as const

/**
 * 캘린더 면접 일정 점 색상 기준
 * - orange: 기록 안 함 (다가오는 면접 포함, 아직 진행 전이라 복기 기록이 없는 경우)
 * - gray: 기록 함 (이미 면접 후 복기 기록을 완료한 경우)
 */
export type EventColor = 'gray' | 'orange'

export const EVENT_COLOR_CLASS: Record<EventColor, string> = {
  gray: 'bg-gray-300',
  orange: 'bg-orange-200',
} as const

export const DATE_CELL_STYLE = {
  default: 'text-gray-700 group-hover:bg-gray-50',
  selected: 'bg-orange-500 text-white shadow-sm',
  today: 'bg-orange-100 text-orange-500',
  otherMonth: 'text-gray-300',
} as const

export const SCHEDULE_MODAL_STEP_CONFIG = {
  1: { title: '면접 일정 추가', description: '면접 정보를 입력해주세요' },
  2: {
    title: '면접 일정 추가',
    description: '면접 유형과 일시를 알려주세요',
  },
} as const
