const FIVE_MINUTES = 5 * 60 * 1000
const TEN_MINUTES = 10 * 60 * 1000
const THIRTY_MINUTES = 30 * 60 * 1000
const ONE_HOUR = 60 * 60 * 1000

/**
 * staleTime / gcTime 설정 기준
 * - Infinity: 서버 정적 데이터 - 세션 중 변경 없음
 * - 1 hour: 본인만 수정 가능 - mutation 후 invalidate로 즉시 반영
 * - 5~10 min: 사용자 CRUD 빈번 - 다른 탭/기기 변경 대비 짧게 유지
 * - 30 min: 서버 불변 데이터 - unmount 후 적절한 시점에 캐시 정리
 */

export const SIGNUP_OPTIONS_STALE_TIME = Infinity
export const COMPANY_INDUSTRY_JOB_OPTIONS_STALE_TIME = Infinity

export const PROFILE_STALE_TIME = ONE_HOUR
export const PROFILE_GC_TIME = ONE_HOUR

export const PDF_HIGHLIGHTS_STALE_TIME = Infinity
export const PDF_HIGHLIGHTS_GC_TIME = THIRTY_MINUTES

export const SCRAP_FOLDERS_STALE_TIME = FIVE_MINUTES
export const SCRAP_FOLDERS_GC_TIME = TEN_MINUTES

export const PDF_OBJECT_URL_STALE_TIME = Infinity
export const PDF_OBJECT_URL_GC_TIME = Infinity
