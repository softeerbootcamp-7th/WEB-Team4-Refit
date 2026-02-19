import { useNavigate } from 'react-router'
import {
  DASHBOARD_BANNER_ACTION,
  DASHBOARD_BANNER_VARIANTS,
  type DashboardBannerVariant,
} from '@/features/dashboard/_index/constants/dashboardBanner'
import { useScheduleModal } from '@/features/dashboard/_index/contexts/ScheduleModalContext'
import { ROUTES } from '@/routes/routes'

export function useDashboardBanner() {
  const scheduleModal = useScheduleModal()
  const navigate = useNavigate()

  const handleBannerClick = (variant: DashboardBannerVariant) => {
    const config = DASHBOARD_BANNER_VARIANTS[variant]
    const action = config.action

    switch (action) {
      case DASHBOARD_BANNER_ACTION.OPEN_ADD_SCHEDULE_MODAL:
        scheduleModal?.openModal()
        break
      case DASHBOARD_BANNER_ACTION.NAVIGATE_TO_TREND_QUESTIONS:
        navigate(ROUTES.DASHBOARD_TREND_QUESTIONS)
        break
      case DASHBOARD_BANNER_ACTION.NAVIGATE_TO_MY_INTERVIEWS:
        navigate(ROUTES.DASHBOARD_MY_INTERVIEWS)
        break
      default:
        break
    }
  }

  return { handleBannerClick }
}
