import type { HighlightRect } from '@/pages/record/_link/contexts'

type HighlightLayerProps = {
  savedRects: HighlightRect[]
  pendingRects: HighlightRect[]
}

export function HighlightLayer({ savedRects, pendingRects }: HighlightLayerProps) {
  return (
    <>
      {savedRects.map((rect) => (
        <HighlightRectDiv key={`saved-${rect.pageNum}-${rect.x}-${rect.y}`} rect={rect} variant="saved" />
      ))}
      {pendingRects.map((rect, i) => (
        <HighlightRectDiv key={`pending-${i}`} rect={rect} variant="pending" />
      ))}
    </>
  )
}

type HighlightRectDivProps = {
  rect: HighlightRect
  variant: 'saved' | 'pending'
}

function HighlightRectDiv({ rect, variant }: HighlightRectDivProps) {
  const bgColor = variant === 'saved' ? 'bg-orange-400/40' : 'bg-orange-300/40'

  return (
    // TODO: div 대신 absolute position된 canvas로 변경 고려 / transform 등 GPU 가속 활용 고민
    <div
      className={`pointer-events-none absolute ${bgColor}`}
      style={{
        left: `${rect.x * 100}%`,
        top: `${rect.y * 100}%`,
        width: `${rect.width * 100}%`,
        height: `${rect.height * 100}%`,
      }}
    />
  )
}
