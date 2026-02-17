import { BubbleTailIcon, PencilChickIcon } from '@/designs/assets'
import { DASHBOARD_BANNER_VARIANTS } from '@/features/dashboard/_index/constants/dashboardBanner'
import type { DashboardBannerVariant } from '@/features/dashboard/_index/constants/dashboardBanner'
import { useDashboardBanner } from '@/features/dashboard/_index/hooks/useDashboardBanner'

interface DashboardBannerProps {
  variant: DashboardBannerVariant
  titleText?: string
}

export default function DashboardBanner({ variant, titleText }: DashboardBannerProps) {
  const config = DASHBOARD_BANNER_VARIANTS[variant]
  const { handleBannerClick } = useDashboardBanner()
  const displayTitle = titleText ?? config.titleText

  return (
    <button
      onClick={() => handleBannerClick(variant)}
      className={`group border-box relative flex h-30 w-full cursor-pointer items-center justify-between overflow-hidden rounded-[20px] pl-10 ${config.bg}`}
    >
      <div
        className={`title-s-semibold ${config.textColor} text-left`}
        dangerouslySetInnerHTML={{ __html: displayTitle }}
      />
      <div className="z-1">
        <Bubble className="absolute right-39 bottom-9" bubbleHex={config.bubbleHex} bubbleText={config.btnText} />
        <PencilChickIcon className="group-hover:animate-wiggle-x absolute right-4 bottom-[-6px] origin-bottom transition-transform" />
      </div>

      {/* Decorative Diamonds */}
      <Diamond className={`bottom-[20%] left-[2%] h-2 w-2 ${config.diamondColor}`} />
      <Diamond className={`top-[20%] left-[41%] h-2.5 w-2.5 ${config.diamondColor}`} />
      <Diamond className={`top-[28%] left-[44%] h-1.5 w-1.5 ${config.diamondColor}`} />
      <Diamond className={`bottom-[20%] left-[50%] h-2 w-2 ${config.diamondColor}`} />
      <Diamond className={`top-[10%] right-[42%] h-3 w-3 ${config.diamondColor}`} />
      <Diamond className={`top-[8%] right-[2%] h-1.5 w-1.5 ${config.diamondColor}`} />
    </button>
  )
}

function Bubble({ bubbleHex, bubbleText, className }: { bubbleHex: string; bubbleText: string; className?: string }) {
  return (
    <div
      className={[className, 'flex items-center justify-center rounded-xl px-6 py-3'].filter(Boolean).join(' ')}
      style={{ backgroundColor: bubbleHex }}
    >
      <span className="body-l-bold text-white">{bubbleText}</span>
      <BubbleTailIcon className="absolute top-1/2 -right-[10px] -translate-y-1/2" style={{ color: bubbleHex }} />
    </div>
  )
}

function Diamond({ className }: { className?: string }) {
  return <div className={`absolute rotate-45 rounded-[1px] ${className}`} />
}
