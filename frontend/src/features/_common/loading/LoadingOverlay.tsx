import type { ReactNode } from 'react'
import HourGlassIcon from '@/designs/assets/hour_glass_icon.svg?react'

type LoadingOverlayProps = {
  text?: ReactNode
}

export default function LoadingOverlay({ text }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60">
      <div className="flex flex-col items-center gap-4 text-center">
        <HourGlassIcon width="48" height="48" className="animate-spin text-white [animation-duration:2s]" />
        {text && <span className="title-m-bold text-white">{text}</span>}
      </div>
    </div>
  )
}
