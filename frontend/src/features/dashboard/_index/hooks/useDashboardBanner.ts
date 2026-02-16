import {
  DASHBOARD_BANNER_ACTION,
  DASHBOARD_BANNER_VARIANTS,
  type DashboardBannerVariant,
} from '@/features/dashboard/_index/constants/dashboardBanner'
import { useScheduleModal } from '@/features/dashboard/_index/contexts/ScheduleModalContext'

export function useDashboardBanner() {
  const scheduleModal = useScheduleModal()

  const handleBannerClick = (variant: DashboardBannerVariant) => {
    const config = DASHBOARD_BANNER_VARIANTS[variant]
    const action = config.action

    switch (action) {
      case DASHBOARD_BANNER_ACTION.OPEN_ADD_SCHEDULE_MODAL:
        scheduleModal?.openModal()
        break
      default:
        break
    }
  }

  return { handleBannerClick }
}
